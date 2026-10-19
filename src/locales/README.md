# locales/

Every word a learner sees or hears. English (`en.json`) is the first language; Greek (`el.json`) and Romanian (`ro.json`) are on the roadmap.

To add a language:
1. Copy `en.json` to `<code>.json` and translate the values (keep the keys).
2. Register it in `LOCALES` in `src/lib/i18n.js`.
3. Have a native speaker check music words: they often differ from everyday words.

Missing keys fall back to English, so a partial translation still works.
