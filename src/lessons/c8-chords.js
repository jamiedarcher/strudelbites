/**
 * @file Beats & code, lesson 8 — "Chords".
 * Music idea: harmony — a chord is three notes played together.
 * Code idea: grouping — `[c4,e4,g4]`: brackets group, commas mean "at the same time".
 */
import { tracksOf, isPlayingSong } from './checks.js';

export default {
  id: 'c8',
  path: 'code',
  icon: '🌈',
  blocks: ['strudel_chords', 'strudel_beat4'],
  example: 'note("[c4,e4,g4] [f4,a4,c5] [g4,b4,d5] [c4,e4,g4]").s("triangle").slow(2)',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'chords', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'chords').length > 0 },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'change', check: (ctx) => tracksOf(ctx, 'chords').some((t) => t.chords.includes('Am')) },
    { id: 'code', type: 'confirm', panel: 'code', focus: [','] },
    { id: 'drums', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'chords').length > 0 && tracksOf(ctx, 'beat').length > 0 },
  ],
  card: { code: 'note("[c4,e4,g4] [a4,c5,e5]")' },
};
