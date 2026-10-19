/**
 * @file Turns blocks into music: first into a simple "song model" (a list of
 * tracks), then into Strudel code.
 *
 * Why the in-between model? The same model feeds three things: the Strudel
 * code (to play), the staff view (to read music), and the lesson checks (to
 * tick off steps). Each of those only has to understand plain objects, not
 * Blockly.
 *
 * Track shapes:
 * - `{ kind: 'sound', sound: 'bd' }`
 * - `{ kind: 'beat', sound: 'bd', steps: '1010' }`
 * - `{ kind: 'melody', instrument: 'triangle', notes: [{ pitch: 'c4', len: 'q' }] }`
 */
import { LENGTHS, byId } from './catalog.js';

/**
 * Reads the song from a Blockly workspace. Only blocks snapped inside
 * "My song" count; loose blocks are greyed out and ignored.
 * @param {import('blockly/core').Workspace} workspace - The workspace.
 * @returns {Array<object>} The tracks, in order.
 */
export function readSong(workspace) {
  const song = workspace.getBlocksByType('strudel_song', false)[0];
  if (!song) return [];
  const tracks = [];
  for (let block = song.getInputTargetBlock('TRACKS'); block; block = block.getNextBlock()) {
    if (!block.isEnabled()) continue;
    if (block.type === 'strudel_sound') {
      tracks.push({ kind: 'sound', sound: block.getFieldValue('SOUND') });
    } else if (block.type === 'strudel_beat4' || block.type === 'strudel_beat8') {
      tracks.push({ kind: 'beat', sound: block.getFieldValue('SOUND'), steps: block.getFieldValue('STEPS') });
    } else if (block.type === 'strudel_melody') {
      const notes = [];
      for (let n = block.getInputTargetBlock('NOTES'); n; n = n.getNextBlock()) {
        notes.push({ pitch: n.getFieldValue('PITCH'), len: n.getFieldValue('LEN') });
      }
      tracks.push({ kind: 'melody', instrument: block.getFieldValue('INSTRUMENT'), notes });
    }
  }
  return tracks;
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
 * Total length of a melody in eighth notes (a 4/4 bar is 8 eighths).
 * @param {Array<{len: string}>} notes - Melody notes.
 * @returns {number}
 */
export function melodyEighths(notes) {
  return notes.reduce((sum, n) => sum + (byId(LENGTHS, n.len)?.eighths ?? 2), 0);
}

/**
 * Writes the Strudel code for one track.
 * @param {object} track - A track from `readSong`.
 * @returns {string} Strudel code, or an empty string if the track is empty.
 * @example trackCode({ kind: 'beat', sound: 'bd', steps: '1010' }) // 's("bd ~ bd ~")'
 */
export function trackCode(track) {
  if (track.kind === 'sound') return `s("${track.sound}")`;
  if (track.kind === 'beat') {
    const steps = [...track.steps].map((on) => (on === '1' ? track.sound : '~'));
    return `s("${steps.join(' ')}")`;
  }
  if (track.kind === 'melody') {
    if (!track.notes.length) return '';
    // Mini-notation "@n" makes a step n times longer. Weights are measured
    // in eighths, then divided down so plain quarter notes need no "@".
    const weights = track.notes.map((n) => byId(LENGTHS, n.len)?.eighths ?? 2);
    const divisor = weights.reduce(gcd);
    const steps = track.notes.map((n, i) => {
      const name = n.pitch === 'rest' ? '~' : n.pitch;
      const weight = weights[i] / divisor;
      return weight === 1 ? name : `${name}@${weight}`;
    });
    // One Strudel cycle is one bar of 8 eighths. If the melody is longer or
    // shorter than a bar, slow it so a quarter note always lasts one beat.
    const bars = melodyEighths(track.notes) / 8;
    const slow = bars === 1 ? '' : `.slow(${+bars.toFixed(3)})`;
    return `note("${steps.join(' ')}").s("${track.instrument}")${slow}`;
  }
  return '';
}

/**
 * Writes the Strudel code for a whole song. One track plays on its own;
 * several tracks are wrapped in `stack()` so they play at the same time.
 * @param {Array<object>} tracks - From `readSong`.
 * @returns {string} Strudel code ready to play.
 */
export function songCode(tracks) {
  const parts = tracks.map(trackCode).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `stack(\n  ${parts.join(',\n  ')}\n)`;
}
