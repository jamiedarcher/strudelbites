<!--
  @component
  A five-piece drum kit seen from above, in flat simple shapes, shown in the
  bottom-right corner of the Code/Staff panel. Like the piano strip, it plays
  along: each part flashes when its sound plays in the song.

  - Hover or tap a part to see its name. Tapping also plays its sound.
  - The bass drum (kick) sits behind the toms and sticks out at the top, so it
    can be seen and tapped.
  - Fun sounds (clap, sheep, birds…) have no kit part, so nothing lights for them.

  Exposes `hit(soundId)`: flash the part that makes that sound (e.g. `'bd'`).
-->
<script>
  import { t } from '../lib/i18n.js';
  import { SOUNDS } from '../blocks/catalog.js';
  import { tap } from '../engine/strudel.js';

  /**
   * Kit parts, positioned like the reference "five piece drum kit, top view".
   * `shape`: 'drum' (round head), 'cymbal', 'kick' (the bass drum shell) or 'pedal'.
   * `sound`: the sample played when tapped. `with`: another part that flashes too.
   */
  const PARTS = [
    { id: 'kick', shape: 'kick', x: 150, y: 6, w: 100, h: 112, sound: 'bd', with: 'kickPedal' },
    { id: 'kickPedal', shape: 'pedal', x: 192, y: 150, w: 16, h: 34, sound: 'bd' },
    { id: 'hihatPedal', shape: 'pedal', x: 62, y: 222, w: 18, h: 40, rotate: 25, sound: 'hh' },
    { id: 'tom1', shape: 'drum', cx: 166, cy: 110, r: 34, sound: 'ht' },
    { id: 'tom2', shape: 'drum', cx: 238, cy: 110, r: 36, sound: 'mt' },
    { id: 'snare', shape: 'drum', cx: 160, cy: 200, r: 40, sound: 'sd' },
    { id: 'floor', shape: 'drum', cx: 256, cy: 208, r: 44, sound: 'lt' },
    { id: 'crash', shape: 'cymbal', cx: 76, cy: 92, r: 48, sound: 'cr' },
    { id: 'ride', shape: 'cymbal', cx: 334, cy: 112, r: 56, sound: '808cy' },
    { id: 'hihat', shape: 'cymbal', cx: 80, cy: 196, r: 34, sound: 'hh', with: 'hihatPedal' },
    { id: 'crash2', shape: 'cymbal', cx: 344, cy: 238, r: 44, sound: 'cr' },
  ];

  /** Colour each part glows when it plays, matching its sound's colour in the blocks. */
  const glow = Object.fromEntries(PARTS.map((p) => [p.id, SOUNDS.find((s) => s.id === p.sound)?.colour ?? '#fab005']));

  let lit = $state({});
  let label = $state('');
  let labelTimer;

  /**
   * Flashes a part (and its pedal) briefly.
   * @param {string} partId - Part id such as `'snare'`.
   */
  function flash(partId) {
    const part = PARTS.find((p) => p.id === partId);
    if (!part) return;
    for (const id of [partId, part.with].filter(Boolean)) {
      lit[id] = (lit[id] ?? 0) + 1;
      setTimeout(() => (lit[id] = Math.max(0, (lit[id] ?? 1) - 1)), 170);
    }
  }

  /**
   * Flashes the kit part that makes a sound, if there is one.
   * @param {string} soundId - Sample name such as `'bd'` or `'hh'`.
   */
  export function hit(soundId) {
    const part = SOUNDS.find((s) => s.id === soundId)?.kit;
    if (part) flash(part);
  }

  /**
   * Shows a part's name, and when tapped plays its sound.
   * @param {object} part - The part.
   * @param {boolean} play - True when tapped (not just hovered).
   */
  function show(part, play) {
    clearTimeout(labelTimer);
    label = part.id;
    if (play) {
      tap(part.sound);
      flash(part.id);
      labelTimer = setTimeout(() => (label = ''), 1600);
    }
  }

  /** Where to put a part's name: just above it, kept inside the picture. */
  function labelPos(part) {
    if (part.shape === 'kick') return { x: part.x + part.w / 2, y: part.y + 18 };
    if (part.shape === 'pedal') return { x: part.x + part.w / 2, y: part.y + part.h + 16 };
    return { x: Math.min(Math.max(part.cx, 70), 330), y: Math.max(part.cy - part.r - 8, 16) };
  }
  const current = $derived(PARTS.find((p) => p.id === label));
