/**
 * @file Read music, lesson 5 — "Scales".
 * Music idea: a scale climbs the staff one step at a time (line, space, line…);
 * minor scales use flats (♭).
 * Code idea: `.scale("C4:major")` — the same step numbers make a different scale.
 */
import { tracksOf, scaleDegrees, isPlayingSong } from './checks.js';

const ladder = ['0', '1', '2', '3', '4', '5', '6', '7'];

export default {
  id: 't5',
  path: 'theory',
  icon: '🪜',
  blocks: ['strudel_scale_tune', 'strudel_step'],
  example: 'n("0 1 2 3 4 5 6 7").scale("C4:major").s("triangle").slow(2)',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'tune', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'scale').length > 0 },
    {
      id: 'build',
      highlight: 'toolbox',
      target: [{ kind: 'scale', scale: 'C4:major', instrument: 'triangle', notes: ladder.map((degree) => ({ degree, len: 'q' })) }],
      check: (ctx) => scaleDegrees(ctx).join(' ') === ladder.join(' '),
    },
    { id: 'staff', type: 'confirm', panel: 'staff' },
    { id: 'minor', check: (ctx) => tracksOf(ctx, 'scale').some((t) => t.scale === 'C4:minor') },
    { id: 'flats', type: 'confirm', panel: 'staff' },
    { id: 'play', highlight: 'play', check: isPlayingSong },
  ],
  card: { code: 'n("0 1 2 3 4 5 6 7").scale("C4:minor")' },
};
