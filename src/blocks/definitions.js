/**
 * @file Every block in the StrudelBites palette.
 *
 * Block shapes follow Scratch:
 * - "My song" is a hat block. Everything snapped inside it plays.
 * - Track blocks (sound, beat, melody) stack inside the song. More than one
 *   track plays at the same time, using Strudel's `stack()`.
 * - Note blocks stack inside a melody, one after another.
 *
 * To add a block: define it here, add its code in `model.js`, add its label
 * and tooltip to `src/locales/en.json`, and list it in a lesson or in `ALL_BLOCKS`.
 */
import * as Blockly from 'blockly/core';
import { t } from '../lib/i18n.js';
import { SOUNDS, NOTES, LENGTHS, INSTRUMENTS, byId } from './catalog.js';
import { FieldSteps } from './fieldSteps.js';

/** Block colours, one per kind, so learners can find blocks by colour. */
export const COLOURS = {
  song: '#F59F00',
  sound: '#E64980',
  beat: '#7950F2',
  beat8: '#4C6EF5',
  melody: '#12B886',
};

/** Every block type a learner can use in Compose mode. */
export const ALL_BLOCKS = ['strudel_sound', 'strudel_beat4', 'strudel_beat8', 'strudel_melody', 'strudel_note'];

/**
 * Dropdown options for sounds: picture first, word second (for pre-readers).
 * @returns {Array<[string, string]>}
 */
function soundOptions() {
  return SOUNDS.map((s) => [`${s.emoji} ${t(`blocks.sounds.${s.id}`)}`, s.id]);
}

/**
 * Builds a beat block definition with a given number of steps.
 * @param {number} steps - 4 or 8.
 * @param {string} defaultSound - Sound id selected by default.
 * @param {string} colour - Block colour.
 * @returns {object} A Blockly block definition.
 */
function beatBlock(steps, defaultSound, colour) {
  return {
    init() {
      const sound = new Blockly.FieldDropdown(soundOptions);
      this.appendDummyInput()
        .appendField(sound, 'SOUND')
        .appendField(new FieldSteps('0'.repeat(steps)), 'STEPS');
      this.getField('SOUND').setValue(defaultSound);
      this.setPreviousStatement(true, 'track');
      this.setNextStatement(true, 'track');
      this.setColour(colour);
      this.setTooltip(t(`blocks.tooltips.beat${steps}`));
    },
  };
}

Blockly.Blocks.strudel_song = {
  init() {
    this.appendDummyInput().appendField(`🎵 ${t('blocks.song')}`);
    this.appendStatementInput('TRACKS').setCheck('track');
    this.setColour(COLOURS.song);
    this.setDeletable(false);
    this.hat = 'cap';
    this.setTooltip(t('blocks.tooltips.song'));
  },
};

Blockly.Blocks.strudel_sound = {
  init() {
    this.appendDummyInput()
      .appendField(`🔊 ${t('blocks.play')}`)
      .appendField(new Blockly.FieldDropdown(soundOptions), 'SOUND');
    this.setPreviousStatement(true, 'track');
    this.setNextStatement(true, 'track');
    this.setColour(COLOURS.sound);
    this.setTooltip(t('blocks.tooltips.sound'));
  },
};

Blockly.Blocks.strudel_beat4 = beatBlock(4, 'bd', COLOURS.beat);
Blockly.Blocks.strudel_beat8 = beatBlock(8, 'hh', COLOURS.beat8);

Blockly.Blocks.strudel_melody = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(() => INSTRUMENTS.map((i) => [`${i.emoji} ${t(`blocks.instruments.${i.id}`)}`, i.id])), 'INSTRUMENT')
      .appendField(t('blocks.melody'));
    this.appendStatementInput('NOTES').setCheck('note');
    this.setPreviousStatement(true, 'track');
    this.setNextStatement(true, 'track');
    this.setColour(COLOURS.melody);
    this.setTooltip(t('blocks.tooltips.melody'));
  },
};

Blockly.Blocks.strudel_note = {
  init() {
    const pitch = new Blockly.FieldDropdown(
      () => NOTES.map((n) => [`${n.emoji} ${n.id === 'rest' ? t('blocks.rest') : n.name}`, n.id]),
      function recolour(value) {
        // Each note keeps its rainbow colour, on the block and on the staff.
        this.getSourceBlock()?.setColour(byId(NOTES, value)?.colour ?? '#868E96');
        return value;
      },
    );
    const length = new Blockly.FieldDropdown(() =>
      LENGTHS.map((l) => [`${l.symbol} ${t(`blocks.lengths.${l.id}`)}`, l.id]),
    );
    this.appendDummyInput().appendField(pitch, 'PITCH').appendField(length, 'LEN');
    this.getField('LEN').setValue('q');
    this.setPreviousStatement(true, 'note');
    this.setNextStatement(true, 'note');
    this.setColour(NOTES[0].colour);
    this.setTooltip(t('blocks.tooltips.note'));
  },
};
