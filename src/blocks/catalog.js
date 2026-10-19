/**
 * @file The musical building materials: drum and animal sounds, notes,
 * note lengths and instruments, with the emoji, colours and staff positions
 * used to show them. Blocks, code and the staff view all read from here, so
 * a sound added once appears everywhere.
 */

/**
 * Drum and fun sounds. `id` is the Strudel sample name (from the
 * tidalcycles/dirt-samples pack); `staff` is where the sound sits on a
 * percussion staff (VexFlow key syntax, `/x2` = an "x" notehead for cymbals),
 * following standard drum notation. `kit` is the part of the drum kit picture
 * that lights up (see DrumKit.svelte); fun sounds have no kit part.
 */
export const SOUNDS = [
  { id: 'bd', emoji: '🥁', colour: '#E8590C', staff: 'f/4', kit: 'kick' },
  { id: 'sd', emoji: '🪘', colour: '#1971C2', staff: 'c/5', kit: 'snare' },
  { id: 'hh', emoji: '🎩', colour: '#2B8A3E', staff: 'g/5/x2', kit: 'hihat' },
  { id: 'ht', emoji: '🔹', colour: '#3B5BDB', staff: 'e/5', kit: 'tom1' },
  { id: 'mt', emoji: '🔷', colour: '#5F3DC4', staff: 'd/5', kit: 'tom2' },
  { id: 'lt', emoji: '🛢️', colour: '#862E9C', staff: 'a/4', kit: 'floor' },
  { id: 'cr', emoji: '💥', colour: '#E67700', staff: 'a/5/x2', kit: 'crash' },
  { id: '808cy', emoji: '🌕', colour: '#D9480F', staff: 'f/5/x2', kit: 'ride' },
  { id: 'cp', emoji: '👏', colour: '#C2255C', staff: 'c/5/x2' },
  { id: 'cb', emoji: '🐄', colour: '#5F3DC4', staff: 'b/5/x2' },
  { id: 'baa', emoji: '🐑', colour: '#868E96', staff: 'e/4' },
  { id: 'birds', emoji: '🐦', colour: '#0C8599', staff: 'g/4' },
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

/**
 * Speeds for the "faster / slower" wrapper block. `factor` multiplies the
 * speed: 2 = twice as fast (Strudel `.fast(2)`), 0.5 = half speed (`.slow(2)`).
 */
export const SPEEDS = [
  { id: 'fast2', emoji: '🐇', factor: 2 },
  { id: 'slow2', emoji: '🐢', factor: 0.5 },
];

/**
 * Scales for the "scale tune" block. `notes` are the 8 rungs of the ladder
 * (step 1 to step 8), written as Strudel note names with flats as `b`.
 * `id` is the Strudel scale name.
 */
export const SCALES = [
  { id: 'C4:major', emoji: '😀', notes: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'] },
  { id: 'C4:minor', emoji: '😢', notes: ['c4', 'd4', 'eb4', 'f4', 'g4', 'ab4', 'bb4', 'c5'] },
];

/** Chords for the chords block: three notes played together (a triad). */
export const CHORDS = [
  { id: 'C', notes: ['c4', 'e4', 'g4'] },
  { id: 'Dm', notes: ['d4', 'f4', 'a4'] },
  { id: 'Em', notes: ['e4', 'g4', 'b4'] },
  { id: 'F', notes: ['f4', 'a4', 'c5'] },
  { id: 'G', notes: ['g4', 'b4', 'd5'] },
  { id: 'Am', notes: ['a4', 'c5', 'e5'] },
];

/**
 * Melody playing styles (articulation). `legato` is the Strudel value that
 * sets how much of each step a note fills: 0.3 = short and bouncy, 1.5 =
 * smooth notes that overlap. `null` means "normal" (no extra code).
 */
export const STYLES = [
  { id: 'normal', emoji: '🙂', legato: null },
  { id: 'staccato', emoji: '🏀', legato: 0.3 },
  { id: 'legato', emoji: '🌊', legato: 1.5 },
];

/**
 * Turns a Strudel note name into its staff key and accidental.
 * @param {string} name - Note name such as `"eb4"`, `"c5"` or `"g4"`.
 * @returns {{key: string, accidental: string|null, letter: string}} VexFlow key (`"e/4"`), accidental (`"b"`, `"#"` or null) and the letter (`"e"`).
 * @example staffKey('bb4') // { key: 'b/4', accidental: 'b', letter: 'b' }
 */
export function staffKey(name) {
  const [, letter, accidental, octave] = name.match(/^([a-g])(b|#)?(\d)$/);
  return { key: `${letter}/${octave}`, accidental: accidental ?? null, letter };
}

/**
 * The rainbow colour for any note name, matching the note blocks.
 * Flats and sharps share their letter's colour.
 * @param {string} name - Note name such as `"ab4"`.
 * @returns {string} A hex colour.
 */
export function noteColour(name) {
  const letter = name[0];
  return NOTES.find((n) => n.id.startsWith(letter))?.colour ?? '#868E96';
}
