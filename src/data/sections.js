/**
 * Assessment Sections Data Definition
 * 
 * Defines the five assessment sections with exact question counts and durations:
 * - Section A: 5 Questions — 10 Minutes
 * - Section B: 18 Questions — 10 Minutes
 * - Section C: 3 Questions — 10 Minutes
 * - Section D: 34 Questions — 15 Minutes
 * - Section E: 12 Questions — 10 Minutes
 * 
 * Total Questions: 72
 * Total Duration: 55 Minutes
 */

export const ASSESSMENT_SECTIONS = [
  {
    id: 'section-a',
    code: 'A',
    name: 'Section A',
    title: 'Sentence Reading & Oral Fluency',
    questionCount: 5,
    durationMinutes: 10,
    durationSeconds: 600,
    description: 'Read sentences displayed on screen aloud clearly with natural rhythm, accurate pronunciation, and pacing.',
    skills: ['Pronunciation', 'Reading Fluency', 'Voice Modulation'],
    category: 'Reading Aloud',
    status: 'planned'
  },
  {
    id: 'section-b',
    code: 'B',
    name: 'Section B',
    title: 'Repeat Sentences',
    questionCount: 18,
    durationMinutes: 10,
    durationSeconds: 600,
    description: 'Listen carefully to recorded spoken sentences and repeat each sentence verbatim with accurate phrasing.',
    skills: ['Listening Comprehension', 'Sentence Recall', 'Intonation'],
    category: 'Listening & Repetition',
    status: 'planned'
  },
  {
    id: 'section-c',
    code: 'C',
    name: 'Section C',
    title: 'Speak for One Minute',
    questionCount: 3,
    durationMinutes: 10,
    durationSeconds: 600,
    description: 'Speak continuously for up to one minute on given topics after 30 seconds of preparation time.',
    skills: ['Spoken Fluency', 'Discourse Coherence', 'Vocabulary & Grammar'],
    category: 'Speaking Assessment',
    status: 'planned'
  },
  {
    id: 'section-d',
    code: 'D',
    name: 'Section D',
    title: 'Grammar & English Usage',
    questionCount: 34,
    durationMinutes: 15,
    durationSeconds: 900,
    description: 'Choose grammatically correct answers and best sentence corrections across verb forms, tenses, prepositions, and articles.',
    skills: ['Grammatical Accuracy', 'Sentence Correction', 'Syntactic Precision'],
    category: 'Grammar & Usage',
    status: 'planned'
  },
  {
    id: 'section-e',
    code: 'E',
    name: 'Section E',
    title: 'Listening Comprehension',
    questionCount: 12,
    durationMinutes: 10,
    durationSeconds: 600,
    description: 'Listen to short audio stories and answer factual comprehension multiple-choice questions to test listening retention and detail recall.',
    skills: ['Listening Retention', 'Auditory Recall', 'Comprehension Accuracy'],
    category: 'Listening Comprehension',
    status: 'available'
  }
];

export const ASSESSMENT_SUMMARY = {
  totalSections: ASSESSMENT_SECTIONS.length, // 5
  totalQuestions: ASSESSMENT_SECTIONS.reduce((acc, s) => acc + s.questionCount, 0), // 72
  totalMinutes: ASSESSMENT_SECTIONS.reduce((acc, s) => acc + s.durationMinutes, 0), // 55
  title: 'Voice Assessment Practice',
  subTitle: 'Personal Mock Test Portal'
};

export const getSectionById = (id) => {
  return ASSESSMENT_SECTIONS.find((s) => s.id === id || s.code.toLowerCase() === id.toLowerCase());
};
