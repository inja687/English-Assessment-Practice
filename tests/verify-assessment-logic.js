/**
 * Automated Verification Test Suite for Assessment Logic
 * Tests:
 * 1. Question randomization & correct-answer preservation
 * 2. Section D 34-question generation & answer keys
 * 3. Section E 12-question generation & story linking
 * 4. Section B 18-question structure (10 paragraphs, 8 sentences)
 * 5. Section C 3-topic generation from 8-topic bank
 * 6. Objective scoring calculation & accuracy
 * 7. Storage performance analytics & empty-state resiliency
 */

import fs from 'fs';
import { generateSectionDQuestions, GRAMMAR_QUESTION_BANK } from '../src/data/sectionDQuestions.js';
import { generateSectionEQuestions, LISTENING_STORY_BANK } from '../src/data/sectionEStories.js';
import { generateSectionBQuestions, READ_PARAGRAPH_BANK, LISTEN_SENTENCE_BANK } from '../src/data/sectionBQuestions.js';
import { generateSectionCQuestions, SPEAKING_TOPIC_BANK } from '../src/data/sectionCQuestions.js';
import { generateSectionAQuestions, SECTION_A_QUESTION_BANK } from '../src/data/sectionAQuestions.js';
import { 
  calculatePerformanceAnalytics, 
  DEFAULT_PRACTICE_TARGET,
  saveAttempt,
  isSectionUnlocked,
  markSectionCompleted,
  getCompletedSections,
  getPrecedingSection,
  getLatestUnlockedSection,
  resetSectionLocking,
  getFullAssessmentReport
} from '../src/utils/storage.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('\n--- Running Assessment Practice Portal Automated Test Suite ---\n');

// -----------------------------------------------------------------------------
// Test Suite 1: Section D Grammar & English Usage (34 Questions)
// -----------------------------------------------------------------------------
console.log('1. Testing Section D Generation & Answer Integrity:');

assert(GRAMMAR_QUESTION_BANK.length === 109, `Grammar question bank contains all 109 authentic questions (${GRAMMAR_QUESTION_BANK.length} === 109)`);

// Verify all bank questions have valid schema
let allBankQuestionsValid = true;
GRAMMAR_QUESTION_BANK.forEach((q) => {
  if (!q.id || !q.prompt || !Array.isArray(q.options) || q.options.length !== 4 || !q.options.includes(q.correctAnswer) || !q.explanation) {
    allBankQuestionsValid = false;
  }
});
assert(allBankQuestionsValid, 'All 109 questions in GRAMMAR_QUESTION_BANK have 4 options, valid correctAnswer, and explanations');

// Check user specific questions across categories
const hasBettyQuestion = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('Betty') && q.correctAnswer === 'cycles');
const hasEngineerQuestion = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('engineer') && q.correctAnswer === 'Are');
const hasOneOfBags = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('One of the bags') && q.correctAnswer === 'is');
const hasMeasles = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('Measles') && q.correctAnswer === 'is');

const hasLastEvening = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('Last evening') && q.correctAnswer === 'entered');
const hasHadIKnown = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('live in Japan') && q.correctAnswer === 'Had, known');
const hasLoudMusic = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('loud music') && q.correctAnswer === 'has been playing, will go');

const hasMarketArticle = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('market is closed') && q.correctAnswer === 'The');
const hasHonorArticle = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('honor') && q.correctAnswer === 'an');
const hasImmemorial = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('time immemorial') && q.correctAnswer === 'no article, no article');

const hasSwitchFan = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('switch the fan') && q.correctAnswer === 'off');
const hasAtSea = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('sailor') && q.correctAnswer === 'at');
const hasBesidesYou = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('who else has been invited') && q.correctAnswer === 'Besides');
const hasBenefitOfDoubt = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('benefit') && q.correctAnswer === 'of, by');

