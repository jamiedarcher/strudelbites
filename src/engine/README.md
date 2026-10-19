# engine/

`strudel.js` is the only file that talks to [Strudel](https://strudel.cc) (`@strudel/web`).

The rest of the app hands it a string of Strudel code and calls `play()`, `stop()`, `preview()` or `setTempo()`. Keeping Strudel behind this small wrapper means it can be upgraded in one place.

Notes:
- Browsers (especially iPad Safari) only allow sound after the user taps something, so audio starts on the first tap.
- Samples come from the `tidalcycles/dirt-samples` pack, loaded from GitHub on start.
- One Strudel *cycle* is one 4-beat bar in StrudelBites. `0.5` cycles per second = 120 BPM.
- Always import Strudel's audio functions (`getAudioContext`, `superdough`, `samples`) from `@strudel/web`. It bundles its own copy of the sound library; importing `superdough` separately creates a second audio system that the music doesn't use.
- `tap(sound)` plays a single sound immediately (used by the drum kit).
