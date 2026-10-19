<!--
  @component
  A narrow, full 88-key piano (A0 to C8) shown along the bottom of the
  Code/Staff panel. It shows where the song's notes live on a real keyboard:

  - Keys used anywhere in the song get a small dot, so learners can see their
    tune's shape (high notes to the right, low notes to the left).
  - While music plays, each key lights up in its rainbow note colour for as
    long as the note sounds (call `press`).
  - Middle C (C4) is labelled, as are all the other Cs, as landmarks.

  Props:
  - `used`: note names in the song, e.g. `['c4', 'e4', 'g4']`.
-->
<script>
  import { noteColour } from '../blocks/catalog.js';

  let { used = [] } = $props();

  const WHITE_W = 20;
  const WHITE_H = 60;
  const BLACK_W = 12;
  const BLACK_H = 37;
  const LETTERS = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

  /**
   * Turns a note name into its MIDI number (middle C = 60).
   * @param {string} name - Note name such as `"c4"`, `"eb4"` or `"f#3"`.
   * @returns {number|null} MIDI number, or null if the name isn't a note.
   */
  function midiOf(name) {
    const match = /^([a-g])(b|#)?(\d)$/.exec(name ?? '');
    if (!match) return null;
    const [, letter, accidental, octave] = match;
    const pitchClass = LETTERS.indexOf(letter) + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0);
    return 12 * (Number(octave) + 1) + pitchClass;
  }

  // Build all 88 keys, from A0 (MIDI 21) to C8 (MIDI 108), with x positions.
  const keys = [];
  let whiteIndex = 0;
  for (let midi = 21; midi <= 108; midi++) {
    const letter = LETTERS[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    const black = letter.includes('#');
    // Sharps are coloured like the white key just before them (C# like C).
    const colourName = `${letter[0]}${octave}`;
    if (black) {
      keys.push({ midi, black, x: whiteIndex * WHITE_W - BLACK_W / 2, colour: noteColour(colourName) });
    } else {
      keys.push({ midi, black, x: whiteIndex * WHITE_W, colour: noteColour(colourName), label: letter === 'c' ? `C${octave}` : '' });
      whiteIndex += 1;
    }
  }
  const whites = keys.filter((k) => !k.black);
  const blacks = keys.filter((k) => k.black);
  const width = whiteIndex * WHITE_W;

  /** MIDI numbers currently sounding → how many times (overlapping notes). */
  let lit = $state({});
  const usedMidis = $derived(new Set(used.map(midiOf).filter((m) => m != null)));

  /**
   * Lights up keys while their notes sound.
   * @param {string[]} names - Note names to light, e.g. a chord `['c4', 'e4', 'g4']`.
   * @param {number} seconds - How long the notes last.
   */
  export function press(names, seconds) {
    const midis = names.map(midiOf).filter((m) => m != null);
    midis.forEach((m) => (lit[m] = (lit[m] ?? 0) + 1));
    setTimeout(() => {
      midis.forEach((m) => (lit[m] = Math.max(0, (lit[m] ?? 1) - 1)));
    }, Math.max(120, seconds * 1000 * 0.92));
  }
</script>

<div class="piano" aria-hidden="true">
  <svg viewBox="0 0 {width} {WHITE_H}" preserveAspectRatio="none">
    {#each whites as key (key.midi)}
      <rect
        x={key.x + 0.5}
        y="0"
        width={WHITE_W - 1}
        height={WHITE_H}
        rx="3"
        class="white"
        class:middle={key.midi === 60}
        style:fill={lit[key.midi] ? key.colour : null}
      />
      {#if usedMidis.has(key.midi) && !lit[key.midi]}
        <circle cx={key.x + WHITE_W / 2} cy={WHITE_H - 20} r="3.2" fill={key.colour} />
      {/if}
      {#if key.label}
        <text x={key.x + WHITE_W / 2} y={WHITE_H - 5} class="label" class:mid={key.midi === 60}>{key.label}</text>
      {/if}
    {/each}
    {#each blacks as key (key.midi)}
      <rect
        x={key.x}
        y="0"
        width={BLACK_W}
        height={BLACK_H}
        rx="2"
        class="black"
        style:fill={lit[key.midi] ? key.colour : null}
      />
      {#if usedMidis.has(key.midi) && !lit[key.midi]}
        <circle cx={key.x + BLACK_W / 2} cy={BLACK_H - 7} r="2.6" fill={key.colour} />
      {/if}
    {/each}
  </svg>
</div>

<style>
  .piano {
    padding: 4px 12px 8px;
    background: #2b2a33;
    border-top: 3px solid var(--line);
  }
  svg {
    display: block;
    width: 100%;
    height: 56px;
  }
  .white {
    fill: #fff;
    stroke: #c9c3b8;
    stroke-width: 1;
    transition: fill 0.06s;
  }
  .white.middle {
    fill: #fff8e1;
  }
  .black {
    fill: #212529;
    transition: fill 0.06s;
  }
  .label {
    font-size: 8px;
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 700;
    fill: #9a948a;
    text-anchor: middle;
  }
  .label.mid {
    fill: var(--purple);
    font-size: 9px;
  }
</style>
