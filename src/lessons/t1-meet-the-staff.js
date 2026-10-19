/**
 * @file Read music, lesson 1 — "Meet the staff".
 * Music idea: notation and note recognition — five lines, higher notes sit higher.
 * Code idea: `note("c4 d4 e4")` plays notes by name.
 */
import { tracksOf, allNotes, isPlayingSong } from './checks.js';

export default {
  id: 't1',
  path: 'theory',
  icon: '🎼',
  blocks: ['strudel_melody', 'strudel_note'],
  example: 'note("c4 d4 e4 f4 g4 ~ ~ ~").s("triangle")',
  panel: 'staff',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'melody', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'melody').length > 0 },
    {
      id: 'notes',
      highlight: 'toolbox',
      check: (ctx) => allNotes(ctx).map((n) => n.pitch).slice(0, 3).join(' ') === 'c4 d4 e4',
    },
    { id: 'staff', highlight: 'staff', check: (ctx) => ctx.panel === 'staff' },
    { id: 'look', type: 'confirm', panel: 'staff' },
    { id: 'play', highlight: 'play', check: isPlayingSong },
  ],
  card: { code: 'note("c4 d4 e4")' },
};
