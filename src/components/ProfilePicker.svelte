<!--
  @component
  "Who's playing?" screen. Players pick a face (no reading needed); a grown-up
  can add a name. Progress is stored per player in the browser.

  Props:
  - `onpicked()`: called once a player is chosen or created.
-->
<script>
  import { app, FACES, createProfile, persist } from '../lib/store.svelte.js';
  import { t } from '../lib/i18n.js';
  import { startEngine } from '../engine/strudel.js';
  import Clef from './Clef.svelte';

  let { onpicked } = $props();
  let creating = $state(app.profiles.length === 0);
  let face = $state(FACES[0]);
  let name = $state('');

  /** Selects an existing player. */
  function pick(profile) {
    app.activeId = profile.id;
    persist();
    startEngine();
    onpicked();
  }

  /** Creates a new player from the form. */
  function create() {
    createProfile(name, face);
    startEngine();
    onpicked();
  }
</script>

<main class="screen">
  <div class="hero">
    <Clef size={110} />
    <div>
      <h1>{t('app.name')}</h1>
      <p class="tagline">{t('app.tagline')}</p>
    </div>
  </div>

  {#if !creating}
    <h2>{t('profiles.title')}</h2>
    <div class="faces">
      {#each app.profiles as profile (profile.id)}
        <button class="face-card" onclick={() => pick(profile)}>
          <span class="face">{profile.face}</span>
          <span class="name">{profile.name || ' '}</span>
          <span class="stars">{'⭐'.repeat(profile.completed.length)}</span>
        </button>
      {/each}
      <button class="face-card new" onclick={() => (creating = true)} aria-label={t('profiles.new')}>
        <span class="face">➕</span>
        <span class="name">{t('profiles.new')}</span>
      </button>
    </div>
  {:else}
    <h2>{t('profiles.pickFace')}</h2>
    <div class="faces small">
      {#each FACES as option}
        <button class="face-pick" class:selected={face === option} onclick={() => (face = option)} aria-pressed={face === option}>
          {option}
        </button>
      {/each}
    </div>
    <input class="name-input" bind:value={name} placeholder={t('profiles.namePlaceholder')} maxlength="20" />
    <div class="row">
      {#if app.profiles.length}
        <button class="btn ghost" onclick={() => (creating = false)}>{t('profiles.back')}</button>
      {/if}
      <button class="btn primary big" onclick={create}>{face} {t('profiles.create')}</button>
    </div>
  {/if}
</main>

<style>
  .screen {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 24px 16px 48px;
  }
  .hero {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  h1 {
    font-size: clamp(40px, 7vw, 64px);
    margin: 0;
    color: var(--purple);
    line-height: 1;
  }
  .tagline {
    margin: 4px 0 0;
    font-size: 22px;
    color: var(--ink-soft);
  }
  h2 {
    margin: 8px 0 0;
    font-size: 30px;
  }
  .faces {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
    max-width: 900px;
  }
  .face-card {
    width: 160px;
    padding: 18px 10px 14px;
    border-radius: 28px;
    background: white;
    border: 4px solid var(--line);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    box-shadow: 0 6px 0 var(--line);
    transition: transform 0.12s;
  }
  .face-card:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 var(--line);
  }
  .face-card.new {
    border-style: dashed;
  }
  .face {
    font-size: 64px;
    line-height: 1.1;
  }
  .name {
    font-size: 22px;
    font-weight: 700;
    min-height: 1.3em;
  }
  .stars {
    font-size: 16px;
    min-height: 1.2em;
  }
  .face-pick {
    font-size: 54px;
    width: 92px;
    height: 92px;
    border-radius: 24px;
    background: white;
    border: 4px solid var(--line);
  }
  .face-pick.selected {
    border-color: var(--purple);
    background: #f3f0ff;
    transform: scale(1.08);
  }
  .name-input {
    font: inherit;
    font-size: 22px;
    padding: 14px 20px;
    border-radius: 18px;
    border: 3px solid var(--line);
    width: min(420px, 100%);
    text-align: center;
  }
  .row {
    display: flex;
    gap: 12px;
  }
</style>
