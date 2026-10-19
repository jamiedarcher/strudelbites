# Roadmap

## Built
- **v0.1** — Blocks → Strudel code, Clef the guide, Beats & code lessons 1–4, Read music lessons 1–2, Compose mode, Code and Staff views.
- **v0.2** — Lessons c5–c8 and t3–t6; speed, scale, chords and articulation blocks; play-along highlighting; volume limiter.
- **v0.3** — 88-key piano strip and top-view drum kit that play along; tap the kit to play it.

## Next
- Tap piano keys to hear notes and add them to a melody
- Recorded voice for Clef
- Lessons: Repeat and change; Keys and sharps
- Save and share songs as links
- Greek and Romanian

## Later: MIDI instruments and full-screen modes

> **Platform note:** the Web MIDI API works in Chrome, Edge and Firefox but not in Safari on macOS or iPad ([caniuse](https://caniuse.com/midi), [WebKit bug 107250](https://bugs.webkit.org/show_bug.cgi?id=107250)). MIDI features will be laptop-first; iPad would need a native wrapper.

| Feature | What it does |
| --- | --- |
| MIDI device detection | Recognise a connected keyboard, pad controller or e-drum kit and pick a matching mode |
| Auto-mapping | Keyboards by note number; drums by the General MIDI drum map (36 kick, 38 snare, 42/46 hi-hat, 48/45/43 toms, 49 crash, 51 ride); per-device profiles; "hit the pad for the snare" correction |
| MIDI CC learn | Map knobs, faders and buttons to play/stop, tempo, record, volume, next lesson |
| Full-screen piano | Piano and piano roll fill the screen; staff and code take the whole right panel while playing |
| Compose by playing | Play a MIDI keyboard in Compose mode; notes become melody blocks, staff and code (quantised, with count-in) |
| Piano play-along | Synthesia-style falling notes with the staff and/or code visible; wait mode, speed control, starter songs |
| Full-screen drums | Kit or pad-grid layout depending on the connected instrument |
| Record drums to code | Play a drum pad or e-drum kit; the performance becomes beat blocks and Strudel code |
| Drum play-along | Learn the kit (e-drums, e.g. Alesis Strata Club) or finger drumming (pad controllers), with timing feedback |
