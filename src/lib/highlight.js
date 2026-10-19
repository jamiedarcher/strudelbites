/**
 * @file Colours Strudel code for the code panel (a very small syntax highlighter).
 *
 * It only needs to understand the code StrudelBites generates: function calls,
 * method chains, strings and numbers. Learners never type here, so a full
 * editor (like CodeMirror) is not needed yet.
 */

/**
 * Escapes text so it can be safely inserted as HTML.
 * @param {string} text - Raw text.
 * @returns {string} HTML-safe text.
 */
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Turns Strudel code into highlighted HTML.
 * @param {string} code - Generated Strudel code.
 * @param {string[]} [focus] - Words or symbols to spotlight, e.g. `["~"]` in the rests lesson.
 * @returns {string} HTML with `<span class="tok-…">` and `<mark>` wrappers.
 * @example highlight('s("bd ~")', ['~'])
 */
export function highlight(code, focus = []) {
  const pattern = /("[^"]*")|(\.?[a-zA-Z_]\w*)(?=\()|(\b\d+(?:\.\d+)?\b)/g;
  let html = '';
  let last = 0;
  for (const match of code.matchAll(pattern)) {
    html += escapeHtml(code.slice(last, match.index));
    const [whole, str, fn, num] = match;
    if (str) html += `<span class="tok-str">${spotlight(escapeHtml(str), focus)}</span>`;
    else if (fn) html += `<span class="tok-fn">${spotlight(escapeHtml(fn), focus)}</span>`;
    else if (num) html += `<span class="tok-num">${escapeHtml(num)}</span>`;
    last = match.index + whole.length;
  }
  html += escapeHtml(code.slice(last));
  return html;
}

/**
 * Wraps every occurrence of the focus words in `<mark>`.
 * @param {string} html - Already-escaped HTML fragment.
 * @param {string[]} focus - Words to spotlight.
 * @returns {string}
 */
function spotlight(html, focus) {
  return focus.reduce(
    (out, word) => out.split(escapeHtml(word)).join(`<mark>${escapeHtml(word)}</mark>`),
    html,
  );
}
