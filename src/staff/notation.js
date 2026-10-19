/**
 * @file Draws the song as real music notation (a staff), using VexFlow.
 *
 * - Melody tracks go on a treble staff, with rainbow-coloured noteheads and
 *   the note name underneath (a reading aid that can be switched off).
 * - Drum and sound tracks share one percussion staff, the way drum music is
 *   written: each sound has its own line or space, cymbals get "x" heads.
 *
 * One Strudel cycle is one bar of 4/4.
 */
import { Renderer, Stave, StaveNote, Voice, Formatter, Beam, Annotation, BarNote } from 'vexflow';
import { SOUNDS, NOTES, LENGTHS, byId } from '../blocks/catalog.js';
import { melodyEighths } from '../blocks/model.js';

const ROW_HEIGHT = 150;
const LEFT = 10;

/**
 * Converts a melody track into VexFlow notes, inserting a bar line every 4 beats.
 * @param {object} track - `{ kind: 'melody', notes }`.
 * @param {boolean} names - Show note names under the notes.
 * @returns {{tickables: Array, notes: Array<StaveNote>}} Everything to draw, plus just the notes (for beaming).
 */
function melodyNotes(track, names) {
  const tickables = [];
  const notes = [];
  let eighths = 0;
  track.notes.forEach((n, i) => {
    const length = byId(LENGTHS, n.len) ?? LENGTHS[2];
    const info = byId(NOTES, n.pitch) ?? NOTES[0];
    const rest = n.pitch === 'rest';
    const note = new StaveNote({
      keys: [info.staff],
      duration: rest ? `${length.vex}r` : length.vex,
      auto_stem: true,
    });
    note.setStyle({ fillStyle: info.colour, strokeStyle: info.colour });
    if (names && !rest) {
      note.addModifier(new Annotation(info.name).setVerticalJustification(Annotation.VerticalJustify.BOTTOM).setFont('Baloo 2', 14, 'bold'), 0);
    }
    tickables.push(note);
    notes.push(note);
    eighths += length.eighths;
    if (eighths % 8 === 0 && i < track.notes.length - 1) tickables.push(new BarNote());
  });
  return { tickables, notes };
}

/**
 * Converts all drum/sound tracks into one bar on a percussion staff.
 * A 4-step beat is written in quarter notes; if any 8-step beat is present,
 * the bar is written in eighth notes.
 * @param {Array<object>} tracks - Tracks of kind `sound` or `beat`.
 * @returns {Array<StaveNote>}
 */
function drumNotes(tracks) {
  const grid = Math.max(4, ...tracks.map((t) => (t.kind === 'beat' ? t.steps.length : 1)));
  const duration = grid > 4 ? '8' : 'q';
  const notes = [];
  for (let i = 0; i < grid; i++) {
    const hits = new Set();
    for (const track of tracks) {
      if (track.kind === 'sound' && i === 0) hits.add(track.sound);
      if (track.kind === 'beat') {
        const step = (i * track.steps.length) / grid;
        if (Number.isInteger(step) && track.steps[step] === '1') hits.add(track.sound);
      }
    }
    if (hits.size === 0) {
      notes.push(new StaveNote({ keys: ['b/4'], duration: `${duration}r`, clef: 'percussion' }));
      continue;
    }
    const sounds = [...hits].map((id) => byId(SOUNDS, id)).filter(Boolean);
    const note = new StaveNote({ keys: sounds.map((s) => s.staff), duration, clef: 'percussion', stem_direction: 1 });
    sounds.forEach((s, k) => note.setKeyStyle(k, { fillStyle: s.colour, strokeStyle: s.colour }));
    notes.push(note);
  }
  return notes;
}

/**
 * Draws one staff row.
 * @param {object} context - VexFlow render context.
 * @param {number} y - Top of the row.
 * @param {number} width - Row width.
 * @param {'treble'|'percussion'} clef - Which clef to draw.
 * @param {Array} tickables - Notes and bar lines.
 * @param {Array<StaveNote>} beamable - Notes that may be beamed together.
 * @param {number} beats - Total length in quarter-note beats.
 */
function drawRow(context, y, width, clef, tickables, beamable, beats) {
  const stave = new Stave(LEFT, y, width - LEFT * 2);
  stave.addClef(clef).addTimeSignature('4/4');
  stave.setContext(context).draw();
  const voice = new Voice({ num_beats: Math.max(beats, 1), beat_value: 4 }).setMode(Voice.Mode.SOFT);
  voice.addTickables(tickables);
  const beams = Beam.generateBeams(beamable);
  new Formatter().joinVoices([voice]).format([voice], stave.getNoteEndX() - stave.getNoteStartX() - 16);
  voice.draw(context, stave);
  beams.forEach((beam) => beam.setContext(context).draw());
}

/**
 * Renders the song into a container element as SVG notation.
 * @param {HTMLElement} element - Where to draw (its contents are replaced).
 * @param {Array<object>} tracks - From `readSong`.
 * @param {{width?: number, names?: boolean, scale?: number}} [options] - Drawing width in pixels, whether to
 *   show note names, and a zoom factor (notation is drawn larger for young readers).
 * @returns {number} How many staff rows were drawn (0 means nothing to show).
 */
export function renderStaff(element, tracks, { width = 340, names = true, scale = 1.35 } = {}) {
  element.innerHTML = '';
  const melodies = tracks.filter((t) => t.kind === 'melody' && t.notes.length);
  const drums = tracks.filter((t) => t.kind === 'sound' || t.kind === 'beat');
  const rows = melodies.length + (drums.length ? 1 : 0);
  if (!rows) return 0;

  const renderer = new Renderer(element, Renderer.Backends.SVG);
  renderer.resize(width, rows * ROW_HEIGHT * scale);
  const context = renderer.getContext();
  context.scale(scale, scale);
  width = width / scale;

  let y = 10;
  for (const melody of melodies) {
    const { tickables, notes } = melodyNotes(melody, names);
    drawRow(context, y, width, 'treble', tickables, notes, melodyEighths(melody.notes) / 2);
    y += ROW_HEIGHT;
  }
  if (drums.length) {
    const notes = drumNotes(drums);
    drawRow(context, y, width, 'percussion', notes, notes, 4);
  }
  return rows;
}
