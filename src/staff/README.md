# staff/

`notation.js` draws the song as real music notation using [VexFlow](https://www.vexflow.com/).

- **Melodies** go on a treble staff. Noteheads use the same rainbow colours as the note blocks, with the note name underneath (switchable).
- **Drums** share one percussion staff, the way drum parts are written: each sound has its own line or space; cymbal-type sounds get an "x" notehead.
- One Strudel cycle = one bar of 4/4. Note lengths come from `LENGTHS` in `blocks/catalog.js`.

VexFlow is large, so this module is loaded only when the Staff tab is first opened.
