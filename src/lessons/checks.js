/**
 * @file Small helper functions that lesson steps use to check the learner's song.
 *
 * Every step's `check(ctx)` receives a context object:
 * `{ tracks, code, playing, listened, panel }`, where `tracks` comes from
 * `readSong()` and `panel` is the open side panel ('code', 'staff' or null).
 * Checks must be pure: look, don't change anything.
 */

import { findTracks } from '../blocks/model.js';

/**
 * Finds tracks of one kind, including tracks inside speed blocks.
 * @param {object} ctx - Step context.
 * @param {'sound'|'beat'|'melody'} kind - Track kind.
 * @returns {Array<object>}
 */
export function tracksOf(ctx, kind) {
  return findTracks(ctx.tracks, kind);
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

/**
 * True when some melody has exactly the target's rhythm: the same lengths,
 * with rests in the same places (pitches don't matter).
 * @param {object} ctx - Step context.
 * @param {Array<{pitch: string, len: string}>} target - Notes to match.
 * @returns {boolean}
 */
export function sameRhythm(ctx, target) {
  const shape = (notes) => notes.map((n) => `${n.pitch === 'rest' ? 'r' : 'n'}${n.len}`).join(' ');
  return tracksOf(ctx, 'melody').some((t) => shape(t.notes) === shape(target));
}

/**
 * True when a speed block with this factor wraps at least one track.
 * @param {object} ctx - Step context.
 * @param {number} factor - 2 for faster, 0.5 for slower.
 * @returns {boolean}
 */
export function hasSpeed(ctx, factor) {
  return tracksOf(ctx, 'speed').some((t) => t.factor === factor && t.tracks.length > 0);
}

/**
 * The step numbers (0-based degrees) of every scale tune, in order.
 * @param {object} ctx - Step context.
 * @returns {string[]}
 */
export function scaleDegrees(ctx) {
  return tracksOf(ctx, 'scale').flatMap((t) => t.notes.map((n) => n.degree));
}
