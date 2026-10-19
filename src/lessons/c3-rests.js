/**
 * @file Beats & code, lesson 3 — "Rests and rhythm".
 * Music idea: silence (a rest) is part of rhythm.
 * Code idea: symbols have meaning — `~` means "be quiet for one step".
 */
import { tracksOf, hasBeat, isPlayingSong } from './checks.js';

export default {
  id: 'c3',
  path: 'code',
  icon: '🤫',
  blocks: ['strudel_sound', 'strudel_beat4'],
  example: 's("bd ~ bd ~")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'drag', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'beat').length > 0 },
    { id: 'pattern', check: (ctx) => hasBeat(ctx, '1010') },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['~'] },
    {
      id: 'own',
      check: (ctx) =>
        tracksOf(ctx, 'beat').some((t) => t.steps.includes('1') && t.steps.includes('0') && t.steps !== '1010'),
    },
  ],
  card: { code: 's("bd ~ bd ~")' },
};
