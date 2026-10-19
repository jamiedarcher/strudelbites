/**
 * @file Draws the song as real music notation (a staff), using VexFlow.
 *
 * - Melodies and scale tunes go on a treble staff, with rainbow-coloured
 *   noteheads and the note name underneath (a reading aid that can be
 *   switched off). Flats get a ♭ sign. Bouncy (staccato) notes get dots;
 *   smooth (legato) notes get a slur (curved line).
 * - Chords go on a treble staff, their notes stacked like a snowman.
 * - Drum and sound tracks share one percussion staff, the way drum music is
 *   written: each sound has its own line or space, cymbals get "x" heads.
 *
 * One Strudel cycle is one bar of 4/4. Speed blocks change note lengths:
 * twice as fast halves every note.
 *
 * `renderStaff` also returns a map from (track, event) to the drawn note, so
 * the note being played right now can light up (see `markPlaying`).
 */
import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Beam,
  Annotation,
  BarNote,
  Accidental,
  Articulation,
  Curve,
  Dot,
  Modifier,
} from 'vexflow';
import { SOUNDS, NOTES, LENGTHS, SCALES, byId, staffKey, noteColour } from '../blocks/catalog.js';
import { flattenLeaves, chordNotes } from '../blocks/model.js';

const ROW_HEIGHT = 150;
const LEFT = 10;

/** Note lengths in sixteenths → VexFlow durations. Dotted lengths get a dot. */
const DURATIONS = { 16: 'w', 12: 'hd', 8: 'h', 6: 'qd', 4: 'q', 3: '8d', 2: '8', 1: '16' };

/**
 * Picks the VexFlow duration closest to a length in sixteenths.
 * @param {number} sixteenths - Length of the note.
 * @returns {string} VexFlow duration such as `"q"` or `"hd"`.
 */
function durationFor(sixteenths) {
  const keys = Object.keys(DURATIONS).map(Number);
  const best = keys.reduce((a, b) => (Math.abs(b - sixteenths) < Math.abs(a - sixteenths) ? b : a));
  return DURATIONS[best];
}

/**
 * Creates one staff note (or rest), with colour, flat sign, dot, name and articulation.
 * @param {{names: string[]|null, sixteenths: number, label?: string, colour: string, staccato?: boolean, showName: boolean}} spec
 * @returns {StaveNote}
 */
function makeNote({ names, sixteenths, label, colour, staccato, showName }) {
  const duration = durationFor(sixteenths);
  const dotted = duration.endsWith('d');
  const base = dotted ? duration.slice(0, -1) : duration;
  if (!names) {
    const rest = new StaveNote({ keys: ['b/4'], duration: `${base}r` });
    if (dotted) Dot.buildAndAttach([rest], { all: true });
    return rest;
  }
  const keys = names.map(staffKey);
  const note = new StaveNote({ keys: keys.map((k) => k.key), duration: base, auto_stem: true });
  keys.forEach((k, i) => {
    if (k.accidental) note.addModifier(new Accidental(k.accidental), i);
    note.setKeyStyle(i, { fillStyle: noteColour(names[i]), strokeStyle: noteColour(names[i]) });
  });
  note.setStemStyle({ strokeStyle: colour });
  if (dotted) Dot.buildAndAttach([note], { all: true });
  if (staccato) note.addModifier(new Articulation('a.').setPosition(Modifier.Position.BELOW), 0);
  if (showName && label) {
    note.addModifier(
      new Annotation(label).setVerticalJustification(Annotation.VerticalJustify.BOTTOM).setFont('Baloo 2', 14, 'bold'),
      0,
    );
  }
  return note;
}

/**
 * Builds the notes for a melody, scale tune or chords track.
 * @param {object} track - A leaf track.
 * @param {number} factor - Speed factor from speed blocks.
 * @param {boolean} showName - Show note names under notes.
 * @returns {{tickables: Array, notes: Array<StaveNote>, events: Array<StaveNote>, beats: number, legato: boolean}}
 *   Everything to draw, the notes alone (for beams), one note per playable event, total beats, and whether to draw a slur.
 */
