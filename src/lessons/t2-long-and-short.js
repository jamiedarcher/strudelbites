/**
 * @file Read music, lesson 2 — "Long and short notes".
 * Music idea: note duration — whole (4 beats), half (2), quarter (1), eighth (½),
 * and how each looks on the staff.
 * Code idea: the `@` weight in mini-notation makes a step longer.
 */
import { allNotes, isPlayingSong } from './checks.js';
import { melodyEighths } from '../blocks/model.js';

export default {
  id: 't2',
  path: 'theory',
  icon: '⏳',
  blocks: ['strudel_melody', 'strudel_note'],
  example: 'note("c4@4 e4@2 g4@2").s("triangle")',
  panel: 'staff',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'notes', highlight: 'toolbox', check: (ctx) => allNotes(ctx).length >= 2 },
    { id: 'half', check: (ctx) => allNotes(ctx).some((n) => n.len === 'h') },
    { id: 'whole', check: (ctx) => allNotes(ctx).some((n) => n.len === 'w') },
    {
      id: 'fill',
      check: (ctx) => ctx.tracks.some((t) => t.kind === 'melody' && t.notes.length && melodyEighths(t.notes) === 8),
    },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['@'] },
  ],
  card: { code: 'note("c4@2 e4 g4")' },
};
