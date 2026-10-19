/**
 * @file Clef's voice, using the browser's built-in speech synthesis.
 *
 * Our first learner is 6 and still learning to read, so every instruction is
 * spoken automatically. A recorded voice can replace this later without
 * changing any caller: only `speak()` needs to change.
 */

let enabled = true;
let voice = null;

/** Picks a friendly English voice once the browser has loaded its voice list. */
function pickVoice() {
  if (typeof speechSynthesis === 'undefined') return;
  const voices = speechSynthesis.getVoices();
  const preferred = ['Samantha', 'Karen', 'Moira', 'Google UK English Female', 'Google US English'];
  voice =
    preferred.map((name) => voices.find((v) => v.name === name)).find(Boolean) ??
    voices.find((v) => v.lang?.startsWith('en')) ??
    null;
}

if (typeof speechSynthesis !== 'undefined') {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

/**
 * Turns Clef's voice on or off.
 * @param {boolean} on - True to speak instructions aloud.
 */
export function setVoiceEnabled(on) {
  enabled = on;
  if (!on) stopSpeaking();
}

/**
 * Speaks a sentence aloud, interrupting anything Clef was already saying.
 * Emoji are removed first so they are not read out as words.
 * @param {string} text - What Clef should say.
 * @param {{onStart?: Function, onEnd?: Function}} [events] - Called when speech starts and ends.
 */
export function speak(text, { onStart, onEnd } = {}) {
  if (!enabled || typeof speechSynthesis === 'undefined' || !text) {
    onEnd?.();
    return;
  }
  speechSynthesis.cancel();
  const clean = text.replace(/\p{Extended_Pictographic}|️/gu, '').replace(/~/g, 'squiggle');
  const utterance = new SpeechSynthesisUtterance(clean);
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang ?? 'en-GB';
  utterance.rate = 0.92;
  utterance.pitch = 1.15;
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  speechSynthesis.speak(utterance);
}

/** Stops Clef mid-sentence. */
export function stopSpeaking() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}
