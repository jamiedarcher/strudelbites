/**
 * @file Read music, lesson 3 — "Rhythm reading".
 * Music idea: reading rhythms from the staff — counting beats, and rests.
 * Code idea: a rest is `~`, and `@2` makes a step last two beats.
 */
import { sameRhythm, tracksOf } from './checks.js';

const first = [
  { pitch: 'c4', len: 'q' },
  { pitch: 'c4', len: 'q' },
  { pitch: 'c4', len: 'h' },
];
const second = [
  { pitch: 'e4', len: 'q' },
  { pitch: 'rest', len: 'q' },
  { pitch: 'e4', len: 'q' },
  { pitch: 'e4', len: 'q' },
];
const melody = (notes) => [{ kind: 'melody', instrument: 'triangle', style: 'normal', notes }];

export default {
  id: 't3',
  path: 'theory',
  icon: '👣',
  blocks: ['strudel_melody', 'strudel_note'],
  example: 'note("c4 c4 c4@2").s("triangle")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'melody', highlight: 'toolbox', check: (ctx) => tracksOf(ctx, 'melody').length > 0 },
    { id: 'read1', target: melody(first), check: (ctx) => sameRhythm(ctx, first) },
    { id: 'count', type: 'confirm', panel: 'staff' },
    { id: 'read2', target: melody(second), check: (ctx) => sameRhythm(ctx, second) },
    { id: 'code', type: 'confirm', panel: 'code', focus: ['~'] },
  ],
  card: { code: 'note("e4 ~ e4 e4")' },
};
