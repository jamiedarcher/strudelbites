<!--
  @component
  The app shell: decides which screen is showing.
  profiles → home → (lesson map → lesson) or compose.
-->
<script>
  import { activeProfile } from './lib/store.svelte.js';
  import ProfilePicker from './components/ProfilePicker.svelte';
  import Home from './components/Home.svelte';
  import LessonMap from './components/LessonMap.svelte';
  import Studio from './components/Studio.svelte';

  let screen = $state(activeProfile() ? 'home' : 'profiles');
  let lesson = $state(null);
  // Changing this number remounts the studio, giving each lesson a fresh canvas.
  let visit = $state(0);

  /**
   * Opens a lesson in the studio.
   * @param {object} next - The lesson to open.
   */
  function openLesson(next) {
    lesson = next;
    visit += 1;
    screen = 'lesson';
  }
</script>

{#if screen === 'profiles'}
  <ProfilePicker onpicked={() => (screen = 'home')} />
{:else if screen === 'home'}
  <Home onlearn={() => (screen = 'map')} oncompose={() => (screen = 'compose')} onswitch={() => (screen = 'profiles')} />
{:else if screen === 'map'}
  <LessonMap onopen={openLesson} onhome={() => (screen = 'home')} />
{:else if screen === 'lesson'}
  {#key visit}
    <Studio mode="lesson" {lesson} onexit={() => (screen = 'map')} onnext={(next) => (next ? openLesson(next) : (screen = 'map'))} />
  {/key}
{:else if screen === 'compose'}
  <Studio mode="compose" onexit={() => (screen = 'home')} onnext={() => {}} />
{/if}
