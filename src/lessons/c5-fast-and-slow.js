/**
 * @file Beats & code, lesson 5 — "Fast and slow".
 * Music idea: tempo, and how doubling the speed makes every step half as long.
 * Code idea: parameters — the number in `.fast(2)` changes what the function does.
 */
import { hasBeat, hasSpeed, isPlayingSong } from './checks.js';

export default {
  id: 'c5',
  path: 'code',
  icon: '🐇',
  blocks: ['strudel_beat4', 'strudel_beat8', 'strudel_speed'],
  example: 's("bd hh sd hh").fast("<1 2>")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'beat', highlight: 'toolbox', check: (ctx) => hasBeat(ctx, '1111') || hasBeat(ctx, '1010') },
    { id: 'wrap', highlight: 'toolbox', check: (ctx) => hasSpeed(ctx, 2) },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'slow', check: (ctx) => hasSpeed(ctx, 0.5) },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['.fast', '.slow'] },
  ],
  card: { code: 's("bd sd").fast(2)' },
};
