<!--
  @component
  The main music-making screen, used for both lessons and Compose mode.

  Layout: top bar (home, title, speed, Play, voice) · lesson panel on the
  left (lessons only) · block canvas · code/staff strip along the bottom.

  This is also where the lesson engine runs: after every change it builds a
  context `{ tracks, code, playing, listened, panel }` and asks the current
  step's `check()` whether the learner has done it. If so, Clef cheers and
  the next step starts.

  Play-along: the code that is played has hidden hooks (see `songCode`), so
  each sound reports back; the matching block and staff note light up.

  Props:
  - `mode`: 'lesson' or 'compose'.
  - `lesson`: the lesson object (lesson mode only).
  - `onexit()`: leave the studio. `onnext(lesson)`: open another lesson.
-->
<script>
  import { onMount, untrack } from 'svelte';
  import { t } from '../lib/i18n.js';
  import { speak, stopSpeaking, setVoiceEnabled } from '../lib/speech.js';
  import { app, TEMPOS, persist, activeProfile, saveWorkspace, saveStep, completeLesson } from '../lib/store.svelte.js';
  import { play, preview, stop, setTempo, isPlaying, onEngineChange, onHit } from '../engine/strudel.js';
  import { songCode, flattenLeaves, leafTiming, eventAt } from '../blocks/model.js';
  import { ALL_BLOCKS } from '../blocks/definitions.js';
  import { nextLesson } from '../lessons/index.js';
  import BlocklyWorkspace from './BlocklyWorkspace.svelte';
  import LessonPanel from './LessonPanel.svelte';
  import ViewPanel from './ViewPanel.svelte';
  import ConceptCard from './ConceptCard.svelte';

  let { mode, lesson = null, onexit, onnext } = $props();

  const profile = activeProfile();
  const key = mode === 'compose' ? 'compose' : lesson.id;
  const blocks = mode === 'compose' ? ALL_BLOCKS : lesson.blocks;
  // Replaying a finished lesson starts fresh; an unfinished one resumes.
  const replay = lesson && profile.completed.includes(lesson.id);
  const initial = replay ? null : (profile.workspaces[key] ?? null);

  let stepIndex = $state(lesson && !replay ? Math.min(profile.steps[lesson.id] ?? 0, lesson.steps.length - 1) : 0);
  let tracks = $state([]);
  let code = $state('');
  let playing = $state(isPlaying());
  let listened = $state(false);
  let panelOpen = $state(mode === 'compose' || lesson?.showCode !== false);
  let panel = $state('code');
  let mood = $state('idle');
  let hint = $state('');
  let error = $state('');
  let showCard = $state(false);
  let advancing = false;
  let liveTimer;
  let canvas;
  let views;

  const step = $derived(lesson ? lesson.steps[stepIndex] : null);
  const highlightTarget = $derived(step?.highlight ?? '');
  const focus = $derived(step?.focus ?? []);
  // Clef dances in time while music plays, unless busy talking or cheering.
  const clefMood = $derived(playing && mood === 'idle' ? 'dance' : mood);
  const beatSeconds = $derived(1 / (TEMPOS[app.tempo].cps * 4));
  // Timing for each sound-making track, used to work out which note is playing.
  const leaves = $derived(flattenLeaves(tracks).map(({ track, factor }) => ({ track, timing: leafTiming(track, factor) })));

  /**
   * Plays the current song, with play-along hooks added.
   * @returns {Promise<void>}
   */
  function playSong() {
    return play(songCode(tracks, { hooks: true }));
  }

  /**
   * Lights up whatever just made a sound: its block (or note block, or beat
   * square) and its note on the staff.
   * @param {number} leaf - Track (leaf) number.
   * @param {number} cycle - When the sound started, in cycles.
   */
  function handleHit(leaf, cycle) {
    const info = leaves[leaf];
    if (!info) return;
    const index = eventAt(info.timing, cycle);
    const { track } = info;
    if (track.kind === 'beat') canvas?.hit(track.id, index);
    else if (track.kind === 'melody' || track.kind === 'scale') canvas?.hit(track.notes[index]?.id ?? track.id);
    else canvas?.hit(track.id);
    views?.now(leaf, index);
  }

  /**
   * Makes Clef say something, animating the mouth while speaking.
   * @param {string} text - What to say.
   */
  function say(text) {
    speak(text, {
      onStart: () => (mood = 'talking'),
      onEnd: () => {
        if (mood === 'talking') mood = 'idle';
      },
    });
  }

  /** Starts the current step: opens its panel if it has one, and says its instruction. */
  function enterStep() {
    hint = '';
    const current = lesson.steps[stepIndex];
    if (current.panel) {
      panelOpen = true;
      panel = current.panel;
    }
    say(t(`lessons.${lesson.id}.steps.${current.id}.say`));
    // The learner may already have done this step; check again after a moment.
    setTimeout(check, 2500);
  }

  /** Celebrates, then moves to the next step (or finishes the lesson). */
  function advance() {
    if (advancing) return;
    advancing = true;
    mood = 'happy';
    say(t('clef.yay'));
    setTimeout(() => {
      advancing = false;
      mood = 'idle';
      if (stepIndex + 1 >= lesson.steps.length) {
        completeLesson(lesson.id);
        showCard = true;
        mood = 'happy';
        say(t('clef.lessonDone'));
        return;
      }
      stepIndex += 1;
      saveStep(lesson.id, stepIndex);
      enterStep();
    }, 1400);
  }

  /** Runs the current step's check against the song. */
  function check() {
    if (!lesson || !step || advancing || showCard) return;
    if (step.type === 'listen' || step.type === 'confirm') return;
    const ctx = { tracks, code, playing, listened, panel: panelOpen ? panel : null };
    if (step.check?.(ctx)) advance();
  }

  // Re-check whenever anything a step might look at changes.
  $effect(() => {
    void [tracks, code, playing, panel, panelOpen];
    untrack(check);
  });

  /**
   * Called by the canvas after every change: update the song, save it,
   * and if music is playing, update the sound live.
   * @param {{tracks: Array, code: string, json: object}} song
   */
  function handleChange(song) {
    tracks = song.tracks;
    code = song.code;
    error = '';
    saveWorkspace(key, song.json);
    if (playing) {
      clearTimeout(liveTimer);
      liveTimer = setTimeout(playSong, 250);
    }
  }

  /** Play / Stop button. */
  function togglePlay() {
    if (playing) {
      stop();
    } else if (!code) {
      say(t('studio.emptySong'));
    } else {
      playSong();
    }
  }

  /** "Listen" button: plays the lesson's example, then moves on. */
  function listen() {
    listened = true;
    preview(lesson.example);
    setTimeout(() => {
      if (step?.type === 'listen') advance();
    }, 4500);
  }

  /** Shows and speaks the hint for the current step. */
  function showHint() {
    hint = t(`lessons.${lesson.id}.steps.${step.id}.hint`);
    say(hint);
  }

  /**
   * Changes the speed.
   * @param {keyof TEMPOS} name - 'slow', 'walk' or 'fast'.
   */
  function chooseTempo(name) {
    app.tempo = name;
    persist();
    setTempo(TEMPOS[name].cps);
  }

  /** Turns Clef's voice on or off. */
  function toggleVoice() {
    app.voiceOn = !app.voiceOn;
    setVoiceEnabled(app.voiceOn);
    persist();
  }

  /** Leaves the studio, stopping sound and speech. */
  function exit() {
    stop();
    stopSpeaking();
    onexit();
  }

  onMount(() => {
    setVoiceEnabled(app.voiceOn);
    setTempo(TEMPOS[app.tempo].cps);
    const unsubscribe = onEngineChange((state) => {
      playing = state.playing;
      if (state.error) error = t('studio.error');
    });
    const unsubscribeHits = onHit(handleHit);
    if (lesson) enterStep();
    else say(t('clef.compose'));
    return () => {
      unsubscribe();
      unsubscribeHits();
      clearTimeout(liveTimer);
    };
  });
