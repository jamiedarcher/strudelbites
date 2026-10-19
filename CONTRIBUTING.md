# Contributing to StrudelBites

Thank you! StrudelBites is for young learners, so two rules come first:

1. **Sound before words.** Every lesson step should be doable by a 6-year-old who can't read yet: Clef says it, the screen shows it.
2. **Code that teaches.** Every exported function needs a `/** doc comment */`, every component an `@component` comment, every `src/` folder a README. `npm run check:docs` enforces this.

## Add a lesson
See [src/lessons/README.md](src/lessons/README.md). Keep lessons to about 10 minutes and pair one music idea with one code idea.

## Add a block or a sound
See [src/blocks/README.md](src/blocks/README.md). Sounds are listed once in `src/blocks/catalog.js`.

## Add a language
See [src/locales/README.md](src/locales/README.md). Please have music terms checked by a native speaker.

## Before opening a pull request
```bash
npm run build   # runs the documentation check, then builds
```
Test on an iPad (or a touch-screen simulator) as well as a laptop.

By contributing you agree your work is released under the AGPL-3.0-or-later.
