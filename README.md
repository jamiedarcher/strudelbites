# StrudelBites 🎼

**Make music. Learn code.** A playful, Scratch-style block editor that teaches children and families the basics of music *and* code at the same time, built on [Strudel](https://strudel.cc).

Snap blocks together and they become real Strudel code that plays instantly. Clef, a friendly treble clef, guides each lesson out loud, so young learners who are still learning to read can follow along.

**▶ Try it:** https://jamiedarcher.github.io/strudelbites/

## What's inside (v0.2)

- **Learn** with two lesson paths:
  - 🥁 **Beats & code**: Make a sound · The beat · Rests and rhythm · Layers · Fast and slow · High and low · Happy and sad · Chords
  - 🎼 **Read music**: Meet the staff · Long and short · Rhythm reading · Short and smooth · Scales · Chords on the staff
- **Compose**: every block, no lessons — just make music.
- **Two views of your song**: the real **Code**, and the **Staff** (music notation with rainbow notes, flats, staccato dots, slurs and chords).
- **Play-along**: blocks, beat squares and staff notes light up as they sound; Clef dances in time.
- **Safe volume**: a built-in limiter keeps everything at a comfortable level.
- Clef speaks every instruction; blocks are picture-first; big touch targets for iPad.
- Player profiles with stars, saved in the browser. No accounts.

Designed for **laptops and iPads**. English first; Greek and Romanian are planned.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # checks the docs, then builds to dist/
```

## How it works

```
blocks → song model → Strudel code → sound
                   ↘ staff notation
                   ↘ lesson checks
```

See [docs/architecture.md](docs/architecture.md). Every folder in `src/` has its own README, and every exported function has a doc comment — the build fails if one is missing.

## Contributing

New lessons, blocks and translations are very welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits and licence

- Sound engine: [Strudel](https://strudel.cc) by Felix Roos, Alex McLean and contributors (AGPL-3.0).
- Samples: [tidalcycles/dirt-samples](https://github.com/tidalcycles/dirt-samples).
- Blocks: [Blockly](https://github.com/google/blockly) (Apache-2.0). Notation: [VexFlow](https://www.vexflow.com/) (MIT).

StrudelBites is free software under the **GNU AGPL-3.0-or-later**, the same licence as Strudel. See [LICENSE](LICENSE).