const hasWeSawMovieVoice = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('We saw a movie') && q.correctAnswer === 'A movie was seen by us.');
const hasOldClothesVoice = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('The old clothes were donated') && q.correctAnswer === 'They donated the old clothes yesterday.');
const hasComputerVoice = GRAMMAR_QUESTION_BANK.some((q) => q.prompt.includes('My computer is being sent') && q.correctAnswer === 'They are sending my computer for repair.');

const hasGoPlacesSentence = GRAMMAR_QUESTION_BANK.some((q) => q.correctAnswer && q.correctAnswer.includes('go places'));
const hasSelenophileSentence = GRAMMAR_QUESTION_BANK.some((q) => q.correctAnswer && q.correctAnswer.includes('selenophile'));

assert(hasBettyQuestion && hasEngineerQuestion && hasOneOfBags && hasMeasles, 'Bank contains user Verb Forms & Subject-Verb Agreement questions');
assert(hasLastEvening && hasHadIKnown && hasLoudMusic, 'Bank contains user Tenses questions');
assert(hasMarketArticle && hasHonorArticle && hasImmemorial, 'Bank contains user Articles questions');
assert(hasSwitchFan && hasAtSea && hasBesidesYou && hasBenefitOfDoubt, 'Bank contains user Prepositions questions');
assert(hasWeSawMovieVoice && hasOldClothesVoice && hasComputerVoice, 'Bank contains user Active & Passive Voice questions');
assert(hasGoPlacesSentence && hasSelenophileSentence, 'Bank contains user Panel 6 Sentence Identification questions');

const dAttempt1 = generateSectionDQuestions([]);
assert(dAttempt1.length === 34, `Generates exactly 34 questions (received ${dAttempt1.length})`);

// Verify strict sequential ordering (Verb -> Tense -> Article -> Preposition -> Voice -> Sentence Selection)
const isPart1Verbs = dAttempt1.slice(0, 7).every((q) => q.partNumber === 1 && q.category === 'Verb Forms & Subject–Verb Agreement');
const isPart2Tenses = dAttempt1.slice(7, 14).every((q) => q.partNumber === 2 && q.category === 'Tenses');
const isPart3Articles = dAttempt1.slice(14, 19).every((q) => q.partNumber === 3 && q.category === 'Articles');
const isPart4Prepositions = dAttempt1.slice(19, 24).every((q) => q.partNumber === 4 && q.category === 'Prepositions');
const isPart5Voice = dAttempt1.slice(24, 29).every((q) => q.partNumber === 5 && q.category === 'Active & Passive Voice');
const isPart6Sentences = dAttempt1.slice(29, 34).every((q) => q.partNumber === 6);

assert(isPart1Verbs, 'Q1-Q7 are strictly Verb Forms & Subject-Verb Agreement (Part 1)');
assert(isPart2Tenses, 'Q8-Q14 are strictly Tenses (Part 2)');
assert(isPart3Articles, 'Q15-Q19 are strictly Articles (Part 3)');
assert(isPart4Prepositions, 'Q20-Q24 are strictly Prepositions (Part 4)');
assert(isPart5Voice, 'Q25-Q29 are strictly Active & Passive Voice (Part 5)');
assert(isPart6Sentences, 'Q30-Q34 are strictly Identify the Grammatically Correct Sentence (Part 6)');

// Verify all 34 questions have valid options and preserved correct answers
let allOptionsHaveCorrectAnswer = true;
let allHaveExplanations = true;
let allUniqueBankIds = true;
const bankIdsSeen = new Set();

dAttempt1.forEach((q) => {
  if (!q.options.includes(q.correctAnswer)) {
    allOptionsHaveCorrectAnswer = false;
  }
  if (!q.explanation || q.explanation.trim().length === 0) {
    allHaveExplanations = false;
  }
  if (bankIdsSeen.has(q.bankId)) {
    allUniqueBankIds = false;
  }
  bankIdsSeen.add(q.bankId);
});

assert(allOptionsHaveCorrectAnswer, 'Randomized answer options preserve the correct answer for all 34 questions');
assert(allHaveExplanations, 'Every question contains an explanatory rationale');
assert(allUniqueBankIds, 'No duplicate questions within the same 34-question attempt');