function pitchedNotes(track, factor, showName) {
  const items = [];
  if (track.kind === 'chords') {
    track.chords.forEach((id) => {
      const names = chordNotes(id);
      items.push({ names, sixteenths: 8 / factor, label: id, colour: noteColour(names[0]) });
    });
  } else {
    const scale = byId(SCALES, track.scale)?.notes;
    track.notes.forEach((n) => {
      const pitch = track.kind === 'scale' ? (n.degree === 'rest' ? 'rest' : scale[Number(n.degree)]) : n.pitch;
      const length = byId(LENGTHS, n.len) ?? LENGTHS[2];
      const rest = pitch === 'rest';
      items.push({
        names: rest ? null : [pitch],
        sixteenths: (length.eighths * 2) / factor,
        label: rest ? '' : pitch[0].toUpperCase() + (pitch[1] === 'b' && pitch.length === 3 ? '♭' : ''),
        colour: rest ? '#868E96' : noteColour(pitch),
        staccato: track.style === 'staccato',
      });
    });
  }
  const tickables = [];
  const notes = [];
  let sixteenths = 0;
  items.forEach((item, i) => {
    const note = makeNote({ ...item, showName });
    tickables.push(note);
    notes.push(note);
    sixteenths += item.sixteenths;
    if (sixteenths % 16 === 0 && i < items.length - 1) tickables.push(new BarNote());
  });
  return { tickables, notes, events: notes, beats: sixteenths / 4, legato: track.style === 'legato' };
}

/**
 * Builds one bar of drums on a percussion staff from all drum/sound tracks.
 * @param {Array<{track: object, factor: number, leaf: number}>} drums - Drum leaves.
 * @returns {{notes: Array<StaveNote>, eventMap: Map<string, StaveNote>}} The notes, and a map from "leaf:event" to the note that shows it.
 */
function drumNotes(drums) {
  // Steps per bar for each track after speed changes (powers of two only).
  const perBar = drums.map(({ track, factor }) => (track.kind === 'beat' ? track.steps.length : 1) * factor);
  const grid = Math.min(16, Math.max(4, ...perBar.filter((n) => n >= 1)));
  const duration = durationFor(16 / grid);
  const notes = [];
  const eventMap = new Map();
  for (let i = 0; i < grid; i++) {
    const hits = [];
    drums.forEach(({ track, leaf }, d) => {
      const steps = track.kind === 'beat' ? track.steps : '1';
      const span = grid / perBar[d]; // grid cells per step (can be < 1 or > 1)
      if (span >= 1) {
        if (i % span !== 0) return;
        const step = (i / span) % steps.length;
        if (steps[step] === '1') hits.push({ sound: track.sound, leaf, step });
      } else {
        const step = Math.round(i / span) % steps.length;
        if (steps[step] === '1') hits.push({ sound: track.sound, leaf, step });
      }
    });
    if (!hits.length) {
      notes.push(new StaveNote({ keys: ['b/4'], duration: `${duration}r`, clef: 'percussion' }));
      continue;
    }
    const sounds = [...new Set(hits.map((h) => h.sound))].map((id) => byId(SOUNDS, id)).filter(Boolean);
    const note = new StaveNote({ keys: sounds.map((s) => s.staff), duration, clef: 'percussion', stem_direction: 1 });
    sounds.forEach((s, k) => note.setKeyStyle(k, { fillStyle: s.colour, strokeStyle: s.colour }));
    hits.forEach((h) => {
      const key = `${h.leaf}:${h.step}`;
      if (!eventMap.has(key)) eventMap.set(key, note);
    });
    notes.push(note);
  }
  return { notes, eventMap };
}

/**
 * Draws one staff row and its notes.
 * @param {object} context - VexFlow render context.
 * @param {number} y - Top of the row.
 * @param {number} width - Row width.
 * @param {'treble'|'percussion'} clef - Which clef to draw.
 * @param {{tickables: Array, notes: Array<StaveNote>, beats: number, legato?: boolean}} row - What to draw.
 * @param {boolean} [meter=true] - Draw the 4/4 time signature (left out in small "read this" boxes).
 */
