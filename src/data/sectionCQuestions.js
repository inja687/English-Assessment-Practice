/**
 * Section C Speaking Topic Bank & Generator
 * 
 * Contains all 13 specified speaking topics for Section C (Speak for One Minute).
 * Generates 3 randomly selected topics for each practice attempt,
 * avoiding repetition from previous attempts so topics rotate dynamically.
 */

export const SPEAKING_TOPIC_BANK = [
  {
    id: 't1',
    topicNumber: 1,
    prompt: 'Talk about the type of weather you enjoy',
    category: 'Lifestyle & Preferences',
    guidance: 'Describe the conditions, how it makes you feel, and activities you like doing in this weather.',
  },
  {
    id: 't2',
    topicNumber: 2,
    prompt: 'Describe a recent experience where you felt a sense of pride of satisfaction in yourself.',
    category: 'Personal Experience',
    guidance: 'Explain what happened, what obstacles you overcame, and why the achievement mattered to you.',
  },
  {
    id: 't3',
    topicNumber: 3,
    prompt: 'If you had unlimited resources, what would you do to make the world a better place?',
    category: 'Hypothetical & Global Issues',
    guidance: 'Outline the cause you would champion, the actions you would take, and the expected impact.',
  },
  {
    id: 't4',
    topicNumber: 4,
    prompt: 'Talk about a skill or talent that you possess.',
    category: 'Personal Skills & Talents',
    guidance: 'Explain how you developed this skill, how you use it in life, and why it is important to you.',
  },
  {
    id: 't5',
    topicNumber: 5,
    prompt: 'Describe a time when you took a risk and paid off.',
    category: 'Life Decisions & Risks',
    guidance: 'Explain the situation, what the risk involved, what decision you made, and how it succeeded.',
  },
  {
    id: 't6',
    topicNumber: 6,
    prompt: 'What is your opinion on the importance of traveling and experiencing different cultures?',
    category: 'Culture & Perspective',
    guidance: 'Share your viewpoint, benefits for personal growth, and any relevant observations or examples.',
  },
  {
    id: 't7',
    topicNumber: 7,
    prompt: 'Describe an activity that you find particularly relaxing.',
    category: 'Hobbies & Wellness',
    guidance: 'Explain what the activity is, when and where you do it, and why it helps relieve stress.',
  },
  {
    id: 't8',
    topicNumber: 8,
    prompt: 'Describe an outdoor activity that you enjoy doing.',
    category: 'Outdoor & Recreation',
    guidance: 'Describe where and with whom you do it, the physical or mental benefits, and what makes it enjoyable.',
  },
  {
    id: 't9',
    topicNumber: 9,
    prompt: 'Explain an experience you had while traveling to a new place and what you learned form it.',
    category: 'Travel & Learning',
    guidance: 'Recount the destination, an unexpected event or discovery, and the lasting lesson you gained.',
  },
  {
    id: 't10',
    topicNumber: 10,
    prompt: 'Do you think its better to focus on the present or plan for the future? Explain.',
    category: 'Perspective & Reflection',
    guidance: 'State your position clearly, compare both outlooks, and justify your reasoning with examples.',
  },
  {
    id: 't11',
    topicNumber: 11,
    prompt: 'Describe your best Movie?',
    category: 'Entertainment & Cinema',
    bulletPrompts: [
      'Movie name',
      'last seen',
      'Best character of this movie',
      'Why this movie watched everyone',
    ],
    guidance: 'Name the movie, when you last saw it, describe the best character, and explain why everyone should watch it.',
  },
  {
    id: 't12',
    topicNumber: 12,
    prompt: 'Recently visit Place?',
    category: 'Travel & Places',
    bulletPrompts: [
      'place name',
      'last visit',
      'why this place is better',
      'why visit this place',
    ],
    guidance: 'State the place name, when you last visited, explain why this place is better or special, and why people should visit.',
  },
  {
    id: 't13',
    topicNumber: 13,
    prompt: 'Childhood favourite cartoon',
    category: 'Childhood & Memories',
    bulletPrompts: [
      'Cartoon name',
      'Why its your favourite',
      'Best character and its why?',
    ],
    guidance: 'State the cartoon name, explain why it became your favourite, and describe the best character and why you liked them.',
  },
];

/**
 * Randomly select 3 different topics for each new practice attempt.
 * Avoids repeating the topics from the immediately preceding attempt when possible.
 * 
 * @param {string[]} previousTopicIds - Array of topic IDs from preceding attempt
 * @returns {Array} Array of 3 formatted question objects
 */
export function generateSectionCQuestions(previousTopicIds = []) {
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Filter out preceding topics if enough unused ones are available (need at least 3)
  const unusedTopics = SPEAKING_TOPIC_BANK.filter((t) => !previousTopicIds.includes(t.id));
  const pool = unusedTopics.length >= 3 ? unusedTopics : SPEAKING_TOPIC_BANK;
  const selectedTopics = shuffle(pool).slice(0, 3);

  return selectedTopics.map((topic, index) => ({
    id: index + 1,
    topicId: topic.id,
    questionNumber: index + 1,
    prompt: topic.prompt,
    category: topic.category,
    guidance: topic.guidance,
    bulletPrompts: topic.bulletPrompts || null,
    prepSeconds: 30,
    maxRecordingSeconds: 60,
    typeLabel: 'Speak for One Minute',
  }));
}
