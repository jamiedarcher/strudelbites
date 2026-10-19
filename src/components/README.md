# components/

The Svelte screens and pieces of the interface. Each file starts with an `@component` comment explaining its props.

| Component | Role |
| --- | --- |
| `App.svelte` (in `src/`) | Chooses the screen: players → home → lesson map / lesson, or compose. |
| `ProfilePicker.svelte` | "Who's playing?" — pick a face, optionally a name. |
| `Home.svelte` | The two choices: **Learn** or **Compose**. |
| `LessonMap.svelte` | Both learning paths, with stars, locks and "coming soon". |
| `Studio.svelte` | The music-making screen, and where the **lesson engine** runs each step's check. |
| `LessonPanel.svelte` | Clef, the spoken instruction, step dots, Listen / I see it / Help buttons. |
| `BlocklyWorkspace.svelte` | Wraps the Blockly canvas and reports changes. |
| `ViewPanel.svelte` | The bottom strip: **Code** view and **Staff** view of the same song. |
| `Piano.svelte` | Narrow 88-key piano strip; keys light up as notes play. Labels are HTML text so they never stretch. |
| `DrumKit.svelte` | Top-view five-piece drum kit; parts flash as they play; hover/tap shows names, tap plays the sound. |
| `ConceptCard.svelte` | End-of-lesson reward pairing the music idea with the code idea. |
| `Clef.svelte` | The treble-clef guide, with idle / talking / happy moods. |
