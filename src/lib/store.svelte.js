/**
 * @file Shared, reactive app state: players (profiles), their progress and settings.
 *
 * Svelte 5 `$state` makes `app` reactive, so any component reading it updates
 * automatically. Call `persist()` after changing it to save to the browser.
 */
import { loadState, saveState } from './storage.js';

/** Faces a player can pick. Picture-first, because our first learner is 6. */
export const FACES = ['🦊', '🐼', '🐸', '🦄', '🐯', '🐙', '🐨', '🦁'];

/** Tempo choices shown as animals, mapped to Strudel cycles per second (1 cycle = 1 bar). */
export const TEMPOS = { slow: { icon: '🐢', cps: 0.4 }, walk: { icon: '🚶', cps: 0.5 }, fast: { icon: '🐇', cps: 0.62 } };

const saved = loadState();

/** The single source of truth for app data. */
export const app = $state({
  profiles: saved.profiles ?? [],
  activeId: saved.activeId ?? null,
  tempo: saved.tempo ?? 'walk',
  voiceOn: saved.voiceOn ?? true,
});

let timer;

/**
 * Saves `app` to browser storage. Calls are batched for 300 ms so dragging
 * blocks doesn't write on every tiny change.
 */
export function persist() {
  clearTimeout(timer);
  timer = setTimeout(() => saveState($state.snapshot(app)), 300);
}

/**
 * Finds the player who is currently playing.
 * @returns {object|null} The active profile, or null when nobody is picked.
 */
export function activeProfile() {
  return app.profiles.find((p) => p.id === app.activeId) ?? null;
}

/**
 * Creates a new player and makes them active.
 * @param {string} name - Display name (may be empty for pre-readers).
 * @param {string} face - One of `FACES`.
 * @returns {object} The new profile.
 */
export function createProfile(name, face) {
  const profile = {
    id: Math.random().toString(36).slice(2, 10),
    name: name.trim(),
    face,
    completed: [],
    steps: {},
    workspaces: {},
  };
  app.profiles.push(profile);
  app.activeId = profile.id;
  persist();
  return profile;
}

/**
 * Records that the active player finished a lesson (earning a star).
 * @param {string} lessonId - Lesson id such as `"c1"`.
 */
export function completeLesson(lessonId) {
  const p = activeProfile();
  if (!p) return;
  if (!p.completed.includes(lessonId)) p.completed.push(lessonId);
  p.steps[lessonId] = 0;
  persist();
}

/**
 * Remembers which step of a lesson the active player has reached.
 * @param {string} lessonId - Lesson id.
 * @param {number} index - Step index (0-based).
 */
export function saveStep(lessonId, index) {
  const p = activeProfile();
  if (!p) return;
  p.steps[lessonId] = index;
  persist();
}

/**
 * Saves the blocks for a lesson or for Compose mode.
 * @param {string} key - Lesson id, or `"compose"`.
 * @param {object} json - Blockly workspace JSON.
 */
export function saveWorkspace(key, json) {
  const p = activeProfile();
  if (!p) return;
  p.workspaces[key] = json;
  persist();
}
