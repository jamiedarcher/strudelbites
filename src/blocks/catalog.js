/**
 * @file The musical building materials: drum and animal sounds, notes,
 * note lengths and instruments, with the emoji, colours and staff positions
 * used to show them. Blocks, code and the staff view all read from here, so
 * a sound added once appears everywhere.
 */

/**
 * Drum and fun sounds. `id` is the Strudel sample name (from the
 * tidalcycles/dirt-samples pack); `staff` is where the sound sits on a
 * percussion staff (VexFlow key syntax, `/x2` = an "x" notehead for cymbals).
 */
export const SOUNDS = [
  { id: 'bd', emoji: '🥁', colour: '#E8590C', staff: 'f/4' },
  { id: 'sd', emoji: '🪘', colour: '#1971C2', staff: 'c/5' },
  { id: 'hh', emoji: '🎩', colour: '#2B8A3E', staff: 'g/5/x2' },
  { id: 'cp', emoji: '👏', colour: '#C2255C', staff: 'd/5/x2' },
  { id: 'cb', emoji: '🐄', colour: '#5F3DC4', staff: 'a/5/x2' },
  { id: 'baa', emoji: '🐑', colour: '#868E96', staff: 'a/4' },
  { id: 'birds', emoji: '🐦', colour: '#0C8599', staff: 'e/5' },
  { id: 'bubble', emoji: '🫧', colour: '#3BC9DB', staff: 'd/4' },
];

/**
 * Notes from middle C up one octave. Colours follow the familiar
 * "rainbow notes" used in children's music teaching, and match the emoji.
 */
export const NOTES = [
  { id: 'c4', name: 'C', emoji: '🔴', colour: '#E03131', staff: 'c/4' },
  { id: 'd4', name: 'D', emoji: '🟠', colour: '#F76707', staff: 'd/4' },
  { id: 'e4', name: 'E', emoji: '🟡', colour: '#E6A800', staff: 'e/4' },
  { id: 'f4', name: 'F', emoji: '🟢', colour: '#2F9E44', staff: 'f/4' },
  { id: 'g4', name: 'G', emoji: '🔵', colour: '#1C7ED6', staff: 'g/4' },
  { id: 'a4', name: 'A', emoji: '🟣', colour: '#7048E8', staff: 'a/4' },
  { id: 'b4', name: 'B', emoji: '🩷', colour: '#D6336C', staff: 'b/4' },
  { id: 'c5', name: 'C', emoji: '🔴', colour: '#C92A2A', staff: 'c/5' },
  { id: 'rest', name: 'rest', emoji: '🤫', colour: '#868E96', staff: 'b/4' },
];

/**
 * Note lengths. `eighths` is the length measured in eighth notes, so a bar
 * of 4/4 holds 8 eighths. `vex` is the VexFlow duration code.
 */
export const LENGTHS = [
  { id: 'w', symbol: '𝅝', beats: '4', eighths: 8, vex: 'w' },
  { id: 'h', symbol: '𝅗𝅥', beats: '2', eighths: 4, vex: 'h' },
  { id: 'q', symbol: '♩', beats: '1', eighths: 2, vex: 'q' },
  { id: '8', symbol: '♪', beats: '½', eighths: 1, vex: '8' },
];

/** Instruments for melodies: Strudel's built-in synth waveforms. */
export const INSTRUMENTS = [
  { id: 'triangle', emoji: '🎹' },
  { id: 'sine', emoji: '🔔' },
  { id: 'square', emoji: '🤖' },
  { id: 'sawtooth', emoji: '🎺' },
];

/**
 * Finds an item by id in one of the lists above.
 * @template T
 * @param {T[]} list - For example `SOUNDS` or `NOTES`.
 * @param {string} id - The id to find.
 * @returns {T|undefined}
 */
export function byId(list, id) {
  return list.find((item) => item.id === id);
}
