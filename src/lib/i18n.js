/**
 * @file Tiny translation helper.
 *
 * All text a learner sees or hears lives in `src/locales/<code>.json`, never in
 * components. To add a language, copy `en.json`, translate the values, and
 * register it in `LOCALES` below. Missing keys fall back to English.
 */
import en from '../locales/en.json';

/** Every available language, keyed by its language code. */
export const LOCALES = { en };

let current = 'en';

/**
 * Looks up a dotted key (for example `"lessons.c1.title"`) in a locale object.
 * @param {object} table - A locale object such as the contents of `en.json`.
 * @param {string} key - Dotted path to the text.
 * @returns {*} The value found, or `undefined`.
 */
function lookup(table, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), table);
}

/**
 * Translates a key into the current language.
 * @param {string} key - Dotted path such as `"studio.play"`.
 * @param {Record<string, string|number>} [vars] - Values for `{placeholders}` in the text.
 * @returns {string} The translated text, or the key itself if it is missing everywhere.
 * @example t('clef.hello', { name: 'Maya' }) // "Hi Maya! I'm Clef..."
 */
export function t(key, vars = {}) {
  let value = lookup(LOCALES[current], key) ?? lookup(en, key);
  if (Array.isArray(value)) value = value[Math.floor(Math.random() * value.length)];
  if (typeof value !== 'string') return key;
  return value.replace(/\{(\w+)\}/g, (_, name) => (vars[name] ?? `{${name}}`));
}

/**
 * Returns true when a translation exists for the key.
 * @param {string} key - Dotted path to check.
 * @returns {boolean}
 */
export function has(key) {
  return lookup(LOCALES[current], key) != null || lookup(en, key) != null;
}

/**
 * Switches the interface language.
 * @param {string} code - A key of `LOCALES`, such as `"en"`.
 */
export function setLocale(code) {
  if (LOCALES[code]) current = code;
}
