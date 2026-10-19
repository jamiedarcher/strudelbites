/**
 * @file Blockly setup: theme, toolbox and starting workspace.
 *
 * Kept separate from the Svelte component so the configuration can be read
 * (and tested) without any UI.
 */
import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import './definitions.js';

Blockly.setLocale(En);

// Small hands aren't precise: let blocks snap together from further away
// (Blockly's default is 28px).
Blockly.config.snapRadius = 56;
Blockly.config.connectingSnapRadius = 68;

/** Warm, high-contrast theme with big rounded type for young eyes. */
export const theme = Blockly.Theme.defineTheme('strudelbites', {
  name: 'strudelbites',
  base: Blockly.Themes.Classic,
  fontStyle: { family: "'Baloo 2', system-ui, sans-serif", weight: '700', size: 16 },
  componentStyles: {
    workspaceBackgroundColour: '#FFFBF4',
    toolboxBackgroundColour: '#FFF1DC',
    flyoutBackgroundColour: '#FFF1DC',
    flyoutOpacity: 1,
    scrollbarColour: '#D9C9B0',
    scrollbarOpacity: 0.7,
    insertionMarkerColour: '#000000',
    insertionMarkerOpacity: 0.25,
  },
});

/**
 * Example contents for each block type shown in the palette. Note blocks are
 * offered in every colour so pre-readers can pick a note by colour.
 */
const PALETTE = {
  strudel_sound: [{ kind: 'block', type: 'strudel_sound' }],
  strudel_beat4: [{ kind: 'block', type: 'strudel_beat4' }],
  strudel_beat8: [{ kind: 'block', type: 'strudel_beat8' }],
  strudel_melody: [{ kind: 'block', type: 'strudel_melody' }],
  strudel_note: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'rest'].map((pitch) => ({
    kind: 'block',
    type: 'strudel_note',
    fields: { PITCH: pitch, LEN: 'q' },
  })),
};

/**
 * Builds the palette (Blockly "flyout toolbox") for a set of allowed blocks.
 * Lessons pass only the blocks they have unlocked, which keeps the screen simple.
 * @param {string[]} types - Block types to show.
 * @returns {object} Blockly toolbox JSON.
 */
export function toolboxFor(types) {
  return {
    kind: 'flyoutToolbox',
    contents: types.flatMap((type) => PALETTE[type] ?? []),
  };
}

/**
 * A fresh workspace containing only the "My song" block.
 * @returns {object} Blockly workspace JSON.
 */
export function emptySong() {
  return {
    blocks: { languageVersion: 0, blocks: [{ type: 'strudel_song', x: 40, y: 40 }] },
  };
}

export { Blockly };
