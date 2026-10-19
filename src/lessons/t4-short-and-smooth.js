/**
 * @file Read music, lesson 4 — "Short and smooth".
 * Music idea: articulation — staccato (short and bouncy, a dot) and legato
 * (smooth and joined, a curved slur).
 * Code idea: `.legato(0.3)` and `.legato(1.5)` — one parameter controls how long each note rings.
 */
import { tracksOf, allNotes, isPlayingSong } from './checks.js';

const styled = (ctx, style) => tracksOf(ctx, 'melody').some((t) => t.style === style && t.notes.length >= 3);

export default {
  id: 't4',
  path: 'theory',
  icon: '🏀',
  blocks: ['strudel_melody', 'strudel_note'],
  example: 'note("c4 d4 e4 f4 g4 ~ ~ ~").s("triangle").legato("<0.3 1.5>")',
  steps: [
    { id: 'listen', type: 'listen' },
    { id: 'notes', highlight: 'toolbox', check: (ctx) => allNotes(ctx).filter((n) => n.pitch !== 'rest').length >= 3 },
    { id: 'bouncy', check: (ctx) => styled(ctx, 'staccato') },
    { id: 'dots', type: 'confirm', panel: 'staff' },
    { id: 'smooth', check: (ctx) => styled(ctx, 'legato') },
    { id: 'slur', type: 'confirm', panel: 'staff' },
    { id: 'play', highlight: 'play', check: isPlayingSong },
  ],
  card: { code: 'note("c4 d4 e4").legato(0.3)' },
};
