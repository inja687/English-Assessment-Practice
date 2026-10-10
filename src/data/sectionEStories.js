/**
 * Section E Listening Comprehension Story Bank & Generator
 * 
 * Reusable bank of 8 authentic listening comprehension stories with 3 related questions each:
 * 1. Mike the Bodybuilder (1985 Chicago Championship, blue color, training youth)
 * 2. Petra the Renowned Storyteller (senior citizens over 70, time travel, book on journeys)
 * 3. Journalist Meeting David Saldanha (idol, phoenix from ashes, street urchins)
 * 4. Jason's Move to Paris (doctor, flourishing hospitals, learning Italian)
 * 5. Ruby's Bookstore "Booknook" (L Street, coffee shop inside, borrow coffee table books)
 * 6. Linda's Backpacking Journey (helping others, epilepsy, pies fresh from the oven)
 * 7. Moving to a New Apartment (market, school 1 mile, park for dog, wife 10 mins, bank far away)
 * 8. Gamification in Learning Programs (engagement, core drivers, accomplishment, ownership)
 */

export const LISTENING_STORY_BANK = [
  {
    id: 'story-1',
    title: 'Mike the Bodybuilder',
    category: 'Sports & Personal Discipline',
    script: 'Mike was a bodybuilder. He traveled all over the world and won many competitions between 1980 and 1990. His biggest win was the 1985 Chicago Championship where he won against Tom Polar. Mike was famous but humble. He loved wearing blue. It was his favorite color. One day he decided not to compete anymore. Now he trains other young bodybuilders. Recently, one of his students asked him if he misses participating. To this, Mike happily said that he is participating a lot more through his students.',
    questions: [
      {
        id: 's1-q1',
        prompt: 'What is Mike’s favourite color?',
        options: [
          'Blue',
          'Red',
          'Green',
          'Black'
        ],
        correctAnswer: 'Blue',
        explanation: 'The audio explicitly states: "He loved wearing blue. It was his favorite color."'
      },
      {
        id: 's1-q2',
        prompt: 'What does Mike do now?',
        options: [
          'He trains other young bodybuilders',
          'He still competes in international competitions',
          'He manufactures gym equipment',
          'He judges professional fitness championships'
        ],
        correctAnswer: 'He trains other young bodybuilders',
        explanation: 'The passage explains: "Now he trains other young bodybuilders."'
      },
      {
        id: 's1-q3',
        prompt: 'What was Mike’s profession?',
        options: [
          'A bodybuilder',
          'A fashion designer',
          'A sports journalist',
          'A flight attendant'
        ],
        correctAnswer: 'A bodybuilder',
        explanation: 'The story opens by establishing: "Mike was a bodybuilder."'
      }
    ]
  },
  {
    id: 'story-2',
    title: 'Petra the Renowned Storyteller',
    category: 'Arts & Storytelling',
    script: 'Petra was a renowned storyteller. She traveled all over the world and the more she traveled, the more stories she added to her collection. Petra told stories to several different audiences and everyone, children and adults alike, loved listening to her. But her favorite age group was that of senior citizens. She once mentioned in an interview that while performing for seniors, especially those who were over 70, she felt like she was time traveling and learning from their experiences, too. Petra is now writing a book on her journeys, both emotional and professional.',
    questions: [
      {
        id: 's2-q1',
        prompt: 'Which of the given is NOT certain from the audio clip?',
        options: [
          'The exact publication date or title of her book',
          'That she is currently writing a book',
          'That senior citizens were her favorite audience',
          'That she traveled around the world'
        ],
        correctAnswer: 'The exact publication date or title of her book',
        explanation: 'While the clip mentions she is writing a book on her journeys, it does not state when it will be published or what its title will be.'
      },
      {
        id: 's2-q2',
        prompt: 'Which of these statements is NOT true?',
        options: [
          'She only performed for senior citizens',
          'Children and adults alike loved listening to her',
          'She felt like time traveling when performing for seniors over 70',
          'The more she traveled, the more stories she collected'
        ],
        correctAnswer: 'She only performed for senior citizens',
        explanation: 'The passage explicitly says: "Petra told stories to several different audiences and everyone, children and adults alike, loved listening to her."'
      },
      {
        id: 's2-q3',
        prompt: 'What is Petra’s book about?',
        options: [
          'Her journeys, both emotional and professional',
          'Fictional children’s fables',
          'Historical biographies of famous travellers',
          'Techniques of stage acting and voice projection'
        ],
        correctAnswer: 'Her journeys, both emotional and professional',
        explanation: 'The audio clip concludes: "Petra is now writing a book on her journeys, both emotional and professional."'
      }
    ]
  },
  {
    id: 'story-3',
    title: 'A Journalist Meeting David Saldanha',
    category: 'Journalism & Social Impact',
    script: 'Reading, traveling, and meeting intriguing people are the highlights of a journalist’s life. And I am over the moon. Two years ago, I met David Saldanha, my idol. His life was hardly a rags-to-riches narrative. He was more like a phoenix rising fiercely from the ashes. Having tasted success and wealth early, David could have had a life of red carpets and sunshine. However, he chose to travel a completely unfamiliar route. He began educating homeless street urchins and then helping them find a career path. He supported them emotionally and financially and some of them are now successful entrepreneurs.',
    questions: [
      {
        id: 's3-q1',
        prompt: 'Which of the given statements is NOT true?',
        options: [
          'David had a rags-to-riches story',
          'The speaker met David two years ago',
          'David educated homeless street kids',
          'David supported street kids in their careers'
        ],
        correctAnswer: 'David had a rags-to-riches story',
        explanation: 'The speaker clarifies: "His life was hardly a rags to riches narrative. Having tasted success and wealth early..." making this statement false.'
      },
      {
        id: 's3-q2',
        prompt: 'What does the speaker like?',
        options: [
          'Reading, traveling, and meeting intriguing people',
          'Attending film premieres and red carpet galas',
          'Living in extreme luxury and collecting cars',
          'Working exclusively in local government offices'
        ],
        correctAnswer: 'Reading, traveling, and meeting intriguing people',
        explanation: 'The speaker begins by stating: "Reading, traveling, and meeting intriguing people are the highlights of a journalist’s life."'
      },
      {
        id: 's3-q3',
        prompt: 'Who was David Saldanha?',
        options: [
          'The speaker’s idol who dedicated his life to helping street children',
          'A senior newspaper editor in Chicago',
          'A young politician running for office',
          'A luxury real estate developer'
        ],
        correctAnswer: 'The speaker’s idol who dedicated his life to helping street children',
        explanation: 'David Saldanha was the speaker’s idol who chose to educate, mentor, and financially support homeless street youth.'
      }
    ]
  },
  {
    id: 'story-4',
    title: 'Jason’s Move to Paris',
    category: 'Relocation & Professional Life',
    script: 'My friend Jason is a doctor. He used to live near my house in New York, but he relocated to Paris months ago. Some of us felt sad to see him go. However, Paris is far superior to New York in the medical field, and the hospitals there are flourishing. Besides, France is a beautiful country, and Jason speaks French quite well. The last time he visited, he said he loved being in a new country. He’s also learning Italian at the moment. Well, I hope to go there someday, too.',
    questions: [
      {
        id: 's4-q1',
        prompt: 'Where does Jason live?',
        options: [
          'In Paris',
          'In New York',
          'In Rome',
          'In London'
        ],
        correctAnswer: 'In Paris',
        explanation: 'The speaker says Jason relocated to Paris months ago and now lives there.'
      },
      {
        id: 's4-q2',
        prompt: 'Where does the speaker live?',
        options: [
          'In New York',
          'In Paris',
          'In Rome',
          'In Montreal'
        ],
        correctAnswer: 'In New York',
        explanation: 'The speaker mentions that Jason "used to live near my house in New York", showing the speaker resides in New York.'
      },
      {
        id: 's4-q3',
        prompt: 'Why did Jason move to Paris?',
        options: [
          'Paris is far superior in the medical field and the hospitals are flourishing',
          'He was offered a position as an Italian teacher',
          'He wanted to escape cold weather in New York',
          'His family insisted he relocate to Europe'
        ],
        correctAnswer: 'Paris is far superior in the medical field and the hospitals are flourishing',
        explanation: 'The audio explains: "Paris is far superior to New York in the medical field, and the hospitals there are flourishing."'
      }
    ]
  },
  {
    id: 'story-5',
    title: 'Ruby’s Bookstore "Booknook"',
    category: 'Community & Small Business',
    script: 'Ruby owns a small bookstore called Booknook. It’s around the corner from L Street next to the furniture store. My favorite thing about the bookstore is the coffee shop inside. I sometimes pick up a few books and then go through them while sipping coffee. You can find some rare comics, a lot of books on travel, a big section on children’s books, and cookbooks. There are also some coffee table books that you can borrow, but they’re not for sale. So, the next time you’re in the area, don’t forget to visit Ruby because she’s always happy to meet new customers.',
    questions: [
      {
        id: 's5-q1',
        prompt: 'The speaker’s favourite thing about the bookstore is/are ___.',
        options: [
          'The coffee shop inside',
          'The rare comics section',
          'The furniture store nearby',
          'The discount cookbook shelf'
        ],
        correctAnswer: 'The coffee shop inside',
        explanation: 'The speaker explicitly remarks: "My favorite thing about the bookstore is the coffee shop inside."'
      },
      {
        id: 's5-q2',
        prompt: 'What is Ruby’s bookstore called?',
        options: [
          'Booknook',
          'Page Turner',
          'L Street Reads',
          'Coffee & Novels'
        ],
        correctAnswer: 'Booknook',
        explanation: 'The audio says: "Ruby owns a small bookstore called Booknook."'
      },
      {
        id: 's5-q3',
        prompt: 'Which items can customers borrow from the bookstore that are not for sale?',
        options: [
          'Coffee table books',
          'Rare comics',
          'Children’s books',
          'Cookbooks'
        ],
        correctAnswer: 'Coffee table books',
        explanation: 'The passage notes: "There are also some coffee table books that you can borrow, but they’re not for sale."'
      }
    ]
  },
  {
    id: 'story-6',
    title: 'Linda’s Backpacking Journey',
    category: 'Travel & Personal Resilience',
    script: 'I met Linda on a backpacking trip. Throughout the trip, I noticed that she kept going the extra mile to help others. I learned that she was epileptic, but that she loved giving things a whirl now and then with gusto. "My life is like food that goes stale if I don’t have exciting experiences," she would say. "And travel experiences are like pies fresh from the oven." She lived her life from seizure to seizure. Every time she needed to recuperate, she would update her travel journal and make plans for her next potential destination.',
    questions: [
      {
        id: 's6-q1',
        prompt: 'What did the speaker notice about Linda on the trip?',
        options: [
          'She kept going the extra mile to help others',
          'She avoided interacting with fellow hikers',
          'She complained about difficult mountain trails',
          'She refused to take part in group activities'
        ],
        correctAnswer: 'She kept going the extra mile to help others',
        explanation: 'The speaker observed: "Throughout the trip, I noticed that she kept going the extra mile to help others."'
      },
      {
        id: 's6-q2',
        prompt: 'According to the audio clip, how does Linda cope with her epilepsy?',
        options: [
          'She updates her travel journal and makes plans for her next destination',
          'She cancels future trips and remains hospitalized',
          'She avoids any physical or emotional excitement',
          'She stays strictly at home to rest'
        ],
        correctAnswer: 'She updates her travel journal and makes plans for her next destination',
        explanation: 'The clip explains: "Every time she needed to recuperate, she would update her travel journal and make plans for her next potential destination."'
      },
      {
        id: 's6-q3',
        prompt: 'What analogy did Linda make about her travel experiences?',
        options: [
          'Like pies fresh from the oven',
          'Like food that goes stale',
          'Like a ship sailing through a storm',
          'Like a puzzle waiting to be solved'
        ],
        correctAnswer: 'Like pies fresh from the oven',
        explanation: 'Linda remarked: "And travel experiences are like pies fresh from the oven."'
      }
    ]
  },
  {
    id: 'story-7',
    title: 'Moving to a New Apartment',
    category: 'Family & Lifestyle',
    script: 'My wife, daughter, dog, and I recently moved to a new apartment. It’s located close to a market which makes it easy for us. We found a good school for my daughter only a mile away. There’s a park nearby where we take our dog for walks. My wife drives to work, and it only takes her 10 minutes. I work from home, so there’s no problem on that front either. The only flip side is that our bank is far away. And that will take some time for us to get used to, because it was right outside our old apartment gate.',
    questions: [
      {
        id: 's7-q1',
        prompt: 'Where will the family need to make an adjustment?',
        options: [
          'Because their bank is far away',
          'Because the daughter’s school is too distant',
          'Because the wife has a lengthy commute to work',
          'Because there is no park to walk their dog'
        ],
        correctAnswer: 'Because their bank is far away',
        explanation: 'The speaker notes: "The only flip side is that our bank is far away. And that will take some time for us to get used to..."'
      },
      {
        id: 's7-q2',
        prompt: 'Where is the speaker’s place of work?',
        options: [
          'At home (he works from home)',
          'In a corporate office 10 minutes away',
          'At the local market',
          'At his daughter’s school'
        ],
        correctAnswer: 'At home (he works from home)',
        explanation: 'The speaker says: "I work from home, so there’s no problem on that front either."'
      },
      {
        id: 's7-q3',
        prompt: 'Which of these is/are located close to the house?',
        options: [
          'A market and a park',
          'The bank and the wife’s office',
          'The airport and the train station',
          'The daughter’s school and the bank'
        ],
        correctAnswer: 'A market and a park',
        explanation: 'The text notes the apartment is "close to a market" and "there’s a park nearby where we take our dog for walks."'
      }
    ]
  },
  {
    id: 'story-8',
    title: 'Gamification in Learning Programs',
    category: 'Education & Cognitive Psychology',
    script: 'I worked on a training programme that gamifies learning for better engagement, retention, and implementation. Concepts of gamification are employed in learning by designing the content according to certain core drivers. Core drivers are things that appeal to us and motivate us to make choices. For instance, accomplishment is a driver that focuses on creativity and the need to create new and innovative solutions. Ownership focuses on one’s need to possess more—for example, by buying high-end cars or hoarding wealth. When a game appeals to our drivers, we engage with it and learn.',
    questions: [
      {
        id: 's8-q1',
        prompt: 'What is the audio clip talking about?',
        options: [
          'A training programme that gamifies learning',
          'Developing graphic engines for console video games',
          'Financial advice for purchasing luxury automobiles',
          'Techniques to curb video game addiction'
        ],
        correctAnswer: 'A training programme that gamifies learning',
        explanation: 'The speaker introduces the topic: "I worked on a training programme that gamifies learning for better engagement retention and implementation."'
      },
      {
        id: 's8-q2',
        prompt: 'What is the purpose of the program?',
        options: [
          'Better engagement, retention, and implementation',
          'To replace classroom instructors with automated bots',
          'To lower hardware manufacturing costs',
          'To eliminate competitive exams'
        ],
        correctAnswer: 'Better engagement, retention, and implementation',
        explanation: 'The passage explicitly says that gamification is used "for better engagement, retention, and implementation."'
      },
      {
        id: 's8-q3',
        prompt: 'According to the audio clip, what are “core drivers”?',
        options: [
          'Things that appeal to us and motivate us to make choices',
          'Software algorithms that speed up game engines',
          'Rules enforced by company managers',
          'Economic indicators measuring inflation'
        ],
        correctAnswer: 'Things that appeal to us and motivate us to make choices',
        explanation: 'The speaker defines core drivers: "Core drivers are things that appeal to us and motivate us to make choices."'
      }
    ]
  }
];