// Retake randomization
const prevIds = dAttempt1.map((q) => q.bankId);
const dAttempt2 = generateSectionDQuestions(prevIds);
assert(dAttempt2.length === 34, 'Retake generates 34 questions');
const overlap = dAttempt2.filter((q) => prevIds.includes(q.bankId));
assert(overlap.length < 34, `Retake attempts to sample different questions (overlap ${overlap.length} of 34)`);
const retakeOrdered = dAttempt2.slice(0, 7).every((q) => q.partNumber === 1) &&
  dAttempt2.slice(7, 14).every((q) => q.partNumber === 2) &&
  dAttempt2.slice(14, 19).every((q) => q.partNumber === 3) &&
  dAttempt2.slice(19, 24).every((q) => q.partNumber === 4) &&
  dAttempt2.slice(24, 29).every((q) => q.partNumber === 5) &&
  dAttempt2.slice(29, 34).every((q) => q.partNumber === 6);
assert(retakeOrdered, 'Retake strictly maintains sequential category order Q1-Q34');

// -----------------------------------------------------------------------------
// Test Suite 2: Section E Listening Comprehension (12 Questions = 4 Stories + 8 MCQs)
// -----------------------------------------------------------------------------
console.log('\n2. Testing Section E Listening Stories & MCQ Mapping:');

assert(LISTENING_STORY_BANK.length === 8, `Listening story bank contains all 8 authentic stories (${LISTENING_STORY_BANK.length} === 8)`);

// Verify all 8 stories have script, category, and 3 valid questions
let allStoriesValid = true;
LISTENING_STORY_BANK.forEach((s) => {
  if (!s.id || !s.title || !s.script || !Array.isArray(s.questions) || s.questions.length !== 3) {
    allStoriesValid = false;
  }
  s.questions.forEach((q) => {
    if (!q.id || !q.prompt || !Array.isArray(q.options) || q.options.length !== 4 || !q.options.includes(q.correctAnswer) || !q.explanation) {
      allStoriesValid = false;
    }
  });
});
assert(allStoriesValid, 'All 8 listening stories contain full scripts and 3 MCQs with 4 options, valid correctAnswer, and explanations');

// Check presence of user specific stories
const hasMikeStory = LISTENING_STORY_BANK.some((s) => s.script.includes('Mike was a bodybuilder') && s.questions.some((q) => q.correctAnswer === 'Blue'));
const hasPetraStory = LISTENING_STORY_BANK.some((s) => s.script.includes('Petra was a renowned storyteller') && s.questions.some((q) => q.prompt.includes('Petra’s book')));
const hasDavidStory = LISTENING_STORY_BANK.some((s) => s.script.includes('David Saldanha') && s.questions.some((q) => q.correctAnswer === 'David had a rags-to-riches story'));
const hasJasonStory = LISTENING_STORY_BANK.some((s) => s.script.includes('Jason is a doctor') && s.questions.some((q) => q.correctAnswer === 'In Paris'));
const hasRubyStory = LISTENING_STORY_BANK.some((s) => s.script.includes('Booknook') && s.questions.some((q) => q.correctAnswer === 'Booknook'));
const hasLindaStory = LISTENING_STORY_BANK.some((s) => s.script.includes('epileptic') && s.questions.some((q) => q.correctAnswer === 'Like pies fresh from the oven'));
const hasApartmentStory = LISTENING_STORY_BANK.some((s) => s.script.includes('bank is far away') && s.questions.some((q) => q.correctAnswer === 'Because their bank is far away'));
const hasGamificationStory = LISTENING_STORY_BANK.some((s) => s.script.includes('gamifies learning') && s.questions.some((q) => q.prompt.includes('core drivers')));

