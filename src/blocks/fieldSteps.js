/**
 * @file A custom Blockly field: a row of squares you tap on and off.
 *
 * It is the most important control for young learners. Each square is one
 * step of the beat: on means "play", off means a rest (`~` in the code).
 * The value is a string of 1s and 0s, for example `"1010"`, so it is saved,
 * undone and redone like any other Blockly field.
 */
import * as Blockly from 'blockly/core';

const CELL = 34;
const GAP = 6;
const GROUP_GAP = 6;

/** A row of tappable step squares. */
export class FieldSteps extends Blockly.Field {
  /**
   * @param {string} [value='0000'] - Initial steps, e.g. `"1000"`.
   * @param {Function} [validator] - Optional Blockly validator.
   */
  constructor(value = '0000', validator) {
    super(value, validator);
    this.SERIALIZABLE = true;
    this.CURSOR = 'pointer';
    this.cells_ = [];
  }

  /**
   * Builds the field from JSON block definitions (`{"type": "field_steps", "value": "1000"}`).
   * @param {{value?: string}} options - JSON options.
   * @returns {FieldSteps}
   */
  static fromJson(options) {
    return new FieldSteps(options.value);
  }

  /**
   * Accepts only strings of 1–16 ones and zeros.
   * @param {*} value - Proposed value.
   * @returns {string|null} The value, or null to reject it.
   */
  doClassValidation_(value) {
    return typeof value === 'string' && /^[01]{1,16}$/.test(value) ? value : null;
  }

  /** Creates the SVG group; squares are (re)built in `render_`. */
  initView() {
    this.cells_ = [];
  }

  /** Draws the squares to match the current value. */
  render_() {
    const value = this.getValue() ?? '';
    const n = value.length;
    if (this.cells_.length !== n) {
      this.cells_.forEach((cell) => cell.remove());
      this.cells_ = [];
      for (let i = 0; i < n; i++) {
        const x = i * (CELL + GAP) + Math.floor(i / 4) * GROUP_GAP;
        this.cells_.push(
          Blockly.utils.dom.createSvgElement(
            Blockly.utils.Svg.RECT,
            { x, y: 0, width: CELL, height: CELL, rx: 8, ry: 8, class: 'sb-step' },
            this.fieldGroup_,
          ),
        );
      }
    }
    this.cells_.forEach((cell, i) => {
      const on = value[i] === '1';
      // Inline styles, because Blockly's CSS paints every editable field's rect white.
      cell.style.fill = on ? '#FFFFFF' : 'rgba(0,0,0,0.25)';
      cell.style.fillOpacity = '1';
      cell.style.stroke = on ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.45)';
      cell.style.strokeWidth = '2';
      cell.setAttribute('data-on', on ? '1' : '0');
    });
    const width = n * (CELL + GAP) - GAP + Math.floor((n - 1) / 4) * GROUP_GAP;
    this.size_ = new Blockly.utils.Size(Math.max(width, CELL), CELL);
  }

  /**
   * Toggles the square that was tapped. Uses the tap position because the
   * event target can be the whole block after Blockly's gesture handling.
   * @param {PointerEvent} [event] - The tap.
   */
  showEditor_(event) {
    const value = this.getValue() ?? '';
    if (!event || !this.fieldGroup_ || !value) return;
    const box = this.fieldGroup_.getBoundingClientRect();
    const scale = box.width / this.size_.width;
    const localX = (event.clientX - box.left) / scale;
    let index = -1;
    for (let i = 0; i < value.length; i++) {
      const x = i * (CELL + GAP) + Math.floor(i / 4) * GROUP_GAP;
      if (localX >= x - GAP / 2 && localX <= x + CELL + GAP / 2) index = i;
    }
    if (index < 0) return;
    const next = value.slice(0, index) + (value[index] === '1' ? '0' : '1') + value.slice(index + 1);
    this.setValue(next);
  }

  /**
   * Briefly lights up one square while its sound plays (play-along).
   * @param {number} index - Step number (0-based).
   */
  flashStep(index) {
    const cell = this.cells_[index];
    if (!cell) return;
    cell.classList.remove('sb-step-hit');
    void cell.getBoundingClientRect(); // restart the animation
    cell.classList.add('sb-step-hit');
  }

  /**
   * Text used by screen readers and copy/paste: the pattern as Strudel would write it.
   * @returns {string}
   */
  getText() {
    return (this.getValue() ?? '').replace(/1/g, 'x').replace(/0/g, '~');
  }
}

Blockly.fieldRegistry.register('field_steps', FieldSteps);