/**
 * Generate 12 Section E Questions across 4 distinct stories:
 * - Story 1: Q1 (Story playback), Q2 (MCQ 1), Q3 (MCQ 2)
 * - Story 2: Q4 (Story playback), Q5 (MCQ 1), Q6 (MCQ 2)
 * - Story 3: Q7 (Story playback), Q8 (MCQ 1), Q9 (MCQ 2)
 * - Story 4: Q10 (Story playback), Q11 (MCQ 1), Q12 (MCQ 2)
 * 
 * On subsequent retakes, unused stories from the 8-story bank are prioritized
 * so candidates can practice all 8 authentic stories with zero repetition!
 * 
 * @param {string[]} previousStoryIds - Array of story IDs from preceding attempt
 * @returns {Object} { stories, questions }
 */
export function generateSectionEQuestions(previousStoryIds = []) {
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Filter out preceding stories if enough unused ones are available (need 4)
  const unusedStories = LISTENING_STORY_BANK.filter((s) => !previousStoryIds.includes(s.id));
  const pool = unusedStories.length >= 4 ? unusedStories : LISTENING_STORY_BANK;
  const selectedStories = shuffle(pool).slice(0, 4);

  const questions = [];

  selectedStories.forEach((story, storyIdx) => {
    const storyNumber = storyIdx + 1; // 1, 2, 3, 4
    const baseQuestionNum = storyIdx * 3; // 0, 3, 6, 9

    // Question 1 of the group: Story Audio Task (e.g. Q1, Q4, Q7, Q10)
    questions.push({
      id: baseQuestionNum + 1,
      questionNumber: baseQuestionNum + 1,
      type: 'story_playback',
      storyId: story.id,
      storyNumber,
      storyTitle: story.title,
      category: story.category,
      script: story.script,
      prompt: `Story ${storyNumber}: ${story.title}`,
      instruction: 'Listen carefully to the story. Audio can be played only once.',
    });

    // Pick 2 MCQs from the story's 3 questions
    const pickedQuestions = shuffle(story.questions).slice(0, 2);

    pickedQuestions.forEach((mcq, mcqIdx) => {
      const qNum = baseQuestionNum + 2 + mcqIdx; // e.g. 2, 3 or 5, 6 or 8, 9 or 11, 12
      const shuffledOptions = shuffle(mcq.options);

      questions.push({
        id: qNum,
        questionNumber: qNum,
        type: 'comprehension_mcq',
        storyId: story.id,
        storyNumber,
        storyTitle: story.title,
        category: story.category,
        script: story.script,
        parentStoryQuestionNum: baseQuestionNum + 1,
        prompt: mcq.prompt,
        options: shuffledOptions,
        correctAnswer: mcq.correctAnswer,
        explanation: mcq.explanation,
      });
    });
  });

  return {
    stories: selectedStories,
    questions,
  };
}