assert(hasMikeStory, 'Bank includes Story 1: Mike the Bodybuilder (1985 Chicago Championship, blue color)');
assert(hasPetraStory, 'Bank includes Story 2: Petra the Storyteller (seniors over 70, journeys book)');
assert(hasDavidStory, 'Bank includes Story 3: David Saldanha / Journalist Idol (street urchins, rags to riches)');
assert(hasJasonStory, 'Bank includes Story 4: Jason the Doctor (relocated to Paris, flourishing hospitals)');
assert(hasRubyStory, 'Bank includes Story 5: Ruby’s Bookstore Booknook (coffee shop inside, borrow coffee table books)');
assert(hasLindaStory, 'Bank includes Story 6: Linda’s Backpacking Journey (helping others, epilepsy, pies fresh from the oven)');
assert(hasApartmentStory, 'Bank includes Story 7: Moving to New Apartment (market, dog park, works from home, bank far away)');
assert(hasGamificationStory, 'Bank includes Story 8: Gamification Training Programme (core drivers: accomplishment, ownership)');

const eAttempt1 = generateSectionEQuestions([]);
assert(eAttempt1.stories.length === 4, `Selects exactly 4 stories (received ${eAttempt1.stories.length})`);
assert(eAttempt1.questions.length === 12, `Generates exactly 12 numbered items (received ${eAttempt1.questions.length})`);

// Verify 4 playback tasks and 8 comprehension MCQs
const storyTasks = eAttempt1.questions.filter((q) => q.type === 'story_playback');
const mcqTasks = eAttempt1.questions.filter((q) => q.type === 'comprehension_mcq');

assert(storyTasks.length === 4, `Exactly 4 story listening playback tasks (Q1, Q4, Q7, Q10)`);
assert(mcqTasks.length === 8, `Exactly 8 comprehension multiple-choice questions`);

let eOptionsValid = true;
mcqTasks.forEach((q) => {
  if (!q.options.includes(q.correctAnswer)) {
    eOptionsValid = false;
  }
});
assert(eOptionsValid, 'Section E MCQs preserve the correct answer in randomized options');

// Retake rotation: tests the other 4 stories with 0 overlap
const prevStoryIds = eAttempt1.stories.map((s) => s.id);
const eAttempt2 = generateSectionEQuestions(prevStoryIds);
assert(eAttempt2.stories.length === 4, 'Retake selects 4 stories');
const storyOverlap = eAttempt2.stories.filter((s) => prevStoryIds.includes(s.id));
assert(storyOverlap.length === 0, `Retake selects completely different stories from 8-story bank (overlap ${storyOverlap.length} of 4)`);

// -----------------------------------------------------------------------------
// Test Suite 3: Section B Reading and Listening (18 Questions)
// -----------------------------------------------------------------------------
console.log('\n3. Testing Section B Question Structure:');

assert(READ_PARAGRAPH_BANK.length === 17, `Read paragraph bank contains exactly 17 user sentences (${READ_PARAGRAPH_BANK.length} === 17)`);
assert(LISTEN_SENTENCE_BANK.length === 17, `Listen & say bank contains exactly 17 user sentences (${LISTEN_SENTENCE_BANK.length} === 17)`);

// Check required user sentences in Part 1
const hasShameSentence = READ_PARAGRAPH_BANK.some((p) => p.text.includes('Your nails are polished'));
const hasShadowboxingSentence = READ_PARAGRAPH_BANK.some((p) => p.text.includes('shadowboxing'));
assert(hasShameSentence, 'Part 1 bank includes user sentence "Your nails are polished..."');
assert(hasShadowboxingSentence, 'Part 1 bank includes user sentence "Have you heard of shadowboxing..."');

// Check required user sentences in Part 2
const hasAwestruckSentence = LISTEN_SENTENCE_BANK.some((s) => s.text.includes('shiny green green cell phone'));
const hasTrailblazerSentence = LISTEN_SENTENCE_BANK.some((s) => s.text.includes('trailblazer'));
assert(hasAwestruckSentence, 'Part 2 bank includes user sentence "I was awestruck by his shiny green green cell phone."');
assert(hasTrailblazerSentence, 'Part 2 bank includes user sentence "His inspiring speech... trailblazer"');

