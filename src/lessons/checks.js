/**
 * @file Small helper functions that lesson steps use to check the learner's song.
 *
 * Every step's `check(ctx)` receives a context object:
 * `{ tracks, code, playing, listened, panel }`, where `tracks` comes from
 * `readSong()` and `panel` is the open side panel ('code', 'staff' or null).
 * Checks must be pure: look, don't change anything.
 */

/**
 * Finds tracks of one kind.
 * @param {object} ctx - Step context.
 * @param {'sound'|'beat'|'melody'} kind - Track kind.
 * @returns {Array<object>}
 */
export function tracksOf(ctx, kind) {
  return ctx.tracks.filter((t) => t.kind === kind);
}

/**
 * True when there is a beat track with exactly this pattern (and, optionally, this sound).
 * @param {object} ctx - Step context.
 * @param {string} steps - Pattern such as `"1010"`.
 * @param {string} [sound] - Sound id such as `"bd"`.
 * @returns {boolean}
 */
export function hasBeat(ctx, steps, sound) {
  return tracksOf(ctx, 'beat').some((t) => t.steps === steps && (!sound || t.sound === sound));
}

/**
 * True when the song is playing and has something in it.
 * @param {object} ctx - Step context.
 * @returns {boolean}
 */
export function isPlayingSong(ctx) {
  return ctx.playing && ctx.code.length > 0;
}

/**
 * All notes from every melody, in order.
 * @param {object} ctx - Step context.
 * @returns {Array<{pitch: string, len: string}>}
 */
export function allNotes(ctx) {
  return tracksOf(ctx, 'melody').flatMap((t) => t.notes);
}
