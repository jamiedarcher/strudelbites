/**
 * @file Beats & code, lesson 2 — "The beat".
 * Music idea: the beat is the steady pulse you can clap along to.
 * Code idea: a sequence — steps written one after another, `"bd bd bd bd"`.
 */
import { tracksOf, hasBeat, isPlayingSong } from './checks.js';

export default {
  id: 'c2',
  path: 'code',
  icon: '🥁',
  blocks: ['strudel_sound', 'strudel_beat4'],
  example: 's("bd bd bd bd")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'drag', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'beat').length > 0 },
    { id: 'fill', check: (ctx) => hasBeat(ctx, '1111') },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['bd bd bd bd'] },
  ],
  card: { code: 's("bd bd bd bd")' },
};
