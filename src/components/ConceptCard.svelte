<!--
  @component
  End-of-lesson reward: a star and a card pairing the music idea with the
  code idea learned, side by side.

  Props:
  - `lesson`: the finished lesson.
  - `hasNext`: whether a next lesson exists.
  - `onnext()`, `onmap()`: navigation.
-->
<script>
  import { t } from '../lib/i18n.js';
  import { highlight } from '../lib/highlight.js';
  import Clef from './Clef.svelte';

  let { lesson, hasNext, onnext, onmap } = $props();
  const key = `lessons.${lesson.id}.card`;
</script>

<div class="overlay" role="dialog" aria-modal="true" aria-label={t('card.title')}>
  <div class="card">
    <div class="top">
      <Clef size={80} mood="happy" />
      <div>
        <div class="star">⭐</div>
        <h2>{t('card.title')}</h2>
      </div>
    </div>
    <div class="pair">
      <div class="half music">
        <span class="label">🎵 {t('card.music')}</span>
        <strong>{t(`${key}.music`)}</strong>
        <p>{t(`${key}.musicText`)}</p>
      </div>
      <div class="half code">
        <span class="label">⌨️ {t('card.code')}</span>
        <strong>{t(`${key}.code`)}</strong>
        <p>{t(`${key}.codeText`)}</p>
        <pre>{@html highlight(lesson.card.code)}</pre>
      </div>
    </div>
    <div class="actions">
      <button class="btn ghost" onclick={onmap}>🗺️ {t('card.map')}</button>
      {#if hasNext}
        <button class="btn primary big" onclick={onnext}>{t('card.next')} ➡️</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(33, 37, 41, 0.45);
    display: grid;
    place-items: center;
    z-index: 50;
    padding: 16px;
  }
  .card {
    background: white;
    border-radius: 36px;
    padding: 24px;
    width: min(760px, 100%);
    max-height: 100%;
    overflow: auto;
    animation: pop 0.4s cubic-bezier(0.3, 1.6, 0.6, 1);
  }
  @keyframes pop {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .top {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .star {
    font-size: 54px;
    line-height: 1;
    animation: spin 1.2s ease-out;
  }
  @keyframes spin {
    from { transform: rotate(-200deg) scale(0); }
    to { transform: rotate(0) scale(1); }
  }
  h2 {
    margin: 4px 0 0;
    font-size: 30px;
  }
  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 18px 0;
  }
  @media (max-width: 640px) {
    .pair { grid-template-columns: 1fr; }
  }
  .half {
    border-radius: 24px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .music { background: #fff4e6; }
  .code { background: #f3f0ff; }
  .label {
    font-weight: 700;
    color: var(--ink-soft);
  }
  strong {
    font-size: 30px;
    line-height: 1.1;
  }
  p {
    margin: 0;
    font-size: 18px;
    line-height: 1.35;
  }
  pre {
    margin: 6px 0 0;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 17px;
    background: #1f1d2b;
    color: #f8f9fa;
    padding: 12px;
    border-radius: 12px;
    white-space: pre-wrap;
  }
  pre :global(.tok-fn) { color: #b197fc; }
  pre :global(.tok-str) { color: #8ce99a; }
  pre :global(.tok-num) { color: #ffc078; }
  .actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
</style>
