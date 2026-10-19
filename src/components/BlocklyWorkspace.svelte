<!--
  @component
  The block canvas. Wraps Blockly: creates the workspace, loads saved blocks,
  and reports every change as `{ tracks, code, json }`.

  Props:
  - `blocks`: block types allowed in the palette (lessons unlock them gradually).
  - `initial`: saved Blockly JSON to restore, or null for an empty song.
  - `onchange({ tracks, code, json })`: called after every real change.
  - `flash`: true to make the palette glow ("drag a block from here").

  Exposes `hit(blockId, step)`: briefly lights up a block (and one square of a
  beat) while it sounds.
-->
<script>
  import { onMount } from 'svelte';
  import { Blockly, theme, toolboxFor, emptySong } from '../blocks/workspace.js';
  import { readSong, songCode } from '../blocks/model.js';

  let { blocks, initial = null, onchange, flash = false } = $props();
  let host;
  let workspace;

  /** Reads the song from the blocks and tells the parent. */
  function report() {
    const tracks = readSong(workspace);
    onchange({ tracks, code: songCode(tracks), json: Blockly.serialization.workspaces.save(workspace) });
  }

  /**
   * Lights up a block while it plays.
   * @param {string} blockId - Block to light up.
   * @param {number|null} [step] - For beat blocks, which square.
   */
  export function hit(blockId, step = null) {
    const block = workspace?.getBlockById(blockId);
    if (!block) return;
    const root = block.getSvgRoot();
    root.classList.remove('sb-hit');
    void root.getBoundingClientRect(); // restart the animation
    root.classList.add('sb-hit');
    if (step != null) block.getField('STEPS')?.flashStep?.(step);
  }

  onMount(() => {
    workspace = Blockly.inject(host, {
      toolbox: toolboxFor(blocks),
      theme,
      renderer: 'zelos',
      trashcan: true,
      sounds: false,
      // Icons (zoom, bin) are served from our own site, not a third-party CDN.
      media: './blockly-media/',
      toolboxPosition: 'start',
      zoom: { controls: true, wheel: false, pinch: true, startScale: 1.05, maxScale: 2, minScale: 0.5, scaleSpeed: 1.15 },
      move: { scrollbars: true, drag: true, wheel: true },
    });

    try {
      Blockly.serialization.workspaces.load(initial ?? emptySong(), workspace);
    } catch {
      Blockly.serialization.workspaces.load(emptySong(), workspace);
    }
    if (!workspace.getBlocksByType('strudel_song', false).length) {
      Blockly.serialization.workspaces.load(emptySong(), workspace);
    }

    // Blocks that aren't snapped into the song are greyed out and don't play.
    workspace.addChangeListener(Blockly.Events.disableOrphans);
    workspace.addChangeListener((event) => {
      if (event.isUiEvent) return;
      report();
    });
    report();

    const observer = new ResizeObserver(() => Blockly.svgResize(workspace));
    observer.observe(host);
    return () => {
      observer.disconnect();
      workspace.dispose();
    };
  });
</script>

<div class="workspace" class:flash bind:this={host}></div>

<style>
  .workspace {
    position: absolute;
    inset: 0;
  }
  .flash :global(.blocklyFlyoutBackground) {
    animation: glow 1.2s ease-in-out infinite alternate;
  }
  @keyframes glow {
    from { fill: #fff1dc; }
    to { fill: #ffd8a8; }
  }
  .workspace :global(.blocklyFlyoutBackground) {
    fill-opacity: 1;
  }
  .workspace :global(.sb-step) {
    cursor: pointer;
  }
  .workspace :global(.sb-hit > .blocklyPath) {
    animation: hit 0.3s ease-out;
  }
  .workspace :global(.sb-step-hit) {
    animation: step-hit 0.3s ease-out;
  }
  @keyframes hit {
    from { filter: brightness(1.45) drop-shadow(0 0 6px #ffd43b); }
    to { filter: none; }
  }
  @keyframes step-hit {
    from { stroke: #ffd43b; stroke-width: 6px; }
    to { stroke-width: 2px; }
  }
  .workspace :global(.blocklyText) {
    font-size: 17px !important;
  }
</style>