function drawRow(context, y, width, clef, row, meter = true) {
  const stave = new Stave(LEFT, y, width - LEFT * 2);
  stave.addClef(clef);
  if (meter) stave.addTimeSignature('4/4');
  stave.setContext(context).draw();
  const voice = new Voice({ num_beats: Math.max(row.beats, 1), beat_value: 4 }).setMode(Voice.Mode.SOFT);
  voice.addTickables(row.tickables);
  const beams = Beam.generateBeams(row.notes);
  new Formatter().joinVoices([voice]).format([voice], stave.getNoteEndX() - stave.getNoteStartX() - 16);
  voice.draw(context, stave);
  beams.forEach((beam) => beam.setContext(context).draw());
  if (row.legato) {
    const sounding = row.notes.filter((n) => !n.isRest());
    if (sounding.length > 1) {
      new Curve(sounding[0], sounding.at(-1), { cps: [{ x: 0, y: 12 }, { x: 0, y: 12 }] }).setContext(context).draw();
    }
  }
}

/**
 * Renders the song into a container element as SVG notation.
 * @param {HTMLElement} element - Where to draw (its contents are replaced).
 * @param {Array<object>} tracks - From `readSong`.
 * @param {{width?: number, names?: boolean, scale?: number, meter?: boolean}} [options] - Drawing width in pixels,
 *   whether to show note names, a zoom factor (notation is drawn larger for young readers), and whether to
 *   draw the time signature.
 * @returns {{rows: number, events: Map<string, Element>}} How many staff rows were drawn (0 = nothing to show),
 *   and a map from "leaf:event" to the SVG element of that note, for play-along highlighting.
 */
export function renderStaff(element, tracks, { width = 340, names = true, scale = 1.35, meter = true } = {}) {
  element.innerHTML = '';
  const leaves = flattenLeaves(tracks).map((l, leaf) => ({ ...l, leaf }));
  const pitched = leaves.filter(({ track }) => ['melody', 'scale'].includes(track.kind) ? track.notes.length : track.kind === 'chords');
  const drums = leaves.filter(({ track }) => track.kind === 'sound' || track.kind === 'beat');
  const rows = pitched.length + (drums.length ? 1 : 0);
  const events = new Map();
  if (!rows) return { rows: 0, events };

  const renderer = new Renderer(element, Renderer.Backends.SVG);
  renderer.resize(width, rows * ROW_HEIGHT * scale);
  const context = renderer.getContext();
  context.scale(scale, scale);
  const logicalWidth = width / scale;

  const noteMaps = [];
  let y = 10;
  for (const { track, factor, leaf } of pitched) {
    const row = pitchedNotes(track, factor, names);
    drawRow(context, y, logicalWidth, 'treble', row, meter);
    row.events.forEach((note, i) => noteMaps.push([`${leaf}:${i}`, note]));
    y += ROW_HEIGHT;
  }
  if (drums.length) {
    const { notes, eventMap } = drumNotes(drums);
    drawRow(context, y, logicalWidth, 'percussion', { tickables: notes, notes, beats: 4 }, meter);
    eventMap.forEach((note, key) => noteMaps.push([key, note]));
  }
  for (const [key, note] of noteMaps) {
    const el = note.getSVGElement?.() ?? element.querySelector(`#vf-${note.getAttribute('id')}`);
    if (el) events.set(key, el);
  }
  return { rows, events };
}

/**
 * Lights up the note that is playing right now.
 * @param {Map<string, Element>} events - From `renderStaff`.
 * @param {number} leaf - Track (leaf) number.
 * @param {number} index - Event number within that track.
 */
export function markPlaying(events, leaf, index) {
  const el = events.get(`${leaf}:${index}`);
  if (!el) return;
  el.classList.remove('sb-now');
  // Restart the animation even if the same note plays twice in a row.
  void el.getBoundingClientRect();
  el.classList.add('sb-now');
}
