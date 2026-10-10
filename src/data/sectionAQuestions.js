/**
 * Section A Question Bank: Audio Quality Assessment
 *
 * Provides phonetic calibration word lists to read aloud and record,
 * verifying microphone frequency response, plosives, and sibilance.
 *
 * Official calibration word sets:
 * 1. "Salt, Vision, set, cloth, pause, freeze, tempting."
 * 2. "Talk, send, casual, kept, seen, wizard, leave."
 * 3. "Seem, walk, foresees, straw, beep, lazy, revision."
 * 4. "Action, raze, get, soft, blend, dozen, social."
 * 5. "Gone, keep, confusion, sheep, crazy, displeasure, seek."
 * 6. "Judge, capture, squeeze, whisper, motion, vanish, breeze."
 */

export const SECTION_A_QUESTION_BANK = [
  {
    id: 'sec_a_salt',
    wordsToRead: 'Salt, Vision, set, cloth, pause, freeze, tempting.',
    titleSnippet: 'Sibilants & Fricative Clarity Check',
    defectCategory: 'Sibilance & High-Frequency Clarity',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Salt, Vision, set, cloth, pause, freeze, tempting.',
    audioDescription: 'Severe harmonic distortion and clipping causing a robotic, garbled vocal effect.',
  },
  {
    id: 'sec_a_talk',
    wordsToRead: 'Talk, send, casual, kept, seen, wizard, leave.',
    titleSnippet: 'Plosives & Voiced Fricatives Check',
    defectCategory: 'Plosives, Voicing & Clipping Distortion',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Talk, send, casual, kept, seen, wizard, leave.',
    audioDescription: 'Persistent high-frequency analogue tape/preamp hiss throughout the entire sound track.',
  },
  {
    id: 'sec_a_seem',
    wordsToRead: 'Seem, walk, foresees, straw, beep, lazy, revision.',
    titleSnippet: 'Sibilant Clusters & Vowel Articulation',
    defectCategory: 'Consonant Clusters & Low-Frequency Hum',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Seem, walk, foresees, straw, beep, lazy, revision.',
    audioDescription: 'Continuous broadband static noise spanning the full audible frequency spectrum.',
  },
  {
    id: 'sec_a_action',
    wordsToRead: 'Action, raze, get, soft, blend, dozen, social.',
    titleSnippet: 'Affricates, Stop Consonants & Sibilants',
    defectCategory: 'Affricates & Ambient White Noise',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Action, raze, get, soft, blend, dozen, social.',
    audioDescription: 'Muffled resonance with severe high-frequency attenuation, making consonants sound blurred.',
  },
  {
    id: 'sec_a_gone',
    wordsToRead: 'Gone, keep, confusion, sheep, crazy, displeasure, seek.',
    titleSnippet: 'Velar Stops & Postalveolar Fricatives',
    defectCategory: 'Velar Stops & Background Hiss',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Gone, keep, confusion, sheep, crazy, displeasure, seek.',
    audioDescription: 'Low-frequency mains electrical hum combined with sporadic clicking and line interference.',
  },
  {
    id: 'sec_a_judge',
    wordsToRead: 'Judge, capture, squeeze, whisper, motion, vanish, breeze.',
    titleSnippet: 'Complex Consonants & Dynamic Range',
    defectCategory: 'Complex Consonants & Whisper Friction',
    instruction: 'Listen to the audio examples above carefully, then read the words given below in italics and say them out loud to record a sample audio.',
    promptToSpeak: 'Read the calibration words aloud: Judge, capture, squeeze, whisper, motion, vanish, breeze.',
    audioDescription: 'Intermittent line interference and muffled vocal artifacts.',
  },
];

/**
 * Generates an attempt of 5 Section A questions from the question bank.
 * Shuffles/randomizes the selection and order on every call, avoiding repeating
 * the exact same set and order from the immediately preceding attempt when possible.
 *
 * @param {string[]} previousQuestionIds - Array of question IDs or bankIds from preceding attempt
 * @returns {Array} Array of 5 formatted Section A question objects
 */
export function generateSectionAQuestions(previousQuestionIds = []) {
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  let pool = SECTION_A_QUESTION_BANK;
  if (previousQuestionIds && previousQuestionIds.length > 0) {
    const unused = SECTION_A_QUESTION_BANK.filter(
      (q) => !previousQuestionIds.includes(q.id)
    );
    if (unused.length > 0) {
      const remaining = SECTION_A_QUESTION_BANK.filter((q) => q.id !== unused[0].id);
      const shuffledRemaining = shuffle(remaining).slice(0, 4);
      pool = shuffle([unused[0], ...shuffledRemaining]);
    } else {
      pool = shuffle(SECTION_A_QUESTION_BANK).slice(0, 5);
    }
  } else {
    pool = shuffle(SECTION_A_QUESTION_BANK).slice(0, 5);
  }

  return pool.slice(0, 5).map((q, index) => ({
    id: index + 1,
    bankId: q.id,
    questionNumber: index + 1,
    title: `Question ${index + 1}: ${q.titleSnippet}`,
    defectCategory: q.defectCategory,
    wordsToRead: q.wordsToRead,
    instruction: q.instruction,
    promptToSpeak: q.promptToSpeak,
    audioDescription: q.audioDescription,
  }));
}

/**
 * Default fallback question set (for static imports)
 */
export const SECTION_A_QUESTIONS = generateSectionAQuestions([]);
