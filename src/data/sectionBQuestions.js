/**
 * Section B Question Banks — Reading and Immediate Repetition
 * 
 * Part 1: Read Sentences Aloud (Questions 1–10) - 17 calibration sentences from user bank
 * Part 2: Listen Carefully and Say (Questions 11–18) - 17 calibration sentences from user bank
 *
 * Rotating logic:
 * - 10 questions picked dynamically from Part 1
 * - 8 questions picked dynamically from Part 2
 * - Consecutive attempts prioritize unused questions so questions rotate dynamically across tests.
 */

export const READ_PARAGRAPH_BANK = [
  {
    id: 'p1',
    text: 'Your nails are polished but your shoes are not. What a shane!',
    topic: 'Observation',
  },
  {
    id: 'p2',
    text: 'A small quantity of his liquid soap is sufficient.',
    topic: 'Daily Life',
  },
  {
    id: 'p3',
    text: 'The jars are on the shelf',
    topic: 'Household',
  },
  {
    id: 'p4',
    text: 'I bet she picked fresh bananas.',
    topic: 'Food',
  },
  {
    id: 'p5',
    text: 'He ripped the pages off his English book.',
    topic: 'Education',
  },
  {
    id: 'p6',
    text: 'Daisy’s frequent shopping hauls cause her husband some displeasure',
    topic: 'Lifestyle',
  },
  {
    id: 'p7',
    text: 'Sally had laid out an enviable spread of brisket, caviar and exotic salads at the luncheon.',
    topic: 'Dining',
  },
  {
    id: 'p8',
    text: 'The pageant winners oozed charisma and elegance having undergone rigorous training.',
    topic: 'Performance',
  },
  {
    id: 'p9',
    text: 'Excuse me, may I have some chicken soup please ?',
    topic: 'Dining',
  },
  {
    id: 'p10',
    text: 'The sack of potatoes is in the drawer',
    topic: 'Kitchen',
  },
  {
    id: 'p11',
    text: '“The Vegabond steak House” is an incredible restaurant on wheels',
    topic: 'Food & Travel',
  },
  {
    id: 'p12',
    text: 'Continue saying yes but remember, honesty and hard work will never cease to prevall',
    topic: 'Values',
  },
  {
    id: 'p13',
    text: 'Bill was shrewd yet enterprising business man who lost his shop in a blizzard.',
    topic: 'Narrative',
  },
  {
    id: 'p14',
    text: 'She is a patient of schizophrenia, which causes hallucinations and disables speech.',
    topic: 'Health',
  },
  {
    id: 'p15',
    text: 'Pizza, blue skies and a quiet beach! Thank goodness I can relax here-otherwise, the work would have driven me crazy!',
    topic: 'Leisure',
  },
  {
    id: 'p16',
    text: 'It is becoming increasingly important to have a ubiquitous presence on social media!',
    topic: 'Technology',
  },
  {
    id: 'p17',
    text: 'Have you heard of shadowboxing? It is a technique used in combat sports. It prepares your muscles for intense physical activity, tones them, and aids weight loss as well',
    topic: 'Sports & Fitness',
  },
];

