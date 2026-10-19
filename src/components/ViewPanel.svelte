<!--
  @component
  The strip under the block canvas with two views of the same song:
  - Code: the real Strudel code the blocks generate, with spotlighted words.
  - Staff: the song written as music notation.
  When closed it shrinks to just its tabs; tapping a tab opens it.

  Props:
  - `open`, `tab` ('code' | 'staff'), `ontab(tab)`, `onclose()`.
  - `code`, `tracks`: the current song.
  - `focus`: words to spotlight in the code (e.g. `['~']`).
  - `pulse`: 'code' or 'staff' to make that tab glow.

  A narrow 88-key piano runs along the bottom, open or closed (see
  Piano.svelte), and a drum kit sits in the bottom-right corner (DrumKit.svelte).

  Exposes `now(leaf, index)`: lights up the note being played on the staff,
  `keys(names, seconds)`: lights up piano keys while notes sound, and
  `drum(soundId)`: flashes the matching part of the drum kit.
-->
<script>
  import { t } from '../lib/i18n.js';
  import { highlight } from '../lib/highlight.js';
  import { SOUNDS } from '../blocks/catalog.js';
  import { flattenLeaves, chordNotes } from '../blocks/model.js';
  import { SCALES, byId } from '../blocks/catalog.js';
  import Piano from './Piano.svelte';
  import DrumKit from './DrumKit.svelte';

  let { open, tab, ontab, onclose, code, tracks, focus = [], pulse = '' } = $props();
  let staffHost = $state();
  let width = $state(600);
  let names = $state(true);
  let rows = $state(0);
  let events = new Map();
  let piano;
  let kit;

  // Every pitched note in the song, so the piano can mark where the tune lives.
  const usedNotes = $derived(
    flattenLeaves(tracks).flatMap(({ track }) => {
      if (track.kind === 'melody') return track.notes.map((n) => n.pitch);
      if (track.kind === 'scale') return track.notes.map((n) => byId(SCALES, track.scale)?.notes[Number(n.degree)]);
      if (track.kind === 'chords') return track.chords.flatMap(chordNotes);
      return [];
    }),
  );
  // The notation library is large, so it is only downloaded the first time the Staff tab opens.
  let notation = $state(null);

  const html = $derived(highlight(code, focus));
  const drumSounds = $derived(
    [...new Set(flattenLeaves(tracks).map(({ track }) => track.sound).filter(Boolean))]
      .map((id) => SOUNDS.find((s) => s.id === id))
      .filter(Boolean),
  );

  $effect(() => {
    if (open && tab === 'staff' && !notation) {
      import('../staff/notation.js').then((module) => (notation = module));
    }
  });

  $effect(() => {
    if (!open || tab !== 'staff' || !staffHost || !notation) return;
    try {
      const result = notation.renderStaff(staffHost, tracks, { width: Math.min(Math.max(320, width - 260), 900), names });
      rows = result.rows;
      events = result.events;
    } catch (error) {
      console.warn('Staff view could not draw this song', error);
      rows = 0;
      events = new Map();
    }
  });

  /**
   * Lights up the note that is playing, if the staff is showing.
   * @param {number} leaf - Track (leaf) number.
   * @param {number} index - Event number in that track.
   */
  export function now(leaf, index) {
    if (open && tab === 'staff' && notation) notation.markPlaying(events, leaf, index);
  }

  /**
   * Lights up piano keys while notes sound.
   * @param {string[]} names - Note names, e.g. `['c4', 'e4', 'g4']`.
   * @param {number} seconds - How long they sound.
   */
  export function keys(names, seconds) {
    piano?.press(names, seconds);
  }

  /**
   * Flashes the drum kit part for a sound.
   * @param {string} soundId - Sample name such as `'bd'`.
   */
  export function drum(soundId) {
    kit?.hit(soundId);
  }
</script>

