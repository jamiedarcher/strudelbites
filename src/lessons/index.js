/**
 * @file The lesson catalogue: two learning paths, in order.
 *
 * A lesson unlocks when the one before it in the same path is finished.
 * Entries with `comingSoon: true` show on the map but can't be opened yet;
 * their titles live in `en.json` like real lessons. To add a lesson, write a
 * file like `c1-make-a-sound.js`, import it here, and add its text to `en.json`.
 */
import c1 from './c1-make-a-sound.js';
import c2 from './c2-the-beat.js';
import c3 from './c3-rests.js';
import c4 from './c4-layers.js';
import t1 from './t1-meet-the-staff.js';
import t2 from './t2-long-and-short.js';

/** The two learning paths shown on the lesson map. */
export const PATHS = [
  {
    id: 'code',
    icon: '🥁',
    lessons: [
      c1,
      c2,
      c3,
      c4,
      { id: 'c5', path: 'code', icon: '🐇', comingSoon: true },
      { id: 'c6', path: 'code', icon: '🎹', comingSoon: true },
    ],
  },
  {
    id: 'theory',
    icon: '🎼',
    lessons: [
      t1,
      t2,
      { id: 't3', path: 'theory', icon: '👣', comingSoon: true },
      { id: 't4', path: 'theory', icon: '✂️', comingSoon: true },
      { id: 't5', path: 'theory', icon: '🪜', comingSoon: true },
      { id: 't6', path: 'theory', icon: '🌈', comingSoon: true },
    ],
  },
];

/**
 * Finds a lesson by id.
 * @param {string} id - Lesson id such as `"c2"`.
 * @returns {object|undefined}
 */
export function getLesson(id) {
  return PATHS.flatMap((p) => p.lessons).find((l) => l.id === id);
}

/**
 * Finds the next playable lesson in the same path.
 * @param {string} id - Current lesson id.
 * @returns {object|undefined} The next lesson, or undefined at the end of the path.
 */
export function nextLesson(id) {
  const path = PATHS.find((p) => p.lessons.some((l) => l.id === id));
  const index = path.lessons.findIndex((l) => l.id === id);
  const next = path.lessons[index + 1];
  return next && !next.comingSoon ? next : undefined;
}

/**
 * Whether a lesson is open to a player: the first lesson always is, the rest
 * once the previous lesson in the path is complete.
 * @param {object} lesson - The lesson.
 * @param {string[]} completed - Ids the player has finished.
 * @returns {boolean}
 */
export function isUnlocked(lesson, completed) {
  if (lesson.comingSoon) return false;
  const path = PATHS.find((p) => p.id === lesson.path);
  const index = path.lessons.indexOf(lesson);
  return index === 0 || completed.includes(path.lessons[index - 1].id);
}