const bQuestions = generateSectionBQuestions([]);
assert(bQuestions.length === 18, `Generates exactly 18 questions (received ${bQuestions.length})`);

const readParagraphs = bQuestions.slice(0, 10);
const listenSay = bQuestions.slice(10, 18);

const allReadParagraphType = readParagraphs.every((q) => q.type === 'read_paragraph' && q.maxRecordingSeconds === 15);
const allListenSayType = listenSay.every((q) => q.type === 'listen_and_say' && q.maxRecordingSeconds === 15);

assert(allReadParagraphType, 'Questions 1–10 are Read Paragraph with 15s recording limit');
assert(allListenSayType, 'Questions 11–18 are Listen Carefully and Say with 15s recording limit');

// Test dynamic rotation on retake (subsequent attempt)
const prevBankIds = bQuestions.map((q) => q.bankId);
const bQuestionsRetake = generateSectionBQuestions(prevBankIds);
assert(bQuestionsRetake.length === 18, 'Subsequent Section B attempt generates 18 questions');
const retakeBankIds = bQuestionsRetake.map((q) => q.bankId);
const retakeReadIds = retakeBankIds.slice(0, 10);
const prevReadIds = prevBankIds.slice(0, 10);
// In a bank of 17 where 10 were used, at least the 7 unused items should be picked
const overlapRead = retakeReadIds.filter((id) => prevReadIds.includes(id));
assert(overlapRead.length <= 3, `Dynamic rotation prioritizes unused items (overlap ${overlapRead.length} <= 3 out of 10)`);

// -----------------------------------------------------------------------------
// Test Suite 4: Section C Speaking (3 Topics)
// -----------------------------------------------------------------------------
console.log('\n4. Testing Section C Topic Selection:');

assert(SPEAKING_TOPIC_BANK.length === 13, `Speaking topic bank contains all 13 calibration topics (${SPEAKING_TOPIC_BANK.length} === 13)`);

// Verify required user topics are present
const hasWeather = SPEAKING_TOPIC_BANK.some((t) => t.prompt.includes('type of weather'));
const hasSkill = SPEAKING_TOPIC_BANK.some((t) => t.prompt.includes('skill or talent'));
const hasRisk = SPEAKING_TOPIC_BANK.some((t) => t.prompt.includes('took a risk and paid off'));
const movieTopic = SPEAKING_TOPIC_BANK.find((t) => t.prompt.includes('best Movie'));
const placeTopic = SPEAKING_TOPIC_BANK.find((t) => t.prompt.includes('Recently visit Place'));
const cartoonTopic = SPEAKING_TOPIC_BANK.find((t) => t.prompt.includes('Childhood favourite cartoon'));

assert(hasWeather, 'Topic bank includes "Talk about the type of weather you enjoy"');
assert(hasSkill, 'Topic bank includes "Talk about a skill or talent that you possess."');
assert(hasRisk, 'Topic bank includes "Describe a time when you took a risk and paid off."');
assert(Boolean(movieTopic && movieTopic.bulletPrompts?.length >= 3), 'Movie topic includes sub-cues/bullet prompts');
assert(Boolean(placeTopic && placeTopic.bulletPrompts?.length >= 3), 'Recently visited place topic includes sub-cues/bullet prompts');
assert(Boolean(cartoonTopic && cartoonTopic.bulletPrompts?.length >= 3), 'Cartoon topic includes sub-cues/bullet prompts');

const cQuestions = generateSectionCQuestions([]);
assert(cQuestions.length === 3, `Generates exactly 3 topics (received ${cQuestions.length})`);
const uniqueTopicIds = new Set(cQuestions.map((q) => q.topicId));
assert(uniqueTopicIds.size === 3, 'All 3 topics are distinct within the attempt');

