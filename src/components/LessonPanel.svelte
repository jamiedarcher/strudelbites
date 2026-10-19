<!--
  @component
  The lesson side panel: Clef, what Clef just said (for grown-ups to read
  along), step progress, and the step's action button (Listen / I see it).

  Props:
  - `lesson`, `stepIndex`: where we are.
  - `mood`: Clef's mood.
  - `hint`: hint text currently shown (empty for none).
  - `onlisten()`, `onconfirm()`, `onhint()`, `onskip()`, `onreplay()`: actions.
-->
<script>
  import { t } from '../lib/i18n.js';
  import Clef from './Clef.svelte';

  let { lesson, stepIndex, mood, hint, onlisten, onconfirm, onhint, onskip, onreplay } = $props();
  const step = $derived(lesson.steps[stepIndex]);
</script>

<section class="lesson">
  <div class="clef-row">
    <Clef size={96} {mood} />
    <div class="bubble">
      <p>{t(`lessons.${lesson.id}.steps.${step.id}.say`)}</p>
      <button class="icon-btn" onclick={onreplay} aria-label={t('studio.replay')} title={t('studio.replay')}>🔁</button>
    </div>
  </div>

  <ol class="dots" aria-label={t('studio.step', { n: stepIndex + 1, total: lesson.steps.length })}>
    {#each lesson.steps as s, i (s.id)}
      <li class:done={i < stepIndex} class:current={i === stepIndex}></li>
    {/each}
  </ol>

  {#if step.type === 'listen'}
    <button class="btn action listen" onclick={onlisten}>👂 {t('studio.listen')}</button>
  {:else if step.type === 'confirm'}
    <button class="btn action confirm" onclick={onconfirm}>👍 {t('studio.seeIt')}</button>
  {/if}

  {#if hint}
    <p class="hint">💡 {hint}</p>
  {/if}

  <div class="footer">
    {#if step.type !== 'listen' && step.type !== 'confirm'}
      <button class="btn help" onclick={onhint}>💡 {t('studio.hint')}</button>
    {/if}
    <button class="skip" onclick={onskip} title={t('studio.skip')} aria-label={t('studio.skip')}>⏭</button>
  </div>
</section>

<style>
  .lesson {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 14px;
    background: #f8f0fc;
    border-right: 3px solid var(--line);
    overflow-y: auto;
    height: 100%;
  }
  .clef-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .bubble {
    position: relative;
    background: white;
    border: 3px solid #d0bfff;
    border-radius: 22px;
    padding: 14px 16px 14px;
    font-size: 19px;
    line-height: 1.35;
    font-weight: 600;
  }
  .bubble::before {
    content: '';
    position: absolute;
    top: -14px;
    left: 50%;
    border: 12px solid transparent;
    border-bottom-color: #d0bfff;
    border-top: 0;
    transform: translateX(-50%);
  }
  .bubble p {
    margin: 0 0 4px;
  }
  .icon-btn {
    border: none;
    background: #f3f0ff;
    border-radius: 12px;
    font-size: 22px;
    min-width: 48px;
    min-height: 44px;
  }
  .dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .dots li {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #e9ecef;
  }
  .dots li.done {
    background: var(--teal);
  }
  .dots li.current {
    background: var(--purple);
    transform: scale(1.3);
  }
  .action {
    font-size: 28px;
    padding: 18px;
    border-radius: 24px;
    color: white;
    animation: wiggle 1.4s ease-in-out infinite;
  }
  .listen {
    background: var(--orange);
    box-shadow: 0 6px 0 #d9480f;
  }
  .confirm {
    background: var(--teal);
    box-shadow: 0 6px 0 #087f5b;
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(0); }
    10% { transform: rotate(-3deg); }
    20% { transform: rotate(3deg); }
    30% { transform: rotate(0); }
  }
  .hint {
    margin: 0;
    background: #fff9db;
    border-radius: 16px;
    padding: 12px 14px;
    font-size: 17px;
    line-height: 1.35;
  }
  .footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .help {
    font-size: 20px;
  }
  .skip {
    border: none;
    background: none;
    font-size: 18px;
    opacity: 0.45;
    min-width: 44px;
    min-height: 44px;
  }
</style>
