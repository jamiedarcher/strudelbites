<!--
  @component
  Clef, the treble-clef guide. Purely visual: give it a `mood` and it animates.

  Props:
  - `mood`: 'idle' (gentle bob), 'talking' (mouth moves), 'happy' (jumps) or
    'dance' (bounces in time with the music).
  - `size`: width in pixels (height is 1.5×).
  - `beat`: length of one beat in seconds, for dancing in time.
-->
<script>
  let { mood = 'idle', size = 120, beat = 0.5 } = $props();
</script>

<svg class="clef {mood}" style="--beat: {beat}s" viewBox="0 0 120 180" width={size} height={size * 1.5} role="img" aria-label="Clef">
  <g class="body">
    <ellipse cx="60" cy="172" rx="26" ry="5" fill="rgba(0,0,0,0.08)" class="shadow" />
    <g transform="translate(6,4) scale(1.08,1.04)">
      <path
        d="M54 96 C40 96 38 80 52 78 C70 76 76 98 60 110 C42 122 22 108 26 88 C30 66 62 54 62 30 C62 14 50 10 46 22 C40 40 50 120 52 140 C54 156 36 158 36 146"
        fill="none"
        stroke="#6741D9"
        stroke-width="9"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="38" cy="146" r="7" fill="#6741D9" />
      <!-- face sits inside the big loop -->
      <circle cx="47" cy="95" r="15" fill="#FFF3BF" stroke="#6741D9" stroke-width="3" />
      <circle cx="41" cy="92" r="3.6" fill="#212529" class="eye" />
      <circle cx="53" cy="92" r="3.6" fill="#212529" class="eye" />
      <circle cx="42.2" cy="90.8" r="1.2" fill="#fff" />
      <circle cx="54.2" cy="90.8" r="1.2" fill="#fff" />
      <circle cx="37" cy="99" r="2.6" fill="#FFA8A8" />
      <circle cx="57" cy="99" r="2.6" fill="#FFA8A8" />
      <path class="mouth" d="M42 100 Q47 105 52 100" fill="none" stroke="#212529" stroke-width="2.2" stroke-linecap="round" />
    </g>
  </g>
</svg>

<style>
  .clef {
    overflow: visible;
    display: block;
  }
  .body {
    transform-origin: 60px 170px;
    animation: bob 2.6s ease-in-out infinite;
  }
  .happy .body {
    animation: jump 0.5s ease-out 2;
  }
  .dance .body {
    animation: dance var(--beat) ease-in-out infinite alternate;
  }
  @keyframes dance {
    from { transform: translateY(0) rotate(-8deg); }
    to { transform: translateY(-10px) rotate(8deg); }
  }
  .talking .mouth {
    animation: talk 0.28s ease-in-out infinite alternate;
    transform-origin: 47px 101px;
  }
  .eye {
    animation: blink 4s infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes bob {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50% { transform: translateY(-5px) rotate(2deg); }
  }
  @keyframes jump {
    0% { transform: translateY(0) scale(1); }
    40% { transform: translateY(-22px) scale(1.06, 0.96); }
    100% { transform: translateY(0) scale(1); }
  }
  @keyframes talk {
    from { transform: scaleY(1); }
    to { transform: scaleY(1.9); }
  }
  @keyframes blink {
    0%, 92%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .body, .eye, .mouth { animation: none !important; }
  }
</style>
