/**
 * @file Turns blocks into music: first into a simple "song model" (a list of
 * tracks), then into Strudel code.
 *
 * Why the in-between model? The same model feeds four things: the Strudel
 * code (to play), the staff view (to read music), the lesson checks (to tick
 * off steps) and play-along highlighting. None of them need to know Blockly.
 *
 * Track shapes (every track also has `id`, the id of its block):
 * - `{ kind: 'sound', sound: 'bd' }`
 * - `{ kind: 'beat', sound: 'bd', steps: '1010' }`
 * - `{ kind: 'melody', instrument, style, notes: [{ id, pitch: 'c4', len: 'q' }] }`
 * - `{ kind: 'scale', scale: 'C4:major', instrument, notes: [{ id, degree: '0', len: 'q' }] }`
 * - `{ kind: 'chords', chords: ['C', 'F', 'G', 'C'], instrument }`
 * - `{ kind: 'speed', factor: 2, tracks: [...] }` (wraps other tracks)
 *
 * "Leaves" are the tracks that actually make sound (everything except speed
 * wrappers). Leaves are always numbered in the same order (depth first), so
 * play-along events, staff notes and blocks can find each other.
 */
import { LENGTHS, SPEEDS, STYLES, CHORDS, byId } from './catalog.js';

/**
 * Reads the tracks stacked inside one statement input.
 * @param {import('blockly/core').Block|null} first - First block in the stack.
 * @returns {Array<object>} Tracks.
 */
function readStack(first) {
  const tracks = [];
  for (let block = first; block; block = block.getNextBlock()) {
    if (!block.isEnabled()) continue;
    const id = block.id;
    switch (block.type) {
      case 'strudel_sound':
        tracks.push({ id, kind: 'sound', sound: block.getFieldValue('SOUND') });
        break;
      case 'strudel_beat4':
      case 'strudel_beat8':
        tracks.push({ id, kind: 'beat', sound: block.getFieldValue('SOUND'), steps: block.getFieldValue('STEPS') });
        break;
      case 'strudel_melody': {
        const notes = [];
        for (let n = block.getInputTargetBlock('NOTES'); n; n = n.getNextBlock()) {
          notes.push({ id: n.id, pitch: n.getFieldValue('PITCH'), len: n.getFieldValue('LEN') });
        }
        tracks.push({
          id,
          kind: 'melody',
          instrument: block.getFieldValue('INSTRUMENT'),
          style: block.getFieldValue('STYLE') ?? 'normal',
          notes,
        });
        break;
      }
      case 'strudel_scale_tune': {
        const notes = [];
        for (let n = block.getInputTargetBlock('STEPS'); n; n = n.getNextBlock()) {
          notes.push({ id: n.id, degree: n.getFieldValue('DEGREE'), len: n.getFieldValue('LEN') });
        }
        tracks.push({ id, kind: 'scale', scale: block.getFieldValue('SCALE'), instrument: block.getFieldValue('INSTRUMENT'), notes });
        break;
      }
      case 'strudel_chords':
        tracks.push({
          id,
          kind: 'chords',
          chords: [0, 1, 2, 3].map((i) => block.getFieldValue(`CHORD${i}`)),
          instrument: block.getFieldValue('INSTRUMENT'),
        });
        break;
      case 'strudel_speed':
        tracks.push({
          id,
          kind: 'speed',
          factor: byId(SPEEDS, block.getFieldValue('SPEED'))?.factor ?? 1,
          tracks: readStack(block.getInputTargetBlock('TRACKS')),
        });
        break;
    }
  }
  return tracks;
}

/**
 * Reads the song from a Blockly workspace. Only blocks snapped inside
 * "My song" count; loose blocks are greyed out and ignored.
 * @param {import('blockly/core').Workspace} workspace - The workspace.
 * @returns {Array<object>} The tracks, in order.
 */
export function readSong(workspace) {
  const song = workspace.getBlocksByType('strudel_song', false)[0];
  return song ? readStack(song.getInputTargetBlock('TRACKS')) : [];
}

/**
 * Lists every sound-making track (leaf) in play order, with the total speed
 * factor from any speed blocks around it.
 * @param {Array<object>} tracks - From `readSong`.
 * @param {number} [factor=1] - Speed from wrappers further out (used when recursing).
 * @returns {Array<{track: object, factor: number}>}
 */
export function flattenLeaves(tracks, factor = 1) {
  return tracks.flatMap((track) =>
    track.kind === 'speed' ? flattenLeaves(track.tracks, factor * track.factor) : [{ track, factor }],
  );
}

/**
 * Every track of one kind, wherever it sits (inside speed blocks too).
 * @param {Array<object>} tracks - From `readSong`.
 * @param {string} kind - Track kind.
 * @returns {Array<object>}
 */
export function findTracks(tracks, kind) {
  return tracks.flatMap((t) => [...(t.kind === kind ? [t] : []), ...(t.kind === 'speed' ? findTracks(t.tracks, kind) : [])]);
}

/**
 * Length of a note list in eighth notes (a 4/4 bar is 8 eighths).
 * @param {Array<{len: string}>} notes - Melody or scale notes.
 * @returns {number}
 */
export function melodyEighths(notes) {
  return notes.reduce((sum, n) => sum + (byId(LENGTHS, n.len)?.eighths ?? 2), 0);
}

/**
 * Greatest common divisor, used to keep note weights small (`c4@2 d4` not `c4@4 d4@2`).
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Writes a mini-notation sequence with `@` weights for notes of different lengths.
 * @param {Array<{len: string}>} notes - Notes with lengths.
 * @param {(note: object) => string} name - How to write each note.
 * @returns {{sequence: string, slow: string}} The sequence and any `.slow()` needed to keep one beat per quarter note.
 */