export const LISTEN_SENTENCE_BANK = [
  {
    id: 's1',
    text: 'I was awestruck by his shiny green green cell phone.',
    difficulty: 'Conversational',
  },
  {
    id: 's2',
    text: 'Pay for the vegetables in cash',
    difficulty: 'Basic',
  },
  {
    id: 's3',
    text: 'Jack ate Chinese food as usual',
    difficulty: 'Basic',
  },
  {
    id: 's4',
    text: 'After his embarrassing performance, the player was received with anger.',
    difficulty: 'Intermediate',
  },
  {
    id: 's5',
    text: 'Can you write an essay on your recent excursion?',
    difficulty: 'Conversational',
  },
  {
    id: 's6',
    text: 'They asked if I was frightened by the storm.',
    difficulty: 'Conversational',
  },
  {
    id: 's7',
    text: 'I am afraid you are making silly excuses',
    difficulty: 'Basic',
  },
  {
    id: 's8',
    text: 'Take measures to store the pickle in dry conditions.',
    difficulty: 'Intermediate',
  },
  {
    id: 's9',
    text: 'Peter encountered a vehement oppositions to his proposal.',
    difficulty: 'Advanced',
  },
  {
    id: 's10',
    text: 'As usual, the commission has devised some great schemes.',
    difficulty: 'Intermediate',
  },
  {
    id: 's11',
    text: 'The doctor explained that my nausea was attributed to excessive latent stress.',
    difficulty: 'Advanced',
  },
  {
    id: 's12',
    text: 'She thinks her cryptic responses are enigmatic, which I find utterly amusing.',
    difficulty: 'Advanced',
  },
  {
    id: 's13',
    text: 'Despite their efforts to appease him, the chieftain decide to ostracize the brothers',
    difficulty: 'Advanced',
  },
  {
    id: 's14',
    text: 'Our estimate is that the population explosion is twice of what it was in the past decade.',
    difficulty: 'Intermediate',
  },
  {
    id: 's15',
    text: 'I must be cautious during travel. I tend to have seizures if I get fatigued',
    difficulty: 'Intermediate',
  },
  {
    id: 's16',
    text: 'She lives in a shady establishment full of seemingly conniving spiders.',
    difficulty: 'Advanced',
  },
  {
    id: 's17',
    text: 'His inspiring speech and humble demeanor  convinced me that he was a trailblazer',
    difficulty: 'Intermediate',
  },
];

/**
 * Generate 18 Section B Questions:
 * - Questions 1–10: Read Sentence/Paragraph Aloud (picked dynamically from READ_PARAGRAPH_BANK)
 * - Questions 11–18: Listen Carefully and Say (picked dynamically from LISTEN_SENTENCE_BANK)
 * Dynamically avoids repeating items from `previousQuestionIds` when possible so questions rotate each test.
 */
export function generateSectionBQuestions(previousQuestionIds = []) {
  // Shuffle array helper
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // 1. Pick 10 Paragraphs from the 17 items (prioritizing previously unused)
  const unusedParagraphs = READ_PARAGRAPH_BANK.filter((p) => !previousQuestionIds.includes(p.id));
  let selectedParagraphs = [];
  if (unusedParagraphs.length >= 10) {
    selectedParagraphs = shuffle(unusedParagraphs).slice(0, 10);
  } else {
    const usedParagraphs = READ_PARAGRAPH_BANK.filter((p) => previousQuestionIds.includes(p.id));
    selectedParagraphs = [
      ...shuffle(unusedParagraphs),
      ...shuffle(usedParagraphs).slice(0, 10 - unusedParagraphs.length),
    ];
  }
  selectedParagraphs = shuffle(selectedParagraphs);

  // 2. Pick 8 Sentences from the 17 items (prioritizing previously unused)
  const unusedSentences = LISTEN_SENTENCE_BANK.filter((s) => !previousQuestionIds.includes(s.id));
  let selectedSentences = [];
  if (unusedSentences.length >= 8) {
    selectedSentences = shuffle(unusedSentences).slice(0, 8);
  } else {
    const usedSentences = LISTEN_SENTENCE_BANK.filter((s) => previousQuestionIds.includes(s.id));
    selectedSentences = [
      ...shuffle(unusedSentences),
      ...shuffle(usedSentences).slice(0, 8 - unusedSentences.length),
    ];
  }
  selectedSentences = shuffle(selectedSentences);

  const questions = [];

  // Questions 1–10: Read Paragraph
  selectedParagraphs.forEach((p, idx) => {
    questions.push({
      id: idx + 1,
      bankId: p.id,
      sourceId: p.id,
      questionNumber: idx + 1,
      type: 'read_paragraph',
      typeLabel: 'Read Paragraph',
      instruction: 'Read the sentence given below and say it out loud.',
      content: p.text,
      maxRecordingSeconds: 15,
      attemptsAllowed: 1,
    });
  });

  // Questions 11–18: Listen Carefully and Say
  selectedSentences.forEach((s, idx) => {
    const qNum = 11 + idx;
    questions.push({
      id: qNum,
      bankId: s.id,
      sourceId: s.id,
      questionNumber: qNum,
      type: 'listen_and_say',
      typeLabel: 'Listen Carefully and Say',
      instruction: 'Listen carefully to the audio and repeat the sentence out loud.',
      content: s.text,
      maxRecordingSeconds: 15,
      attemptsAllowed: 1,
    });
  });

  return questions;
}