// Verify retake rotates dynamically with no overlap
const usedCIds = cQuestions.map((q) => q.topicId);
const cRetake = generateSectionCQuestions(usedCIds);
assert(cRetake.length === 3, 'Subsequent Section C attempt generates 3 topics');
const cRetakeOverlap = cRetake.filter((q) => usedCIds.includes(q.topicId));
assert(cRetakeOverlap.length === 0, 'Subsequent attempt dynamically samples completely different topics (0 overlap out of 3)');

// -----------------------------------------------------------------------------
// Test Suite 4b: Section A Audio Quality & Calibration Word Sets
// -----------------------------------------------------------------------------
console.log('\n4b. Testing Section A Calibration Bank & Shuffling:');

assert(SECTION_A_QUESTION_BANK.length >= 5, `Section A bank contains calibration questions (${SECTION_A_QUESTION_BANK.length} >= 5)`);

const aAttempt1 = generateSectionAQuestions([]);
assert(aAttempt1.length === 5, `Generates exactly 5 questions for Section A (received ${aAttempt1.length})`);

const requiredPhrases = [
  'Salt, Vision, set, cloth, pause, freeze, tempting.',
  'Talk, send, casual, kept, seen, wizard, leave.',
  'Seem, walk, foresees, straw, beep, lazy, revision.',
  'Action, raze, get, soft, blend, dozen, social.',
  'Gone, keep, confusion, sheep, crazy, displeasure, seek.',
];

const bankPhrases = SECTION_A_QUESTION_BANK.map((q) => q.wordsToRead);
const allRequiredPresent = requiredPhrases.every((p) => bankPhrases.includes(p));
assert(allRequiredPresent, 'Section A bank contains all 5 required user calibration word sets');

const bankIdsA1 = aAttempt1.map((q) => q.bankId);
const aAttempt2 = generateSectionAQuestions(bankIdsA1);
assert(aAttempt2.length === 5, 'Generates 5 questions on subsequent attempt');
assert(aAttempt1.every((q) => Boolean(q.wordsToRead)), 'Every Section A question contains non-empty wordsToRead');

// -----------------------------------------------------------------------------
// Test Suite 5: Objective Scoring Engine
// -----------------------------------------------------------------------------
console.log('\n5. Testing Scoring Calculations:');

// Simulate Section D scoring
const sampleAnswers = {};
let simulatedCorrect = 0;
dAttempt1.forEach((q, idx) => {
  if (idx < 25) {
    // 25 correct answers
    sampleAnswers[q.id] = q.correctAnswer;
    simulatedCorrect++;
  } else if (idx < 30) {
    // 5 wrong answers
    const wrong = q.options.find((opt) => opt !== q.correctAnswer) || 'wrong';
    sampleAnswers[q.id] = wrong;
  }
  // Remaining 4 are unanswered
});

let calculatedCorrect = 0;
let calculatedIncorrect = 0;
let calculatedUnanswered = 0;

dAttempt1.forEach((q) => {
  const ans = sampleAnswers[q.id];
  if (ans === undefined) {
    calculatedUnanswered++;
  } else if (ans === q.correctAnswer) {
    calculatedCorrect++;
  } else {
    calculatedIncorrect++;
  }
});

const calculatedPercent = Math.round((calculatedCorrect / dAttempt1.length) * 100);
assert(calculatedCorrect === simulatedCorrect, `Calculated correct matches simulated count (${calculatedCorrect} === ${simulatedCorrect})`);
assert(calculatedCorrect === 25, `Correct count is accurate (25 of 34)`);
assert(calculatedIncorrect === 5, `Incorrect count is accurate (5 of 34)`);
assert(calculatedUnanswered === 4, `Unanswered count is accurate (4 of 34)`);
assert(calculatedPercent === 74, `Percentage score calculates to 74% (25/34)`);
assert(calculatedPercent >= DEFAULT_PRACTICE_TARGET, `Correctly identifies target met (${calculatedPercent}% >= ${DEFAULT_PRACTICE_TARGET}%)`);

// -----------------------------------------------------------------------------
// Test Suite 6: Performance Analytics & Empty State Resiliency
// -----------------------------------------------------------------------------
console.log('\n6. Testing Cross-Section Analytics & Storage Resiliency:');

