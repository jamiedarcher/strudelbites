# lessons/

Each lesson is one file. Two paths:

- **Beats & code** (`c1`–`c8`): one music idea paired with one code idea per lesson.
- **Read music** (`t1`–`t6`): music theory and reading notation, using the Staff view.

| Lesson | Music idea | Code idea |
| --- | --- | --- |
| c1 Make a sound | Sound / timbre | Calling a function `s("bd")` |
| c2 The beat | Pulse | Sequence `"bd bd bd bd"` |
| c3 Rests and rhythm | Silence in rhythm | Symbol `~` |
| c4 Layers | Instruments together | `stack()` |
| c5 Fast and slow | Tempo | Parameter `.fast(2)` |
| c6 High and low | Pitch, octaves | Values `"c4"` vs `"c5"` |
| c7 Happy and sad | Major and minor | Mapping `n("0 2 4").scale(...)` |
| c8 Chords | Harmony | Grouping `[c4,e4,g4]` |
| t1 Meet the staff | Staff, note recognition | `note()` |
| t2 Long and short | Note duration | `@` weights |
| t3 Rhythm reading | Counting, rests | `~`, `@2` |
| t4 Short and smooth | Staccato and legato | `.legato()` |
| t5 Scales | Scales on the staff, flats | `.scale()` |
| t6 Chords on the staff | Reading stacked chords | `[c4,e4,g4]` |

## Lesson file shape

```js
export default {
  id: 'c2',                     // also the key for its words in locales/en.json
  path: 'code',                 // 'code' or 'theory'
  icon: '🥁',
  blocks: ['strudel_beat4'],    // blocks unlocked in the palette
  example: 's("bd bd bd bd")',  // what "Listen" plays
  steps: [
    { id: 'listen', type: 'listen' },                          // press Listen
    { id: 'fill', check: (ctx) => hasBeat(ctx, '1111') },      // done when check() is true
    { id: 'code', type: 'confirm', panel: 'code', focus: ['bd'] }, // press "I see it"
  ],
  card: { code: 's("bd bd bd bd")' }, // example on the reward card
};
```

Step options: `highlight` ('toolbox' | 'play' | 'staff') makes that part of the screen glow; `panel` opens the Code or Staff view; `focus` spotlights words in the code; `target` (a list of tracks) is drawn as a small staff in the lesson panel under "Read this:", for reading practice.

`check(ctx)` receives `{ tracks, code, playing, listened, panel }`. Helpers live in `checks.js`.

All spoken and written text is in `locales/en.json` under `lessons.<id>` so lessons can be translated.

## Adding a lesson

1. Copy a lesson file and change it.
2. Import it in `index.js` and add it to a path (replace a `comingSoon` entry).
3. Add its title, step lines, hints and card text to `locales/en.json`.
