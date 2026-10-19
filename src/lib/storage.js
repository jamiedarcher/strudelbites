/**
 * @file Saves and loads app data in the browser (localStorage).
 *
 * Nothing leaves the device: there are no accounts. Every read and write is
 * wrapped in try/catch because private browsing or blocked storage can throw.
 */

const KEY = 'strudelbites:v1';

/**
 * Loads saved app data.
 * @returns {object} The saved data, or an empty object if nothing is saved or storage is blocked.
 */
export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves app data.
 * @param {object} data - Plain (non-reactive) data to store.
 * @returns {boolean} True when the save worked.
 */
export function saveState(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}