// Test empty state
const emptyAnalytics = calculatePerformanceAnalytics([]);
assert(emptyAnalytics.totalAttempts === 0, 'Empty attempts array yields 0 total attempts');
assert(emptyAnalytics.overallMCQAnswered === 0, 'Empty attempts array yields 0 MCQs answered');
assert(emptyAnalytics.latestAttemptDate === null, 'Empty attempts array yields null latest attempt date');

// Test populated state
const sampleAttempts = [
  {
    id: 'att_1',
    sectionId: 'section-d',
    sectionName: 'Section D',
    submittedAt: '2026-10-09T18:00:00.000Z',
    isObjective: true,
    attemptedCount: 30,
    totalQuestions: 34,
    correctCount: 25,
    incorrectCount: 5,
    scorePercent: 74,
    categoryPerformance: {
      'Tenses': { total: 4, correct: 3, accuracy: 75 },
      'Prepositions': { total: 4, correct: 2, accuracy: 50 },
    },
  },
  {
    id: 'att_2',
    sectionId: 'section-e',
    sectionName: 'Section E',
    submittedAt: '2026-10-09T18:30:00.000Z',
    isObjective: true,
    attemptedCount: 8,
    totalQuestions: 12,
    correctCount: 6,
    incorrectCount: 2,
    scorePercent: 75,
    storiesPlayedCount: 4,
  },
  {
    id: 'att_3',
    sectionId: 'section-a',
    sectionName: 'Section A',
    submittedAt: '2026-10-09T19:00:00.000Z',
    isObjective: false,
    attemptedCount: 5,
    totalQuestions: 5,
  },
];

const populatedAnalytics = calculatePerformanceAnalytics(sampleAttempts);
assert(populatedAnalytics.totalAttempts === 3, 'Calculates 3 total attempts');
assert(populatedAnalytics.overallMCQAnswered === 38, `Calculates 38 total MCQs answered (30 + 8)`);
assert(populatedAnalytics.overallMCQCorrect === 31, `Calculates 31 total MCQs correct (25 + 6)`);
assert(populatedAnalytics.overallMCQAccuracy === 82, `Calculates overall MCQ accuracy as 82% (31/38)`);
assert(populatedAnalytics.recentBySection['section-d'].id === 'att_1', 'Tracks most recent Section D attempt');
assert(populatedAnalytics.recentBySection['section-e'].id === 'att_2', 'Tracks most recent Section E attempt');
assert(populatedAnalytics.recentBySection['section-a'].id === 'att_3', 'Tracks most recent Section A attempt');
assert(populatedAnalytics.recentBySection['section-b'] === null, 'Correctly reports null for unattempted Section B');

// Test Suite 6b: Full Assessment Report & Mistake Diagnostics
console.log('\n6b. Testing Full Assessment Comprehensive Report & Mistake Analysis:');
const fullReport = getFullAssessmentReport(sampleAttempts);
assert(fullReport.sectionsReport.length === 5, 'Generates 5 section report items (A to E)');
assert(fullReport.sectionsReport.find((s) => s.id === 'section-d').percent === 74, 'Section D reports 74% score');
assert(fullReport.sectionsReport.find((s) => s.id === 'section-e').percent === 75, 'Section E reports 75% score');
assert(fullReport.sectionsReport.find((s) => s.id === 'section-a').percent === 100, 'Section A reports 100% completion');
assert(fullReport.sectionsReport.find((s) => s.id === 'section-b').percent === null, 'Unattempted Section B reports null percent');
assert(Array.isArray(fullReport.allMistakes), 'Collects mistakes array across objective sections');
assert(fullReport.totalCompletedSections === 3, 'Tracks 3 completed sections out of 5');
assert(fullReport.isFullTestComplete === false, 'Correctly flags full test as not complete when Section B is missing');

// -----------------------------------------------------------------------------
// Test Suite 7: Strict Sequential Section Locking
// -----------------------------------------------------------------------------
console.log('\n7. Testing Strict Sequential Section Locking:');

