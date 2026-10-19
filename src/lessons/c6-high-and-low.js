/**
 * @file Beats & code, lesson 6 — "High and low".
 * Music idea: pitch — high and low notes, and octaves (C4 and C5 are both C).
 * Code idea: values — `"c4"` is a piece of data; change the value, change the sound.
 */
import { tracksOf, allNotes, isPlayingSong } from './checks.js';
import { NOTES } from '../blocks/catalog.js';

const order = NOTES.map((n) => n.id);

export default {
  id: 'c6',
  path: 'code',
  icon: '🎹',
  blocks: ['strudel_melody', 'strudel_note'],
  example: 'note("c4 c5 c4 c5").s("triangle")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'melody', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'melody').length > 0 },
    {
      id: 'lowhigh',
      highlight: 'toolbox',
      check: (ctx) => {
        const pitches = allNotes(ctx).map((n) => n.pitch);
        return pitches.includes('c4') && pitches.includes('c5');
      },
    },
    { id: 'play', highlight: 'play', check: isPlayingSong },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['c4', 'c5'] },
    {
      id: 'climb',
      check: (ctx) =>
        tracksOf(ctx, 'melody').some((t) => {
          const ranks = t.notes.filter((n) => n.pitch !== 'rest').map((n) => order.indexOf(n.pitch));
          return ranks.length >= 4 && ranks.every((r, i) => i === 0 || r > ranks[i - 1]);
        }),
    },
  ],
  card: { code: 'note("c4 e4 g4 c5")' },
};
