/**
 * @file Beats & code, lesson 7 — "Happy and sad".
 * Music idea: major scales sound happy, minor scales sound sad.
 * Code idea: mapping — `n("0 2 4").scale("C4:major")` turns step numbers into notes,
 * like looking things up in a list.
 */
import { tracksOf, scaleDegrees, isPlayingSong } from './checks.js';

export default {
  id: 'c7',
  path: 'code',
  icon: '🎭',
  blocks: ['strudel_scale_tune', 'strudel_step'],
  example: 'n("0 2 4 7").scale("<C4:major C4:minor>").s("triangle")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'tune', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'scale').length > 0 },
    { id: 'steps', highlight: 'toolbox', check: (ctx) => scaleDegrees(ctx).slice(0, 3).join(' ') === '0 2 4' },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'sad', check: (ctx) => tracksOf(ctx, 'scale').some((t) => t.scale === 'C4:minor') },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['.scale', 'minor'] },
  ],
  card: { code: 'n("0 2 4").scale("C4:minor")' },
};
