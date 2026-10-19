<!--
  @component
  The lesson map: both learning paths as rows of lesson bubbles, with stars
  for finished lessons, locks for lessons not yet open, and "coming soon" tags.

  Props:
  - `onopen(lesson)`: open a lesson.
  - `onhome()`: back to the home screen.
-->
<script>
  import { PATHS, isUnlocked } from '../lessons/index.js';
  import { activeProfile } from '../lib/store.svelte.js';
  import { t } from '../lib/i18n.js';

  let { onopen, onhome } = $props();
  const profile = activeProfile();
  const completed = profile?.completed ?? [];
</script>

<main class="map">
  <header>
    <button class="btn ghost" onclick={onhome} aria-label={t('studio.home')}>🏠</button>
    <h1>{t('map.title')}</h1>
    <span class="spacer"></span>
  </header>

  {#each PATHS as path (path.id)}
    <section class="path {path.id}">
      <h2><span>{path.icon}</span> {t(`map.paths.${path.id}`)}</h2>
      <ol>
        {#each path.lessons as lesson, i (lesson.id)}
          {@const open = isUnlocked(lesson, completed)}
          {@const done = completed.includes(lesson.id)}
          <li>
            <button
              class="bubble"
              class:done
              class:locked={!open}
              disabled={!open}
              onclick={() => onopen(lesson)}
              title={lesson.comingSoon ? t('map.comingSoon') : open ? '' : t('map.locked')}
            >
              <span class="num">{i + 1}</span>
              <span class="icon">{open || done ? lesson.icon : lesson.comingSoon ? '🚧' : '🔒'}</span>
              <span class="name">{t(`lessons.${lesson.id}.title`)}</span>
              {#if done}<span class="star">⭐</span>{/if}
              {#if lesson.comingSoon}<span class="soon">{t('map.comingSoon')}</span>{/if}
            </button>
          </li>
        {/each}
      </ol>
    </section>
  {/each}
</main>

<style>
  .map {
    padding: 12px 20px 48px;
    max-width: 1200px;
    margin: 0 auto;
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  h1 {
    flex: 1;
    text-align: center;
    margin: 0;
    font-size: 36px;
  }
  .spacer {
    width: 64px;
  }
  .path {
    margin-top: 24px;
    padding: 18px 20px 22px;
    border-radius: 32px;
    background: white;
    border: 3px solid var(--line);
  }
  .path.code {
    background: #f3f0ff;
    border-color: #d0bfff;
  }
  .path.theory {
    background: #e6fcf5;
    border-color: #96f2d7;
  }
  h2 {
    margin: 0 0 14px;
    font-size: 28px;
  }
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .bubble {
    position: relative;
    width: 148px;
    min-height: 168px;
    border-radius: 28px;
    border: 4px solid var(--line);
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 12px 8px;
    box-shadow: 0 6px 0 var(--line);
  }
  .bubble:active:not(:disabled) {
    transform: translateY(4px);
    box-shadow: 0 2px 0 var(--line);
  }
  .bubble.done {
    border-color: #fab005;
    box-shadow: 0 6px 0 #f08c00;
  }
  .bubble.locked {
    opacity: 0.55;
    box-shadow: none;
  }
  .num {
    position: absolute;
    top: 8px;
    left: 12px;
    font-weight: 800;
    color: var(--ink-soft);
  }
  .icon {
    font-size: 52px;
    line-height: 1.1;
  }
  .name {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.15;
    text-align: center;
  }
  .star {
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 26px;
  }
  .soon {
    font-size: 13px;
    background: var(--line);
    border-radius: 99px;
    padding: 2px 8px;
  }
</style>