</script>

<div class="kit">
  <svg viewBox="0 0 400 290" role="group" aria-label={t('drums.title')}>
    {#each PARTS as part (part.id)}
      <g
        class="part {part.shape}"
        class:on={lit[part.id]}
        style="--glow: {glow[part.id]}"
        role="button"
        tabindex="0"
        aria-label={t(`drums.${part.id}`)}
        onpointerenter={(e) => e.pointerType === 'mouse' && show(part, false)}
        onpointerleave={(e) => e.pointerType === 'mouse' && label === part.id && (label = '')}
        onpointerdown={() => show(part, true)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && show(part, true)}
      >
        {#if part.shape === 'kick'}
          <rect x={part.x} y={part.y} width={part.w} height={part.h} rx="10" class="shell" />
          <rect x={part.x} y={part.y} width={part.w} height="14" rx="6" class="hoop" />
        {:else if part.shape === 'pedal'}
          <rect
            x={part.x}
            y={part.y}
            width={part.w}
            height={part.h}
            rx="4"
            class="pedal-plate"
            transform={part.rotate ? `rotate(${part.rotate} ${part.x + part.w / 2} ${part.y})` : undefined}
          />
        {:else if part.shape === 'drum'}
          <circle cx={part.cx} cy={part.cy} r={part.r} class="head" />
          <circle cx={part.cx} cy={part.cy} r={part.r - 7} class="inner" />
        {:else}
          <circle cx={part.cx} cy={part.cy} r={part.r} class="cymbal-disc" />
          <circle cx={part.cx} cy={part.cy} r={part.r * 0.66} class="groove" />
          <circle cx={part.cx} cy={part.cy} r={part.r * 0.33} class="groove" />
          <circle cx={part.cx} cy={part.cy} r="7" class="bell" />
          <circle cx={part.cx} cy={part.cy} r="2.5" class="nut" />
        {/if}
      </g>
    {/each}
    {#if current}
      {@const pos = labelPos(current)}
      <text x={pos.x} y={pos.y} class="name">{t(`drums.${current.id}`)}</text>
    {/if}
  </svg>
</div>

<style>
  .kit {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
  }
  svg {
    width: 100%;
    height: 100%;
    max-height: 260px;
    overflow: visible;
  }
  .part {
    cursor: pointer;
    outline: none;
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.08s;
    -webkit-tap-highlight-color: transparent;
  }
  .part.on {
    transform: scale(1.06);
  }
  .part:focus-visible :is(.head, .cymbal-disc, .shell, .pedal-plate) {
    stroke: #4dabf7;
    stroke-width: 5;
  }
  /* Bass drum shell (seen from above, lying on its side) */
  .shell {
    fill: #339af0;
    stroke: #1864ab;
    stroke-width: 3;
  }
  .hoop {
    fill: #1864ab;
  }
  .on .shell {
    fill: var(--glow);
  }
  /* Drum heads */
  .head {
    fill: #ffffff;
    stroke: #343a40;
    stroke-width: 4;
    transition: fill 0.06s;
  }
  .inner {
    fill: none;
    stroke: #dee2e6;
    stroke-width: 2;
  }
  .on .head {
    fill: var(--glow);
  }
  /* Cymbals */
  .cymbal-disc {
    fill: #f2b45a;
    stroke: #c9852c;
    stroke-width: 3;
    transition: fill 0.06s;
  }
  .groove {
    fill: none;
    stroke: rgba(160, 100, 30, 0.35);
    stroke-width: 1.5;
  }
  .bell {
    fill: #e09b3d;
    stroke: #a86a1c;
    stroke-width: 1.5;
  }
  .nut {
    fill: #495057;
  }
  .on .cymbal-disc {
    fill: #ffe066;
    filter: drop-shadow(0 0 6px #ffd43b);
  }
  /* Pedals */
  .pedal-plate {
    fill: #adb5bd;
    stroke: #868e96;
    stroke-width: 2;
  }
  .on .pedal-plate {
    fill: var(--glow);
  }
  .name {
    font-family: 'Baloo 2', system-ui, sans-serif;
    font-weight: 800;
    font-size: 17px;
    text-anchor: middle;
    fill: #ffffff;
    stroke: #212529;
    stroke-width: 5px;
    paint-order: stroke;
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .part, .part.on { transform: none; transition: none; }
  }
</style>
