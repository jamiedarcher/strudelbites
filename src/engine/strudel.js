/**
 * @file The sound engine: a thin wrapper around Strudel (`@strudel/web`).
 *
 * The rest of the app only ever sends this module a string of Strudel code.
 * Strudel turns that code into a pattern and plays it with Web Audio. Keeping
 * all Strudel calls here means the app could swap or upgrade Strudel in one place.
 */
import { initStrudel, samples } from '@strudel/web';

let replPromise = null;
let playing = false;
let previewTimer = null;
const listeners = new Set();

/**
 * Tells everyone listening that the engine changed (started, stopped or failed).
 * @param {{playing: boolean, error?: Error|null}} state - The new state.
 */
function emit(state) {
  listeners.forEach((fn) => fn(state));
}

/**
 * Starts Strudel and loads the drum and animal samples. Safe to call many
 * times; it only starts once. Sound itself can only begin after the user taps
 * something, because browsers (especially iPad Safari) block autoplay.
 * @returns {Promise<object>} The Strudel REPL object.
 */
export function startEngine() {
  if (!replPromise) {
    replPromise = initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples'),
      onEvalError: (error) => emit({ playing, error }),
    });
  }
  return replPromise;
}

/**
 * Plays (or live-updates) a piece of Strudel code.
 * @param {string} code - Strudel code such as `s("bd sd")`. Empty code plays silence.
 * @returns {Promise<void>}
 * @example await play('s("bd ~ bd ~")')
 */
export async function play(code) {
  clearTimeout(previewTimer);
  const repl = await startEngine();
  await repl.evaluate(code?.trim() ? code : 'silence');
  playing = true;
  emit({ playing, error: null });
}

/**
 * Plays code for a short time, then stops by itself. Used by "Listen first" steps.
 * @param {string} code - Strudel code to preview.
 * @param {number} [ms=4200] - How long to play, in milliseconds (4.2 s is about two bars).
 * @returns {Promise<void>}
 */
export async function preview(code, ms = 4200) {
  await play(code);
  previewTimer = setTimeout(stop, ms);
}

/**
 * Stops all sound.
 * @returns {Promise<void>}
 */
export async function stop() {
  clearTimeout(previewTimer);
  if (!replPromise) return;
  const repl = await replPromise;
  repl.stop();
  playing = false;
  emit({ playing, error: null });
}

/**
 * Changes the tempo.
 * @param {number} cps - Cycles per second. In StrudelBites one cycle is one 4-beat bar, so 0.5 cps = 120 BPM.
 * @returns {Promise<void>}
 */
export async function setTempo(cps) {
  const repl = await startEngine();
  repl.setCps(cps);
}

/**
 * Returns whether sound is currently playing.
 * @returns {boolean}
 */
export function isPlaying() {
  return playing;
}

/**
 * Subscribes to engine changes.
 * @param {(state: {playing: boolean, error?: Error|null}) => void} fn - Called on every change.
 * @returns {() => void} Call this to unsubscribe.
 */
export function onEngineChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
