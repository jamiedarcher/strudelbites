/**
 * @file Beats & code, lesson 1 — "Make a sound".
 * Music idea: every instrument has its own sound (timbre).
 * Code idea: calling a function — `s("bd")`.
 * Spoken text lives in `src/locales/en.json` under `lessons.c1`.
 */
import { tracksOf, isPlayingSong } from './checks.js';

export default {
  id: 'c1',
  path: 'code',
  icon: '🔊',
  blocks: ['strudel_sound'],
  example: 's("<bd baa birds cp>")',
  showCode: false,
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'drag', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'sound').length > 0 },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'change', check: (ctx) => tracksOf(ctx, 'sound').some((t) => t.sound !== 'bd') },
  ],
  card: { code: 's("baa")' },
};
