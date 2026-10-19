# blocks/

Everything about the blocks learners drag around.

| File | What it does |
| --- | --- |
| `catalog.js` | The musical materials: sounds, notes, note lengths and instruments, with their emoji, colours and staff positions. Add a sound here and it appears everywhere. |
| `definitions.js` | The block shapes (My song, play, beat, melody, note). |
| `fieldSteps.js` | The custom row of tappable squares used by beat blocks. |
| `model.js` | Turns blocks into a plain **song model** (a list of tracks), then into Strudel code. |
| `workspace.js` | Blockly setup: theme, palette (toolbox) and the empty starting song. |

## How a block becomes sound

```
blocks on the canvas
   │  readSong()          (model.js)
   ▼
[{ kind: 'beat', sound: 'bd', steps: '1010' }, …]   ← the song model
   │  songCode()          (model.js)
   ▼
s("bd ~ bd ~")                                       ← Strudel code
   │  play()              (engine/strudel.js)
   ▼
🔊
```

The same song model also feeds the staff view (`staff/notation.js`) and the lesson checks (`lessons/`).

## Adding a block

1. Define its shape in `definitions.js`.
2. Read it into the song model in `readSong()` and write its code in `trackCode()` (`model.js`).
3. Add its palette entry in `workspace.js` and its words to `locales/en.json`.
4. Add it to `ALL_BLOCKS` (Compose mode) and to any lesson that should unlock it.