<section class="panel" class:open>
  <div class="views" bind:clientWidth={width}>
  <div class="tabs" role="tablist">
    <button role="tab" class:active={open && tab === 'code'} class:pulse={pulse === 'code'} aria-selected={open && tab === 'code'} onclick={() => ontab('code')}>
      ⌨️ {t('studio.code')}
    </button>
    <button role="tab" class:active={open && tab === 'staff'} class:pulse={pulse === 'staff'} aria-selected={open && tab === 'staff'} onclick={() => ontab('staff')}>
      🎼 {t('studio.staff')}
    </button>
    {#if open}
      <p class="explain">{tab === 'code' ? t('studio.codeExplain') : t('studio.staffExplain')}</p>
      <button class="close" onclick={onclose} aria-label="Close">⌄</button>
    {/if}
  </div>

  {#if open}
    <div class="content">
      {#if tab === 'code'}
        {#if code}
          <pre class="code">{@html html}</pre>
        {:else}
          <p class="empty">{t('studio.codeEmpty')}</p>
        {/if}
      {:else}
        <div class="staff-row">
          <div class="staff" bind:this={staffHost}></div>
          <div class="staff-side">
            <label class="toggle">
              <input type="checkbox" bind:checked={names} />
              {t('studio.names')}
            </label>
            {#if drumSounds.length}
              <p class="small">{t('studio.drumKey')}</p>
              <ul class="key">
                {#each drumSounds as s (s.id)}
                  <li style="color:{s.colour}">{s.emoji} {t(`blocks.sounds.${s.id}`)}</li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
        {#if !rows}
          <p class="empty">{t('studio.staffEmpty')}</p>
        {/if}
      {/if}
    </div>
  {/if}

  <Piano bind:this={piano} used={usedNotes} />
  </div>
  <aside class="corner">
    <DrumKit bind:this={kit} />
  </aside>
</section>

<style>
  .panel {
    background: white;
    border-top: 3px solid var(--line);
    display: flex;
    min-width: 0;
  }
  .views {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .corner {
    width: 150px;
    flex: none;
    background: #2b2a33;
    border-top-left-radius: 22px;
  }
  .open .corner {
    width: clamp(200px, 22vw, 290px);
  }
  .panel.open {
    height: clamp(280px, 40vh, 410px);
  }
  .tabs {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
  }
  .tabs button[role='tab'] {
    font-size: 19px;
    font-weight: 700;
    border: 3px solid var(--line);
    background: var(--paper);
    border-radius: 16px;
    padding: 6px 16px;
    min-height: 50px;
    color: var(--ink-soft);
  }
  .tabs button.active {
    background: #f3f0ff;
    border-color: #b197fc;
    color: var(--ink);
  }
  .explain {
    margin: 0 0 0 8px;
    color: var(--ink-soft);
    font-size: 17px;
    flex: 1;
    min-width: 0;
  }
  .close {
    margin-left: auto;
    border: none;
    background: var(--paper);
    border-radius: 14px;
    font-size: 26px;
    min-width: 52px;
    min-height: 48px;
  }
  .content {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 0 16px 14px;
  }
  .code {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 21px;
    line-height: 1.5;
    background: #1f1d2b;
    color: #f8f9fa;
    padding: 14px 18px;
    border-radius: 16px;
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }
  .code :global(.tok-fn) { color: #b197fc; }
  .code :global(.tok-str) { color: #8ce99a; }
  .code :global(.tok-num) { color: #ffc078; }
  .code :global(mark) {
    background: #ffe066;
    color: #1f1d2b;
    border-radius: 4px;
    padding: 0 3px;
    animation: shine 1s ease-in-out infinite alternate;
  }
  @keyframes shine {
    from { box-shadow: 0 0 0 0 #ffe06699; }
    to { box-shadow: 0 0 0 5px #ffe06633; }
  }
  .empty {
    font-size: 18px;
    background: var(--paper);
    padding: 12px 14px;
    border-radius: 14px;
    margin: 0;
  }
  .staff-row {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .staff {
    overflow-x: auto;
  }
  .staff :global(.sb-now) {
    animation: now 0.45s ease-out;
  }
  @keyframes now {
    from { filter: drop-shadow(0 0 5px #fab005) drop-shadow(0 0 3px #fab005); }
    to { filter: none; }
  }
  .staff-side {
    min-width: 200px;
  }
  .toggle {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    font-size: 17px;
  }
  .toggle input {
    width: 24px;
    height: 24px;
  }
  .small {
    font-size: 15px;
    color: var(--ink-soft);
    margin: 8px 0 4px;
  }
  .key {
    list-style: none;
    padding: 0;
    margin: 0;
    font-weight: 700;
    font-size: 17px;
  }
</style>
