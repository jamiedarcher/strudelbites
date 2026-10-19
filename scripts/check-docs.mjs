/**
 * @file Documentation check, run before every build (`npm run check:docs`).
 *
 * StrudelBites is a teaching project, so its code has to explain itself.
 * The build fails if:
 * - a `.js` file in `src/` has no `@file` comment at the top,
 * - an exported function, class or constant has no `/** … *\/` doc comment right above it,
 * - a `.svelte` component has no `@component` comment,
 * - a folder in `src/` has no README.md.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src/', import.meta.url).pathname;
const problems = [];

/**
 * Lists every file under a folder, recursively.
 * @param {string} dir - Folder to walk.
 * @returns {string[]} File paths.
 */
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(root)) {
  const rel = relative(root, file);
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.js')) {
    if (!/^\/\*\*[\s\S]*?@file/.test(text.trimStart())) problems.push(`${rel}: missing @file comment at the top`);
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      const match = line.match(/^export (?:async )?(?:function|class|const|let)\s+(\w+)/);
      if (match && !(lines[i - 1] ?? '').trim().endsWith('*/')) {
        problems.push(`${rel}:${i + 1}: "${match[1]}" is exported without a /** doc comment */`);
      }
    });
  }
  if (file.endsWith('.svelte') && !/<!--[\s\S]*?@component/.test(text)) {
    problems.push(`${rel}: missing <!-- @component --> description`);
  }
}

for (const name of readdirSync(root)) {
  const dir = join(root, name);
  if (statSync(dir).isDirectory() && !existsSync(join(dir, 'README.md'))) {
    problems.push(`src/${name}/: missing README.md`);
  }
}

if (problems.length) {
  console.error(`Documentation check failed (${problems.length}):\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log('Documentation check passed ✔');
