# lib/

Small helpers shared across the app.

| File | What it does |
| --- | --- |
| `store.svelte.js` | Reactive app state: players, progress (stars, current step), saved blocks, tempo, voice on/off. |
| `storage.js` | Saves and loads that state in the browser. No accounts, nothing leaves the device. |
| `speech.js` | Clef's voice (browser speech synthesis). Instructions are spoken automatically for pre-readers. |
| `i18n.js` | `t('key')` translation lookup. |
| `highlight.js` | Colours Strudel code in the Code view and spotlights words a lesson is teaching. |