// Reset to clean test state
resetSectionLocking();

assert(isSectionUnlocked('section-a') === true, 'Section A is always available first');
assert(isSectionUnlocked('section-b') === false, 'Section B is locked before Section A completion');
assert(isSectionUnlocked('section-c') === false, 'Section C is initially locked');
assert(isSectionUnlocked('section-d') === false, 'Section D is initially locked');
assert(isSectionUnlocked('section-e') === false, 'Section E is initially locked');

const precB = getPrecedingSection('section-b');
assert(precB && precB.id === 'section-a', 'Identifies Section A as preceding section for Section B');
assert(getLatestUnlockedSection() === 'section-a', 'Initial latest unlocked section is Section A');

// Simulate Section A completion
markSectionCompleted('section-a');
assert(getCompletedSections().includes('section-a') === true, 'Completed sections list includes Section A');
assert(isSectionUnlocked('section-b') === true, 'Finishing Section A unlocks Section B');
assert(isSectionUnlocked('section-c') === false, 'Section C remains locked until Section B is complete');
assert(getLatestUnlockedSection() === 'section-b', 'Latest unlocked section advances to Section B');

// Simulate Section B completion
markSectionCompleted('section-b');
assert(isSectionUnlocked('section-c') === true, 'Finishing Section B unlocks Section C');

// Simulate Section C completion
markSectionCompleted('section-c');
assert(isSectionUnlocked('section-d') === true, 'Finishing Section C unlocks Section D');

// Simulate Section D completion
markSectionCompleted('section-d');
assert(isSectionUnlocked('section-e') === true, 'Finishing Section D unlocks Section E');
assert(getLatestUnlockedSection() === 'section-e', 'Latest unlocked section advances to Section E');

// Reset and test auto-unlock via saveAttempt
resetSectionLocking();
assert(isSectionUnlocked('section-b') === false, 'Section B is re-locked after reset');
saveAttempt({
  id: 'test_sec_a_save',
  sectionId: 'section-a',
  sectionName: 'Section A — Audio Quality Assessment',
  totalQuestions: 5,
  attemptedCount: 5,
});
assert(isSectionUnlocked('section-b') === true, 'saveAttempt for Section A automatically unlocks Section B');

// Test that retaking Section A does not re-lock Section B
saveAttempt({
  id: 'test_sec_a_retake',
  sectionId: 'section-a',
  sectionName: 'Section A — Audio Quality Assessment',
  totalQuestions: 5,
  attemptedCount: 4,
});
assert(isSectionUnlocked('section-b') === true, 'Retaking Section A preserves Section B unlocked state');

// Clean up after test
resetSectionLocking();

// -----------------------------------------------------------------------------
// 8. Testing Developer Attribution Integrity ("Developed By Injamamul")
// -----------------------------------------------------------------------------
console.log(`\n8. Testing Developer Attribution Integrity:`);
const attributionFiles = [
  'src/components/Footer.jsx',
  'src/components/Header.jsx',
  'src/components/WelcomePanel.jsx',
  'src/pages/SectionAIntro.jsx',
  'src/pages/SectionBIntro.jsx',
  'src/pages/SectionCIntro.jsx',
  'src/pages/SectionDIntro.jsx',
  'src/pages/SectionEIntro.jsx',
  'src/pages/SectionATest.jsx',
  'src/pages/SectionBTest.jsx',
  'src/pages/SectionCTest.jsx',
  'src/pages/SectionDTest.jsx',
  'src/pages/SectionETest.jsx',
  'index.html',
];

attributionFiles.forEach((relPath) => {
  const content = fs.readFileSync(relPath, 'utf8');
  assert(
    content.includes('Injamamul'),
    `Developer attribution 'Injamamul' is present in ${relPath}`
  );
});

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log(`\n========================================`);
console.log(`Test Results: ${passedTests} passed, ${failedTests} failed out of ${totalTests} tests`);
console.log(`========================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