function weighted(notes, name) {
  const weights = notes.map((n) => byId(LENGTHS, n.len)?.eighths ?? 2);
  const divisor = weights.reduce(gcd);
  const sequence = notes
    .map((n, i) => {
      const weight = weights[i] / divisor;
      return weight === 1 ? name(n) : `${name(n)}@${weight}`;
    })
    .join(' ');
  // One Strudel cycle is one bar of 8 eighths. Slow longer or shorter
  // melodies so a quarter note always lasts one beat.
  const bars = melodyEighths(notes) / 8;
  return { sequence, slow: bars === 1 ? '' : `.slow(${+bars.toFixed(3)})` };
}

/**
 * Writes the Strudel code for one sound-making track.
 * @param {object} track - A leaf track.
 * @returns {string} Strudel code, or an empty string if the track is empty.
 * @example trackCode({ kind: 'beat', sound: 'bd', steps: '1010' }) // 's("bd ~ bd ~")'
 */
export function trackCode(track) {
  switch (track.kind) {
    case 'sound':
      return `s("${track.sound}")`;
    case 'beat':
      return `s("${[...track.steps].map((on) => (on === '1' ? track.sound : '~')).join(' ')}")`;
    case 'melody': {
      if (!track.notes.length) return '';
      const { sequence, slow } = weighted(track.notes, (n) => (n.pitch === 'rest' ? '~' : n.pitch));
      const legato = byId(STYLES, track.style)?.legato;
      return `note("${sequence}").s("${track.instrument}")${legato ? `.legato(${legato})` : ''}${slow}`;
    }
    case 'scale': {
      if (!track.notes.length) return '';
      const { sequence, slow } = weighted(track.notes, (n) => (n.degree === 'rest' ? '~' : n.degree));
      return `n("${sequence}").scale("${track.scale}").s("${track.instrument}")${slow}`;
    }
    case 'chords': {
      // Square brackets with commas = notes played together. Each chord lasts
      // two beats, so four chords fill two bars.
      const chords = track.chords.map((id) => `[${chordNotes(id).join(',')}]`);
      return `note("${chords.join(' ')}").s("${track.instrument}").slow(2)`;
    }
  }
  return '';
}

/**
 * The notes in a chord.
 * @param {string} id - Chord name such as `"Am"`.
 * @returns {string[]} Note names.
 */
export function chordNotes(id) {
  return (byId(CHORDS, id) ?? CHORDS[0]).notes;
}

/**
 * Indents every line after the first, for nesting inside `stack(...)`.
 * @param {string} code - Code that may span several lines.
 * @returns {string}
 */
function indent(code) {
  return code.replace(/\n/g, '\n  ');
}

/**
 * Writes the Strudel code for a list of tracks. One track plays on its own;
 * several are wrapped in `stack()` so they play at the same time.
 *
 * With `hooks: true` each sound-making track also reports when it plays
 * (`.onTrigger(...)`), which drives play-along highlighting. Hooks are only
 * added to the code that is played, never to the code learners see.
 * @param {Array<object>} tracks - From `readSong`.
 * @param {{hooks?: boolean}} [options] - Add play-along hooks.
 * @param {{n: number}} [counter] - Leaf counter (used when recursing).
 * @returns {string} Strudel code.
 */
export function songCode(tracks, options = {}, counter = { n: 0 }) {
  const parts = tracks
    .map((track) => {
      if (track.kind === 'speed') {
        const inner = songCode(track.tracks, options, counter);
        if (!inner) return '';
        return track.factor >= 1 ? `${inner}.fast(${track.factor})` : `${inner}.slow(${1 / track.factor})`;
      }
      const code = trackCode(track);
      const index = counter.n++;
      return code && options.hooks ? `${code}.onTrigger(__sbHit(${index}), false)` : code;
    })
    .filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `stack(\n  ${parts.map(indent).join(',\n  ')}\n)`;
}

/**
 * Timing of one leaf: how long its loop is and where each of its events starts.
 * @param {object} track - A leaf track.
 * @param {number} factor - Total speed factor.
 * @returns {{loop: number, starts: number[]}} Loop length in cycles; event starts as fractions (0–1) of the loop.
 */
export function leafTiming(track, factor) {
  let starts = [0];
  let bars = 1;
  if (track.kind === 'beat') starts = [...track.steps].map((_, i) => i / track.steps.length);
  if (track.kind === 'chords') {
    starts = [0, 0.25, 0.5, 0.75];
    bars = 2;
  }
  if (track.kind === 'melody' || track.kind === 'scale') {
    const total = melodyEighths(track.notes) || 1;
    let sum = 0;
    starts = track.notes.map((n) => {
      const start = sum / total;
      sum += byId(LENGTHS, n.len)?.eighths ?? 2;
      return start;
    });
    bars = total / 8;
  }
  return { loop: bars / factor, starts };
}

/**
 * Works out which event of a leaf is playing at a moment in time.
 * @param {{loop: number, starts: number[]}} timing - From `leafTiming`.
 * @param {number} cycle - Time in Strudel cycles (the start of the sound).
 * @returns {number} Event index.
 */
export function eventAt(timing, cycle) {
  const phase = (((cycle % timing.loop) + timing.loop) % timing.loop) / timing.loop;
  let index = 0;
  timing.starts.forEach((start, i) => {
    if (start <= phase + 1e-6) index = i;
  });
  return index;
}
