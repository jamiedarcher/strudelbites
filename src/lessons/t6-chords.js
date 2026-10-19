/**
 * @file Read music, lesson 6 — "Chords".
 * Music idea: on the staff, a chord's notes are stacked on top of each other;
 * reading chord names (C, F, G, Am).
 * Code idea: `[c4,e4,g4]` — notes grouped with commas sound together.
 */
import { tracksOf, isPlayingSong } from './checks.js';

const target = ['C', 'Am', 'F', 'G'];

export default {
  id: 't6',
  path: 'theory',
  icon: '⛄',
  blocks: ['strudel_chords'],
  example: 'note("[c4,e4,g4] [a4,c5,e5] [f4,a4,c5] [g4,b4,d5]").s("triangle").slow(2)',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'chords', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'chords').length > 0 },
    { id: 'staff', highlight: 'staff', check: (ctx) => ctx.panel === 'staff' },
    { id: 'snowman', type: 'confirm', panel: 'staff' },
    {
      id: 'read',
      target: [{ kind: 'chords', chords: target, instrument: 'triangle' }],
      check: (ctx) => tracksOf(ctx, 'chords').some((t) => t.chords.join(' ') === target.join(' ')),
    },
    { id: 'play', highlight: 'play', check: isPlayingSong },
  ],
  card: { code: 'note("[c4,e4,g4] [a4,c5,e5] [f4,a4,c5] [g4,b4,d5]")' },
};