</script>

<div class="studio">
  <header class="bar">
    <button class="btn ghost square" onclick={exit} aria-label={lesson ? t('studio.lessons') : t('studio.home')}>
      {lesson ? '🗺️' : '🏠'}
    </button>
    <h1 class="title">
      {#if lesson}{lesson.icon} {t(`lessons.${lesson.id}.title`)}{:else}🎨 {t('studio.composeTitle')}{/if}
    </h1>
    <div class="tempo" role="group" aria-label={t('studio.tempo')}>
      {#each Object.entries(TEMPOS) as [name, tempo] (name)}
        <button class:active={app.tempo === name} onclick={() => chooseTempo(name)} aria-pressed={app.tempo === name}>
          {tempo.icon}
        </button>
      {/each}
    </div>
    <button class="play" class:playing class:pulse={highlightTarget === 'play'} onclick={togglePlay}>
      {playing ? '⏹' : '▶'} <span>{playing ? t('studio.stop') : t('studio.play')}</span>
    </button>
    <button class="btn ghost square" onclick={toggleVoice} aria-label={app.voiceOn ? t('studio.voiceOn') : t('studio.voiceOff')}>
      {app.voiceOn ? '🗣️' : '🔇'}
    </button>
    <span class="who" aria-hidden="true">{profile.face}</span>
  </header>

  <div class="body" class:has-lesson={!!lesson}>
    {#if lesson}
      <LessonPanel
        {lesson}
        {stepIndex}
        mood={clefMood}
        beat={beatSeconds}
        {hint}
        onlisten={listen}
        onconfirm={advance}
        onhint={showHint}
        onskip={advance}
        onreplay={() => say(t(`lessons.${lesson.id}.steps.${step.id}.say`))}
      />
    {/if}
    <div class="main">
      <div class="canvas">
        <BlocklyWorkspace bind:this={canvas} {blocks} {initial} onchange={handleChange} flash={highlightTarget === 'toolbox'} />
        {#if error}<div class="toast" role="status">🤔 {error}</div>{/if}
      </div>
      <ViewPanel
        bind:this={views}
        open={panelOpen}
        tab={panel}
        ontab={(tab) => {
          panel = tab;
          panelOpen = true;
        }}
        onclose={() => (panelOpen = false)}
        {code}
        {tracks}
        {focus}
        pulse={highlightTarget === 'staff' ? 'staff' : step?.type === 'confirm' && step.panel === 'code' ? 'code' : ''}
      />
    </div>
  </div>

  {#if showCard}
    <ConceptCard
      {lesson}
      hasNext={!!nextLesson(lesson.id)}
      onmap={exit}
      onnext={() => {
        stop();
        onnext(nextLesson(lesson.id));
      }}
    />
  {/if}
</div>

<style>
  .studio {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    padding-top: max(8px, env(safe-area-inset-top));
    background: white;
    border-bottom: 3px solid var(--line);
    min-height: 76px;
  }
  .title {
    flex: 1;
    margin: 0;
    font-size: clamp(20px, 2.4vw, 28px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tempo {
    display: flex;
    background: var(--paper);
    border-radius: 18px;
    padding: 4px;
    gap: 2px;
  }
  .tempo button {
    font-size: 26px;
    width: 52px;
    height: 48px;
    border: none;
    border-radius: 14px;
    background: transparent;
    opacity: 0.5;
  }
  .tempo button.active {
    background: white;
    opacity: 1;
    box-shadow: 0 2px 0 var(--line);
  }
  .play {
    font: inherit;
    font-size: 26px;
    font-weight: 800;
    color: white;
    background: var(--green);
    border: none;
    border-radius: 22px;
    padding: 8px 24px;
    min-height: 60px;
    min-width: 150px;
    box-shadow: 0 6px 0 #2b8a3e;
  }
  .play.playing {
    background: var(--red);
    box-shadow: 0 6px 0 #c92a2a;
  }
  .play:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 #2b8a3e;
  }
  .who {
    font-size: 36px;
  }
  .body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr;
  }
  .body.has-lesson {
    grid-template-columns: 270px 1fr;
  }
  .main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }
  .canvas {
    position: relative;
    flex: 1;
    min-height: 0;
  }
  .toast {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff3bf;
    border: 3px solid #ffd43b;
    border-radius: 18px;
    padding: 10px 18px;
    font-size: 18px;
    font-weight: 700;
    z-index: 5;
  }
  /* iPad portrait and small laptops: slimmer lesson panel, icon-only Play. */
  @media (max-width: 1100px) {
    .body.has-lesson {
      grid-template-columns: 236px 1fr;
    }
    .play span {
      display: none;
    }
    .play {
      min-width: 80px;
    }
  }
  @media (max-width: 700px) {
    .tempo { display: none; }
    .body.has-lesson {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }
  }
</style>
