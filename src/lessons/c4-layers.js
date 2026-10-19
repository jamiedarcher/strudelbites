/**
 * @file Beats & code, lesson 4 — "Layers".
 * Music idea: instruments playing at the same time make a fuller sound.
 * Code idea: running things in parallel — `stack()`.
 */
import { hasBeat, isPlayingSong } from './checks.js';

export default {
  id: 'c4',
  path: 'code',
  icon: '🍰',
  blocks: ['strudel_sound', 'strudel_beat4', 'strudel_beat8'],
  example: 'stack(s("bd ~ bd ~"), s("~ sd ~ sd"), s("hh hh hh hh hh hh hh hh"))',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'kick', highlight: 'toolbox', check: (ctx) => hasBeat(ctx, '1010', 'bd') },
    { id: 'snare', highlight: 'toolbox', check: (ctx) => hasBeat(ctx, '0101', 'sd') },
    { id: 'hats', highlight: 'toolbox', check: (ctx) => hasBeat(ctx, '11111111', 'hh') },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['stack'] },
  ],
  card: { code: 'stack(\n  s("bd ~ bd ~"),\n  s("~ sd ~ sd")\n)' },
};
