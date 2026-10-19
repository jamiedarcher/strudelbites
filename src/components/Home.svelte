<!--
  @component
  The two big choices: Learn (lessons with Clef) or Compose (every block, no lessons).

  Props:
  - `onlearn()`, `oncompose()`, `onswitch()`: navigation callbacks.
-->
<script>
  import { activeProfile } from '../lib/store.svelte.js';
  import { t } from '../lib/i18n.js';
  import { speak } from '../lib/speech.js';
  import Clef from './Clef.svelte';

  let { onlearn, oncompose, onswitch } = $props();
  const profile = activeProfile();
  let talking = $state(false);

  $effect(() => {
    const line = profile?.name ? t('clef.hello', { name: profile.name }) : t('clef.helloNoName');
    speak(line, { onStart: () => (talking = true), onEnd: () => (talking = false) });
  });
</script>

<main class="home">
  <header>
    <button class="btn ghost player" onclick={onswitch} aria-label={t('home.switch')}>
      <span class="face">{profile?.face}</span> {profile?.name}
    </button>
  </header>
  <div class="greeting">
    <Clef size={130} mood={talking ? 'talking' : 'idle'} />
  </div>
  <div class="choices">
    <button class="choice learn" onclick={onlearn}>
      <span class="icon">🎓</span>
      <span class="title">{t('home.learn')}</span>
      <span class="text">{t('home.learnText')}</span>
    </button>
    <button class="choice compose" onclick={oncompose}>
      <span class="icon">🎨</span>
      <span class="title">{t('home.compose')}</span>
      <span class="text">{t('home.composeText')}</span>
    </button>
  </div>
</main>

<style>
  .home {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 16px 48px;
  }
  header {
    align-self: stretch;
    display: flex;
    justify-content: flex-end;
  }
  .player .face {
    font-size: 30px;
  }
  .greeting {
    margin: 8px 0 16px;
  }
  .choices {
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    justify-content: center;
  }
  .choice {
    width: min(340px, 90vw);
    padding: 28px 24px;
    border-radius: 36px;
    border: none;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    text-align: center;
    transition: transform 0.12s;
  }
  .choice:active {
    transform: translateY(5px);
  }
  .learn {
    background: var(--purple);
    box-shadow: 0 8px 0 #4527a0;
  }
  .compose {
    background: var(--teal);
    box-shadow: 0 8px 0 #087f5b;
  }
  .icon {
    font-size: 84px;
    line-height: 1.1;
  }
  .title {
    font-size: 40px;
    font-weight: 800;
  }
  .text {
    font-size: 19px;
    opacity: 0.95;
    line-height: 1.3;
  }
</style>
