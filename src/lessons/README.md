# lessons/

Each lesson is one file. Two paths:

- **Beats & code** (`c1`–`c4`): one music idea paired with one code idea per lesson.
- **Read music** (`t1`–`t2`): music theory and reading notation, using the Staff view.

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

Step options: `highlight` ('toolbox' | 'play' | 'staff') makes that part of the screen glow; `panel` opens the Code or Staff view; `focus` spotlights words in the code.

`check(ctx)` receives `{ tracks, code, playing, listened, panel }`. Helpers live in `checks.js`.

All spoken and written text is in `locales/en.json` under `lessons.<id>` so lessons can be translated.

## Adding a lesson

1. Copy a lesson file and change it.
2. Import it in `index.js` and add it to a path (replace a `comingSoon` entry).
3. Add its title, step lines, hints and card text to `locales/en.json`.
