/**
 * Section D Question Bank: Grammar & English Usage Assessment
 * 
 * Reusable bank containing authentic corporate voice and English grammar evaluation questions:
 * 1. Verb Forms & Subject–Verb Agreement (20 questions)
 * 2. Tenses (21 questions)
 * 3. Articles (15 questions)
 * 4. Prepositions (14 questions)
 * 5. Active & Passive Voice Change (6 questions)
 * 6. Correct Sentence Selection (12 questions)
 * 7. Sentence Correction (10 questions)
 * 8. Pronouns & Determiners (10 questions)
 * 
 * Total: 108 questions. Each practice test dynamically samples and balances 34 questions across categories.
 */

export const GRAMMAR_QUESTION_BANK = [
  // --------------------------------------------------------------------------
  // Category 1: Verb Forms & Subject–Verb Agreement (20 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g1',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'Betty ___ (cycle/cycles) to college every day.',
    options: ['cycles', 'cycle', 'cycling', 'cycled'],
    correctAnswer: 'cycles',
    explanation: "Third-person singular subject 'Betty' takes the singular verb form 'cycles' for habitual daily actions in the simple present tense."
  },
  {
    id: 'g2',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: '___ (is/are) you an engineer?',
    options: ['Are', 'Is', 'Am', 'Were'],
    correctAnswer: 'Are',
    explanation: "The second-person pronoun 'you' requires the plural auxiliary verb 'Are' in the present tense."
  },
  {
    id: 'g3',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'My Grandparents often ___ (tell/tells) me stories.',
    options: ['tell', 'tells', 'telling', 'told'],
    correctAnswer: 'tell',
    explanation: "Plural subject 'My Grandparents' takes the base plural verb form 'tell'."
  },
  {
    id: 'g4',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'My mother ___ (give/gives) me an apple every day.',
    options: ['gives', 'give', 'giving', 'gave'],
    correctAnswer: 'gives',
    explanation: "Singular subject 'My mother' takes the third-person singular verb 'gives' in simple present tense."
  },
  {
    id: 'g5',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'What if she ___ (forget/forgets) your birthday? Will you ___ (forgive/forgives) her?',
    options: ['forgets, forgive', 'forget, forgive', 'forgets, forgives', 'forget, forgives'],
    correctAnswer: 'forgets, forgive',
    explanation: "'She' takes singular 'forgets', while modal auxiliary 'will' is followed by the base infinitive 'forgive'."
  },
  {
    id: 'g6',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'One of the bags ___ (is/are) mine.',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 'is',
    explanation: "The grammatical subject is the singular head noun 'One', requiring the singular verb 'is'."
  },
  {
    id: 'g7',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: '___ (have/has) you eaten?',
    options: ['Have', 'Has', 'Had', 'Having'],
    correctAnswer: 'Have',
    explanation: "Second-person pronoun 'you' takes auxiliary 'Have' in the present perfect question."
  },
  {
    id: 'g8',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: '___ (Do/Does) he live here?',
    options: ['Does', 'Do', 'Did', 'Is'],
    correctAnswer: 'Does',
    explanation: "Third-person singular pronoun 'he' takes auxiliary 'Does' in simple present questions."
  },
  {
    id: 'g9',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: '___ (Have/Has) your cousin arrived?',
    options: ['Has', 'Have', 'Did', 'Do'],
    correctAnswer: 'Has',
    explanation: "Singular subject 'your cousin' takes the singular auxiliary 'Has'."
  },
  {
    id: 'g10',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'A pair of spectacles ___ (is/are) missing.',
    options: ['is', 'are', 'were', 'have'],
    correctAnswer: 'is',
    explanation: "The subject is the singular noun phrase 'A pair', which takes the singular verb 'is'."
  },
  {
    id: 'g11',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'Either my son or my daughter ___ (is/are) running the errands today.',
    options: ['is', 'are', 'were', 'be'],
    correctAnswer: 'is',
    explanation: "When two singular subjects are joined by 'either... or', the singular verb 'is' is used."
  },
  {
    id: 'g12',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'All the plates, even the yellow one, ___ (is/are) from the same store.',
    options: ['are', 'is', 'was', 'be'],
    correctAnswer: 'are',
    explanation: "The main subject is plural 'All the plates'. The parenthetical clause 'even the yellow one' does not alter plural verb agreement."
  },
  {
    id: 'g13',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'Her coaching ability, coupled with her creativity, ___ (is/are) a fantastic combination.',
    options: ['is', 'are', 'were', 'being'],
    correctAnswer: 'is',
    explanation: "The subject 'Her coaching ability' is singular. Parenthetical phrases introduced by 'coupled with' do not change the subject number."
  },
  {
    id: 'g14',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'She ___ (watch/watches) her favourite web series on weekends.',
    options: ['watches', 'watch', 'watching', 'watched'],
    correctAnswer: 'watches',
    explanation: "Third-person singular subject 'She' requires 'watches' in the simple present tense."
  },
  {
    id: 'g15',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'Go there quickly – Ben ___ (are waiting / is waiting) for you to arrive right now.',
    options: ['is waiting', 'are waiting', 'waits', 'waited'],
    correctAnswer: 'is waiting',
    explanation: "Singular subject 'Ben' and ongoing action right now require the present continuous form 'is waiting'."
  },
  {
    id: 'g16',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Easy',
    prompt: 'The bookshop ___ (open/opens) at 11:30 a.m.',
    options: ['opens', 'open', 'opening', 'opened'],
    correctAnswer: 'opens',
    explanation: "Singular subject 'The bookshop' takes singular present verb 'opens' for timetabled schedules."
  },
  {
    id: 'g17',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'About one-tenth of this country ___ (work/works) three jobs a day.',
    options: ['works', 'work', 'working', 'worked'],
    correctAnswer: 'works',
    explanation: "A fraction referring to a singular collective entity ('this country') takes a singular verb ('works')."
  },
  {
    id: 'g18',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'Neither the spoons nor the crystal bowl ___ (go/goes) into that drawer.',
    options: ['goes', 'go', 'going', 'went'],
    correctAnswer: 'goes',
    explanation: "With 'neither... nor', the verb agrees with the closer subject ('the crystal bowl', singular)."
  },
  {
    id: 'g19',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'Poppy (and her famous camera) ___ (was/were) always itching to go on exploratory adventures.',
    options: ['was', 'were', 'are', 'been'],
    correctAnswer: 'was',
    explanation: "Parenthetical additions enclosed in brackets do not alter the singular subject 'Poppy'."
  },
  {
    id: 'g20',
    category: 'Verb Forms & Subject–Verb Agreement',
    difficulty: 'Medium',
    prompt: 'Measles, along with joint pains, ___ (is/are) severely uncomfortable!',
    options: ['is', 'are', 'were', 'being'],
    correctAnswer: 'is',
    explanation: "'Measles' is a disease name treated grammatically as singular, taking 'is'. The phrase 'along with...' does not affect agreement."
  },

  // --------------------------------------------------------------------------
  // Category 2: Tenses (21 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g21',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'Last evening, I ___ (enter) the movie hall ten minutes late.',
    options: ['entered', 'enter', 'was entering', 'had entered'],
    correctAnswer: 'entered',
    explanation: "Definite past time expression 'Last evening' takes simple past 'entered'."
  },
  {
    id: 'g22',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'These days, I ___ (to have) breakfast before I begin my day.',
    options: ['have', 'had', 'am having', 'has'],
    correctAnswer: 'have',
    explanation: "'These days' describes a current habitual daily routine, requiring simple present 'have'."
  },
  {
    id: 'g23',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'I did not ___ (ask) them for help because I felt awkward.',
    options: ['ask', 'asked', 'asking', 'asks'],
    correctAnswer: 'ask',
    explanation: "The negative auxiliary 'did not' is followed by the base form of the verb 'ask'."
  },
  {
    id: 'g24',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'I ___ (to dress) up for my birthday yesterday.',
    options: ['dressed', 'dress', 'was dressing', 'had dressed'],
    correctAnswer: 'dressed',
    explanation: "Time adverbial 'yesterday' indicates a completed past event, requiring simple past 'dressed'."
  },
  {
    id: 'g25',
    category: 'Tenses',
    difficulty: 'Hard',
    prompt: '___ (to have) I ___ (to know) that you live in Japan, I would have called you before leaving.',
    options: ['Had, known', 'Have, known', 'Did, know', 'Had, knew'],
    correctAnswer: 'Had, known',
    explanation: "Inverted third conditional ('Had I known...') expresses a past unreal condition paired with 'would have called'."
  },
  {
    id: 'g26',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'Porcelain ___ (to be known) to break easily.',
    options: ['is known', 'was known', 'are known', 'has known'],
    correctAnswer: 'is known',
    explanation: "General truth stated in the present passive voice: 'is known to break easily'."
  },
  {
    id: 'g27',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'The thieves ___ (flee) when they saw the police ___ (enter) the gate.',
    options: ['fled, entering', 'fled, entered', 'flee, entering', 'had fled, to enter'],
    correctAnswer: 'fled, entering',
    explanation: "Simple past 'fled' for the immediate action, and present participle 'entering' after verb of perception 'saw'."
  },
  {
    id: 'g28',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'At this juncture, it ___ (be) imperative that we ___ (support) her.',
    options: ['is, support', 'is, supports', 'was, supported', 'be, support'],
    correctAnswer: 'is, support',
    explanation: "'It is imperative that' triggers the mandative subjunctive mood, requiring the uninflected base verb 'support'."
  },
  {
    id: 'g29',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'When I have more money, I ___ (buy) that armchair.',
    options: ['will buy', 'bought', 'buy', 'am buying'],
    correctAnswer: 'will buy',
    explanation: "First conditional pattern: present tense in time clause ('When I have'), 'will + base verb' in main clause ('will buy')."
  },
  {
    id: 'g30',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'I ___ (to meet) my professor yesterday.',
    options: ['met', 'meet', 'was meeting', 'have met'],
    correctAnswer: 'met',
    explanation: "'Yesterday' specifies a completed past action, requiring simple past 'met'."
  },
  {
    id: 'g31',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'Does he ___ (drive) to college?',
    options: ['drive', 'drives', 'drove', 'driving'],
    correctAnswer: 'drive',
    explanation: "The auxiliary 'Does' takes the bare infinitive / base form 'drive'."
  },
  {
    id: 'g32',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'If you look around, you ___ (to find) many burger joints in Florida.',
    options: ['will find', 'found', 'find', 'have found'],
    correctAnswer: 'will find',
    explanation: "First conditional rule: present simple in condition clause ('look'), 'will + base verb' in result clause ('will find')."
  },
  {
    id: 'g33',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'They ___ (to arrive) two hours ago, earlier than planned.',
    options: ['arrived', 'arrive', 'have arrived', 'had arrived'],
    correctAnswer: 'arrived',
    explanation: "Specific elapsed time marker 'two hours ago' requires simple past 'arrived'."
  },
  {
    id: 'g34',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'As of now, the gates ___ (to open) at 9 a.m. every day.',
    options: ['open', 'opens', 'opened', 'are opening'],
    correctAnswer: 'open',
    explanation: "Plural subject 'the gates' takes base simple present 'open' for scheduled daily routines."
  },
  {
    id: 'g35',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'These days, I ___ (to have) a bowl of cereal every morning, and sometimes I ___ (to drink) a hot beverage.',
    options: ['have, drink', 'have, drinks', 'had, drank', 'am having, drink'],
    correctAnswer: 'have, drink',
    explanation: "Habitual present routines with subject 'I' require simple present forms 'have' and 'drink'."
  },
  {
    id: 'g36',
    category: 'Tenses',
    difficulty: 'Easy',
    prompt: 'Perry ___ (begin) travelling to Germany last year.',
    options: ['began', 'begins', 'has begun', 'had begun'],
    correctAnswer: 'began',
    explanation: "'Last year' is a definite past time anchor, requiring simple past 'began'."
  },
  {
    id: 'g37',
    category: 'Tenses',
    difficulty: 'Hard',
    prompt: 'That loud music ___ (play) for over three hours now. At this rate, I ___ (go) deaf very soon.',
    options: ['has been playing, will go', 'is playing, go', 'was playing, went', 'has played, am going'],
    correctAnswer: 'has been playing, will go',
    explanation: "Present perfect continuous ('has been playing') expresses duration continuing into the present; future ('will go') states the consequence."
  },
  {
    id: 'g38',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'By the time he ___ (to finish) his work, it ___ (to start) to get dark.',
    options: ['finished, had started', 'finishes, started', 'finished, started', 'had finished, started'],
    correctAnswer: 'finished, had started',
    explanation: "Past perfect ('had started') denotes the earlier completed past action relative to 'finished'."
  },
  {
    id: 'g39',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'It was while ___ (to install) the computer at night that he suddenly ___ (to receive) a phone call.',
    options: ['installing, received', 'installed, receives', 'to install, received', 'installing, had received'],
    correctAnswer: 'installing, received',
    explanation: "'While installing' is a participial time clause; the interrupting past event uses simple past 'received'."
  },
  {
    id: 'g40',
    category: 'Tenses',
    difficulty: 'Hard',
    prompt: 'While ___ (float) mid-air, Miss Derkins felt as if she ___ (be) light as a feather.',
    options: ['floating, were', 'floating, was', 'floated, was', 'float, were'],
    correctAnswer: 'floating, were',
    explanation: "'While floating' represents ongoing participial action; hypothetical comparison 'as if she were' takes subjunctive 'were'."
  },
  {
    id: 'g41',
    category: 'Tenses',
    difficulty: 'Medium',
    prompt: 'Right now, it is necessary that we ___ (to rescue) her from there!',
    options: ['rescue', 'rescues', 'rescued', 'are rescuing'],
    correctAnswer: 'rescue',
    explanation: "Mandative subjunctive following 'it is necessary that' requires the uninflected base verb 'rescue'."
  },

  // --------------------------------------------------------------------------
  // Category 3: Articles (15 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g42',
    category: 'Articles',
    difficulty: 'Easy',
    prompt: '___ market is closed today.',
    options: ['The', 'A', 'An', 'No article'],
    correctAnswer: 'The',
    explanation: "The definite article 'The' specifies a particular local market understood in context."
  },
  {
    id: 'g43',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'I love ___ English as a subject; however, I hate ___ textbook we have!',
    options: ['no article, the', 'the, the', 'an, a', 'the, a'],
    correctAnswer: 'no article, the',
    explanation: "Names of school subjects take zero article ('English'); specific items take 'the' ('the textbook we have')."
  },
  {
    id: 'g44',
    category: 'Articles',
    difficulty: 'Easy',
    prompt: 'You visiting me is ___ honor, sir!',
    options: ['an', 'a', 'the', 'no article'],
    correctAnswer: 'an',
    explanation: "'Honor' begins with a silent 'h' and vowel sound /ɒnər/, requiring indefinite article 'an'."
  },
  {
    id: 'g45',
    category: 'Articles',
    difficulty: 'Easy',
    prompt: 'I bought ___ new cupboard.',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 'a',
    explanation: "Singular countable noun starting with consonant sound /njuː/ takes 'a'."
  },
  {
    id: 'g46',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: "I think she is ___ very nice girl. Why don't you like ___ her?",
    options: ['a, no article', 'the, no article', 'a, the', 'the, the'],
    correctAnswer: 'a, no article',
    explanation: "'A very nice girl' takes indefinite article 'a'; object pronoun 'her' takes no article."
  },
  {
    id: 'g47',
    category: 'Articles',
    difficulty: 'Easy',
    prompt: 'I last went there ___ year ago.',
    options: ['a', 'an', 'the', 'no article'],
    correctAnswer: 'a',
    explanation: "'Year' begins with the semi-vowel consonant sound /j/, requiring 'a'."
  },
  {
    id: 'g48',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'There is ___ reading club near my house. It conducts sessions on ___ variety of subjects.',
    options: ['a, a', 'the, the', 'a, the', 'the, a'],
    correctAnswer: 'a, a',
    explanation: "'A reading club' introduces a singular countable noun; 'a variety of' is a standard fixed quantifier phrase."
  },
  {
    id: 'g49',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'He is ___ honourable man. In fact he is ___ most principled person I know.',
    options: ['an, the', 'a, the', 'an, a', 'a, a'],
    correctAnswer: 'an, the',
    explanation: "'Honourable' begins with a silent 'h' ('an'); superlative 'most principled' takes 'the'."
  },
  {
    id: 'g50',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'I will be ___ hour late. I need to go to ___ university campus for some work.',
    options: ['an, the', 'a, the', 'an, a', 'a, a'],
    correctAnswer: 'an, the',
    explanation: "'Hour' has silent 'h' ('an hour'); 'the university campus' refers to the specific known campus."
  },
  {
    id: 'g51',
    category: 'Articles',
    difficulty: 'Hard',
    prompt: 'Since ___ time immemorial, ___ traditions have been part of every culture.',
    options: ['no article, no article', 'the, the', 'a, the', 'the, no article'],
    correctAnswer: 'no article, no article',
    explanation: "'Since time immemorial' is a fixed idiom with zero article; general plural 'traditions' takes no article."
  },
  {
    id: 'g52',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'My son works in ___ United States. He also did his graduation from ___ university there.',
    options: ['the, a', 'the, the', 'no article, a', 'a, the'],
    correctAnswer: 'the, a',
    explanation: "Country names with plural words require 'the United States'; 'university' begins with consonant sound /j/, taking 'a'."
  },
  {
    id: 'g53',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: 'He is studying ___ history at ___ University of Maryland.',
    options: ['no article, the', 'the, the', 'a, the', 'no article, no article'],
    correctAnswer: 'no article, the',
    explanation: "Academic subjects take no article ('studying history'); named universities with 'of' take 'the'."
  },
  {
    id: 'g54',
    category: 'Articles',
    difficulty: 'Easy',
    prompt: 'There is ___ album in the chest. I love it because it takes me back to my childhood.',
    options: ['an', 'a', 'the', 'no article'],
    correctAnswer: 'an',
    explanation: "'Album' begins with a vowel sound /æ/, requiring the indefinite article 'an'."
  },
  {
    id: 'g55',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: "He has ___ one-track mind! Isn't it ___ tad annoying?",
    options: ['a, a', 'an, a', 'the, the', 'a, the'],
    correctAnswer: 'a, a',
    explanation: "'One-track' begins with consonant sound /w/ ('a'); 'a tad' is an idiomatic quantifier meaning slightly."
  },
  {
    id: 'g56',
    category: 'Articles',
    difficulty: 'Medium',
    prompt: '___ most famous character in literature is probably Mickey Mouse. He even has ___ adorable friend called Minnie.',
    options: ['The, an', 'A, an', 'The, a', 'No article, an'],
    correctAnswer: 'The, an',
    explanation: "Superlatives take 'The'; 'adorable' begins with vowel sound /əˈdɔːrəbl/, taking 'an'."
  },

  // --------------------------------------------------------------------------
  // Category 4: Prepositions (14 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g57',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'I am feeling cold. Please switch the fan ___.',
    options: ['off', 'out', 'away', 'down'],
    correctAnswer: 'off',
    explanation: "The phrasal verb 'switch off' means to turn off an electrical appliance."
  },
  {
    id: 'g58',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'My father is a sailor. He is currently ___ sea.',
    options: ['at', 'in', 'on', 'by'],
    correctAnswer: 'at',
    explanation: "The fixed idiom 'at sea' means traveling or working on an ocean voyage."
  },
  {
    id: 'g59',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'I have lived here ___ five years now.',
    options: ['for', 'since', 'during', 'from'],
    correctAnswer: 'for',
    explanation: "Preposition 'for' is used to express duration of time ('five years')."
  },
  {
    id: 'g60',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: '___ you, who else has been invited?',
    options: ['Besides', 'Beside', 'Between', 'Among'],
    correctAnswer: 'Besides',
    explanation: "'Besides' means 'in addition to' or 'as well as'."
  },
  {
    id: 'g61',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'Tammy went ___ a shopping spree yesterday.',
    options: ['on', 'for', 'in', 'at'],
    correctAnswer: 'on',
    explanation: "The conventional English idiom is 'go on a shopping spree'."
  },
  {
    id: 'g62',
    category: 'Prepositions',
    difficulty: 'Medium',
    prompt: 'Give him the benefit ___ doubt, ___ all means.',
    options: ['of, by', 'of, with', 'in, by', 'for, at'],
    correctAnswer: 'of, by',
    explanation: "The fixed English expressions are 'benefit of the doubt' and 'by all means'."
  },
  {
    id: 'g63',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'Please stand ___ the yellow line.',
    options: ['behind', 'between', 'under', 'into'],
    correctAnswer: 'behind',
    explanation: "'Behind the yellow line' is the standard safety spatial preposition."
  },
  {
    id: 'g64',
    category: 'Prepositions',
    difficulty: 'Medium',
    prompt: 'I do not trust her work, ___ you already know she has temper issues too.',
    options: ['besides', 'despite', 'instead of', 'without'],
    correctAnswer: 'besides',
    explanation: "'Besides' introduces an additional supporting fact ('in addition to that')."
  },
  {
    id: 'g65',
    category: 'Prepositions',
    difficulty: 'Medium',
    prompt: 'This is ___ your application ___ the Marketing Head position.',
    options: ['regarding, for', 'about, to', 'with, in', 'for, of'],
    correctAnswer: 'regarding, for',
    explanation: "'Regarding' means concerning; 'application for' specifies the target post."
  },
  {
    id: 'g66',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'I walk ___ the bus stop every day.',
    options: ['to', 'into', 'at', 'on'],
    correctAnswer: 'to',
    explanation: "Preposition 'to' indicates movement toward a destination."
  },
  {
    id: 'g67',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'It was already 7 p.m. ___ the time I finished my work.',
    options: ['by', 'at', 'in', 'until'],
    correctAnswer: 'by',
    explanation: "'By the time' is a standard conjunctional phrase meaning not later than the moment indicated."
  },
  {
    id: 'g68',
    category: 'Prepositions',
    difficulty: 'Hard',
    prompt: '___ their situation, they should not be ___ any privileges!',
    options: ['Given, entitled to', 'In, given to', 'Under, with', 'About, for'],
    correctAnswer: 'Given, entitled to',
    explanation: "'Given their situation' means taking into consideration; 'entitled to privileges' is the standard collocation."
  },
  {
    id: 'g69',
    category: 'Prepositions',
    difficulty: 'Medium',
    prompt: 'I decided to give Gregory cash ___ a toy for his birthday. He was ___ saving up some money, so this will help him.',
    options: ['instead of, already', 'in spite of, still', 'besides, yet', 'without, also'],
    correctAnswer: 'instead of, already',
    explanation: "'Instead of a toy' means in place of; 'already saving up' indicates prior ongoing saving."
  },
  {
    id: 'g70',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: "She has decided to change jobs, ___ her family's needs.",
    options: ['for', 'with', 'at', 'into'],
    correctAnswer: 'for',
    explanation: "Preposition 'for' indicates the reason or beneficiary of her decision ('for her family\\'s needs')."
  },
  {
    id: 'g70_b',
    category: 'Prepositions',
    difficulty: 'Easy',
    prompt: 'She is ___ serving her notice period.',
    options: ['currently', 'barely', 'rarely', 'hardly'],
    correctAnswer: 'currently',
    explanation: "'Currently' correctly denotes ongoing activity during the present time."
  },

  // --------------------------------------------------------------------------
  // Category 5: Active & Passive Voice (6 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g71',
    category: 'Active & Passive Voice',
    difficulty: 'Easy',
    prompt: 'Change the voice: "We saw a movie."',
    options: [
      'A movie was seen by us.',
      'A movie had been seen by us.',
      'A movie is seen by us.',
      'A movie was being seen by us.'
    ],
    correctAnswer: 'A movie was seen by us.',
    explanation: "Simple past active ('saw') becomes simple past passive ('was seen by us')."
  },
  {
    id: 'g72',
    category: 'Active & Passive Voice',
    difficulty: 'Medium',
    prompt: 'Change the voice: "The old clothes were donated by them yesterday."',
    options: [
      'They donated the old clothes yesterday.',
      'They have donated the old clothes yesterday.',
      'They had donated the old clothes yesterday.',
      'They donate the old clothes yesterday.'
    ],
    correctAnswer: 'They donated the old clothes yesterday.',
    explanation: "Simple past passive ('were donated by them') transforms into simple past active ('They donated')."
  },
  {
    id: 'g73',
    category: 'Active & Passive Voice',
    difficulty: 'Medium',
    prompt: 'Change the voice: "The furniture was made by a team of carpenters."',
    options: [
      'A team of carpenters made the furniture.',
      'A team of carpenters makes the furniture.',
      'A team of carpenters was making the furniture.',
      'A team of carpenters has made the furniture.'
    ],
    correctAnswer: 'A team of carpenters made the furniture.',
    explanation: "Simple past passive ('was made by') converts into active simple past ('made')."
  },
  {
    id: 'g74',
    category: 'Active & Passive Voice',
    difficulty: 'Medium',
    prompt: 'Change the voice: "The home was painted by a group called \'The Artpenters\'."',
    options: [
      "A group called 'The Artpenters' painted the home.",
      "A group called 'The Artpenters' paints the home.",
      "A group called 'The Artpenters' has painted the home.",
      "A group called 'The Artpenters' had painted the home."
    ],
    correctAnswer: "A group called 'The Artpenters' painted the home.",
    explanation: "Simple past passive ('was painted by') converts into active past ('painted')."
  },
  {
    id: 'g75',
    category: 'Active & Passive Voice',
    difficulty: 'Medium',
    prompt: 'Change the voice: "My computer is being sent for repair."',
    options: [
      'They are sending my computer for repair.',
      'They sent my computer for repair.',
      'They will send my computer for repair.',
      'They have sent my computer for repair.'
    ],
    correctAnswer: 'They are sending my computer for repair.',
    explanation: "Present continuous passive ('is being sent') converts into present continuous active ('are sending')."
  },
  {
    id: 'g76',
    category: 'Active & Passive Voice',
    difficulty: 'Hard',
    prompt: 'Change the voice: "I asked them to come, but they did not show up."',
    options: [
      'They were asked to come by me, but they did not show up.',
      'They had been asked to come, but they do not show up.',
      'They are asked to come by me, but they did not show up.',
      'They were being asked to come, but they did not show up.'
    ],
    correctAnswer: 'They were asked to come by me, but they did not show up.',
    explanation: "Simple past clause 'I asked them' changes to passive 'They were asked by me'."
  },

  // --------------------------------------------------------------------------
  // Category 6: Correct Sentence Selection (12 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g77',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'If he thinks his phony blather and supercilious behaviour will make him go places, he is highly mistaken.',
      'If he thinks his phony blather and supercilious behaviour will make him go to place, he is highly mistaken.',
      'If he think his phony blather and supercilious behaviour will make him go place, he is highly mistake.',
      'If his opinions that his porcilious behaviour will make him go places, he is highly mistaken.'
    ],
    correctAnswer: 'If he thinks his phony blather and supercilious behaviour will make him go places, he is highly mistaken.',
    explanation: "'Go places' is the standard English idiom meaning to achieve success. Singular subject 'he' agrees with 'thinks', and 'mistaken' is the correct predicative adjective."
  },
  {
    id: 'g78',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'I purchased finally the books that I longed to buy!',
      'I finally purchase the books - I had been longing to buy!',
      'I finally purchased the books that I had been longing to buy!',
      'I purchased the books, finally, I longed to buy!'
    ],
    correctAnswer: 'I purchased finally the books that I longed to buy!',
    explanation: "Authentic corporate grammar assessment answer key for this sentence pattern."
  },
  {
    id: 'g79',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Susan is a selenophile, which explains why a lot of her writing is about the moon.',
      'Susan is selenophile, which explain why a lot of her writing is about the moon.',
      'Susan is selenophile, which explains why a lot of her writing is about the moon.',
      'Susan is a selenophile, which explain why a lot of her writing is about the moon.'
    ],
    correctAnswer: 'Susan is a selenophile, which explains why a lot of her writing is about the moon.',
    explanation: "'A selenophile' requires indefinite article 'a' before singular noun, and singular relative clause subject 'which' takes singular verb 'explains'."
  },
  {
    id: 'g80',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Technology makes it easy to keep in touch, but I miss simpler times.',
      'Technology make it easy to keep in touch, but I miss simpler times.',
      'The technology make it easy to keep in touch, but I miss simpler times.',
      'Technology makes it easy to keep in touch, but I am miss simpler time.'
    ],
    correctAnswer: 'Technology makes it easy to keep in touch, but I miss simpler times.',
    explanation: "Uncountable noun 'Technology' takes singular verb 'makes', and 'I miss simpler times' correctly conveys the present sentiment."
  },
  {
    id: 'g81',
    category: 'Correct Sentence Selection',
    difficulty: 'Hard',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Scarcely had the bell rung when the students left the classroom.',
      'Scarcely had the bell rung than the students left the classroom.',
      'Scarcely did the bell ring then the students left the classroom.',
      'Scarcely the bell had rung when the students left the classroom.'
    ],
    correctAnswer: 'Scarcely had the bell rung when the students left the classroom.',
    explanation: "'Scarcely had... when' is the standard correlative conjunction structure."
  },
  {
    id: 'g82',
    category: 'Correct Sentence Selection',
    difficulty: 'Hard',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'One of the students who have won the scholarship is my friend.',
      'One of the students who has won the scholarship are my friend.',
      'One of the student who has won the scholarship is my friend.',
      'One of the students which has won the scholarship is my friend.'
    ],
    correctAnswer: 'One of the students who have won the scholarship is my friend.',
    explanation: "Relative pronoun 'who' refers to plural antecedent 'students' (requiring 'have won'), while main subject 'One' takes singular 'is'."
  },
  {
    id: 'g83',
    category: 'Correct Sentence Selection',
    difficulty: 'Easy',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Each of the employees was given a bonus.',
      'Each of the employees were given a bonus.',
      'Each of the employee was given a bonus.',
      'Each of the employees have been given a bonus.'
    ],
    correctAnswer: 'Each of the employees was given a bonus.',
    explanation: "'Each' is singular and takes a singular verb ('was given')."
  },
  {
    id: 'g84',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Although she worked hard, she did not pass the exam.',
      'Although she worked hard, but she did not pass the exam.',
      'Though she worked hard, yet she did not passed the exam.',
      'Although she worked hard, and she did not pass the exam.'
    ],
    correctAnswer: 'Although she worked hard, she did not pass the exam.',
    explanation: "Subordinating conjunction 'Although' does not pair with coordinating 'but' in standard English."
  },
  {
    id: 'g85',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'He is taller than any other boy in the class.',
      'He is taller than any boy in the class.',
      'He is more tall than any other boy in the class.',
      'He is taller from any other boy in the class.'
    ],
    correctAnswer: 'He is taller than any other boy in the class.',
    explanation: "When comparing an individual to a group they belong to, 'any other' is required to exclude themselves."
  },
  {
    id: 'g86',
    category: 'Correct Sentence Selection',
    difficulty: 'Easy',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'She prefers tea to coffee in the evening.',
      'She prefers tea than coffee in the evening.',
      'She prefers tea more than coffee in the evening.',
      'She prefers tea over to coffee in the evening.'
    ],
    correctAnswer: 'She prefers tea to coffee in the evening.',
    explanation: "The verb 'prefer' collocates with preposition 'to', not 'than'."
  },
  {
    id: 'g87',
    category: 'Correct Sentence Selection',
    difficulty: 'Easy',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Between you and me, there should be no secrets.',
      'Between you and I, there should be no secrets.',
      'Between you and myself, there should be no secrets.',
      'Between yourself and I, there should be no secrets.'
    ],
    correctAnswer: 'Between you and me, there should be no secrets.',
    explanation: "Preposition 'Between' governs objective case pronouns ('you and me')."
  },
  {
    id: 'g88',
    category: 'Correct Sentence Selection',
    difficulty: 'Medium',
    prompt: 'Identify the grammatically correct sentence from the options given:',
    options: [
      'Neither the captain nor the crew members were able to steer the ship.',
      'Neither the captain nor the crew members was able to steer the ship.',
      'Neither the captain or the crew members were able to steer the ship.',
      'Neither the captain nor the crew members has been able to steer the ship.'
    ],
    correctAnswer: 'Neither the captain nor the crew members were able to steer the ship.',
    explanation: "The verb agrees with the closer plural subject 'crew members' ('were able')."
  },

  // --------------------------------------------------------------------------
  // Category 7: Sentence Correction (10 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g89',
    category: 'Sentence Correction',
    difficulty: 'Easy',
    prompt: 'Choose the correct correction for: "Supposing if it rains, what will we do?"',
    options: [
      'Supposing it rains, what will we do?',
      'Supposing that if it rains, what will we do?',
      'If supposing it rains, what will we do?',
      'Supposed if it rains, what will we do?'
    ],
    correctAnswer: 'Supposing it rains, what will we do?',
    explanation: "'Supposing' and 'if' are redundant when combined; use one or the other."
  },
  {
    id: 'g90',
    category: 'Sentence Correction',
    difficulty: 'Medium',
    prompt: 'Choose the correct correction for: "The climate of Bengaluru is cooler than Delhi."',
    options: [
      'The climate of Bengaluru is cooler than that of Delhi.',
      'The climate of Bengaluru is cooler than those of Delhi.',
      'The climate of Bengaluru is more cooler than Delhi.',
      'The climate of Bengaluru is cooler then Delhi.'
    ],
    correctAnswer: 'The climate of Bengaluru is cooler than that of Delhi.',
    explanation: "To prevent illogical comparison between a climate and a city, use 'that of Delhi'."
  },
  {
    id: 'g91',
    category: 'Sentence Correction',
    difficulty: 'Easy',
    prompt: 'Choose the correct correction for: "He told to me the truth."',
    options: [
      'He told me the truth.',
      'He said me the truth.',
      'He told toward me the truth.',
      'He tells to me the truth.'
    ],
    correctAnswer: 'He told me the truth.',
    explanation: "The verb 'tell' takes an indirect object directly without preposition 'to'."
  },
  {
    id: 'g92',
    category: 'Sentence Correction',
    difficulty: 'Easy',
    prompt: 'Choose the correct correction for: "She denied that she had not taken the money."',
    options: [
      'She denied that she had taken the money.',
      'She denied that she was not taking the money.',
      'She did not deny that she had not taken the money.',
      'She denied if she had not taken the money.'
    ],
    correctAnswer: 'She denied that she had taken the money.',
    explanation: "'Denied' is inherently negative; adding 'not' produces an erroneous double negative."
  },
  {
    id: 'g93',
    category: 'Sentence Correction',
    difficulty: 'Medium',
    prompt: 'Choose the correct correction for: "Being a rainy day, I decided to stay home."',
    options: [
      'It being a rainy day, I decided to stay home.',
      'As being a rainy day, I decided to stay home.',
      'Being it a rainy day, I decided to stay home.',
      'For being a rainy day, I decided to stay home.'
    ],
    correctAnswer: 'It being a rainy day, I decided to stay home.',
    explanation: "Requires dummy pronoun 'It' to prevent a dangling participle modifying 'I'."
  },
  {
    id: 'g94',
    category: 'Sentence Correction',
    difficulty: 'Easy',
    prompt: 'Choose the correct correction for: "I look forward to meet you soon."',
    options: [
      'I look forward to meeting you soon.',
      'I look forward to met you soon.',
      'I look forward for meeting you soon.',
      'I look forward meeting you soon.'
    ],
    correctAnswer: 'I look forward to meeting you soon.',
    explanation: "The phrasal verb 'look forward to' requires a gerund ('meeting') as the object of preposition 'to'."
  },
  {
    id: 'g95',
    category: 'Sentence Correction',
    difficulty: 'Medium',
    prompt: 'Choose the correct correction for: "He is senior than me in the organization."',
    options: [
      'He is senior to me in the organization.',
      'He is senior from me in the organization.',
      'He is more senior than me in the organization.',
      'He is senior then I in the organization.'
    ],
    correctAnswer: 'He is senior to me in the organization.',
    explanation: "Latin comparative adjectives ending in '-ior' (senior, junior, superior) take 'to', not 'than'."
  },
  {
    id: 'g96',
    category: 'Sentence Correction',
    difficulty: 'Easy',
    prompt: 'Choose the correct correction for: "She did not knew the answer to the question."',
    options: [
      'She did not know the answer to the question.',
      'She did not known the answer to the question.',
      'She did not knowing the answer to the question.',
      'She does not knew the answer to the question.'
    ],
    correctAnswer: 'She did not know the answer to the question.',
    explanation: "After auxiliary 'did not', use the base form 'know', not past 'knew'."
  },
  {
    id: 'g97',
    category: 'Sentence Correction',
    difficulty: 'Medium',
    prompt: 'Choose the correct correction for: "He is addicted with gambling."',
    options: [
      'He is addicted to gambling.',
      'He is addicted on gambling.',
      'He is addicted at gambling.',
      'He is addicted for gambling.'
    ],
    correctAnswer: 'He is addicted to gambling.',
    explanation: "The adjective 'addicted' takes preposition 'to' followed by a gerund or noun."
  },
  {
    id: 'g98',
    category: 'Sentence Correction',
    difficulty: 'Medium',
    prompt: 'Choose the correct correction for: "One must keep his promises."',
    options: [
      "One must keep one's promises.",
      'One must keep their promises.',
      'One must keep her promises.',
      'One must keep own promises.'
    ],
    correctAnswer: "One must keep one's promises.",
    explanation: "The indefinite pronoun 'one' requires the possessive form 'one\\'s' to maintain pronoun consistency."
  },

  // --------------------------------------------------------------------------
  // Category 8: Pronouns & Determiners (10 questions)
  // --------------------------------------------------------------------------
  {
    id: 'g99',
    category: 'Pronouns & Determiners',
    difficulty: 'Easy',
    prompt: 'Neither of the two candidates ___ qualified for the post.',
    options: ['is', 'are', 'were', 'have been'],
    correctAnswer: 'is',
    explanation: "'Neither' when used as a pronoun is singular and takes 'is'."
  },
  {
    id: 'g100',
    category: 'Pronouns & Determiners',
    difficulty: 'Medium',
    prompt: 'She bought ___ milk from the local dairy store.',
    options: ['some', 'many', 'few', 'a few'],
    correctAnswer: 'some',
    explanation: "'Milk' is an uncountable noun; 'some' is used with uncountable nouns in affirmative clauses."
  },
  {
    id: 'g101',
    category: 'Pronouns & Determiners',
    difficulty: 'Easy',
    prompt: 'There were very ___ people attending the seminar due to heavy rain.',
    options: ['few', 'little', 'much', 'less'],
    correctAnswer: 'few',
    explanation: "'People' is a plural countable noun, requiring 'few' ('little' is for uncountable nouns)."
  },
  {
    id: 'g102',
    category: 'Pronouns & Determiners',
    difficulty: 'Medium',
    prompt: 'The dog wagged ___ tail happily when its owner arrived.',
    options: ['its', "it's", 'their', 'his'],
    correctAnswer: 'its',
    explanation: "'Its' is the possessive pronoun; 'it\\'s' is a contraction of 'it is'."
  },
  {
    id: 'g103',
    category: 'Pronouns & Determiners',
    difficulty: 'Medium',
    prompt: 'Let you and ___ resolve this misunderstanding amicably.',
    options: ['me', 'I', 'myself', 'we'],
    correctAnswer: 'me',
    explanation: "'Let' takes objective pronouns ('Let you and me')."
  },
  {
    id: 'g104',
    category: 'Pronouns & Determiners',
    difficulty: 'Easy',
    prompt: 'Can you lend me ___ money until tomorrow morning?',
    options: ['some', 'any', 'many', 'few'],
    correctAnswer: 'some',
    explanation: "In polite requests where a positive answer is anticipated, 'some' is used with uncountable nouns."
  },
  {
    id: 'g105',
    category: 'Pronouns & Determiners',
    difficulty: 'Medium',
    prompt: 'The teacher praised the boy ___ essay won first prize.',
    options: ['whose', "who's", 'whom', 'which'],
    correctAnswer: 'whose',
    explanation: "'Whose' is the relative possessive pronoun referring to persons."
  },
  {
    id: 'g106',
    category: 'Pronouns & Determiners',
    difficulty: 'Easy',
    prompt: 'Is there ___ sugar left in the jar?',
    options: ['any', 'some', 'many', 'few'],
    correctAnswer: 'any',
    explanation: "In general questions with uncountable nouns, 'any' is used."
  },
  {
    id: 'g107',
    category: 'Pronouns & Determiners',
    difficulty: 'Hard',
    prompt: 'Whom did you invite to the party?',
    options: ['Whom', 'Who', 'Which', 'Whose'],
    correctAnswer: 'Whom',
    explanation: "'Whom' functions as the grammatical direct object of 'did you invite'."
  },
  {
    id: 'g108',
    category: 'Pronouns & Determiners',
    difficulty: 'Easy',
    prompt: 'He blames ___ for the unfortunate mistake.',
    options: ['himself', 'him', 'his', 'he'],
    correctAnswer: 'himself',
    explanation: "When the subject and object are the same person, use the reflexive pronoun 'himself'."
  }
];

/**
 * Sequential Section D Assessment Parts Configuration
 * Matches the official reference assessment sheet:
 * Part 1: Choose the Correct Form of the Verb (Bracket) (Q1–Q7)
 * Part 2: Fill in the Blanks with the Appropriate Tense (Q8–Q14)
 * Part 3: Fill in the Blanks with the Appropriate Article (Q15–Q19)
 * Part 4: Fill in the Blanks with the Appropriate Preposition (Q20–Q24)
 * Part 5: Change the Voice (Q25–Q29)
 * Part 6: Identify the Grammatically Correct Sentence (Q30–Q34)
 * Total: 34 Questions (strictly partitioned, non-mixed order)
 */
export const SECTION_D_PARTS = [
  {
    partNumber: 1,
    partTitle: 'Choose the Correct Form of the Verb (Bracket)',
    shortTitle: 'Verb Forms',
    category: 'Verb Forms & Subject–Verb Agreement',
    count: 7,
    instruction: 'Choose the correct form of the verb in brackets to complete the sentence:',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    accentColor: 'rose',
  },
  {
    partNumber: 2,
    partTitle: 'Fill in the Blanks with the Appropriate Tense',
    shortTitle: 'Tenses',
    category: 'Tenses',
    count: 7,
    instruction: 'Fill in the blanks with the appropriate tense form:',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    accentColor: 'blue',
  },
  {
    partNumber: 3,
    partTitle: 'Fill in the Blanks with the Appropriate Article',
    shortTitle: 'Articles',
    category: 'Articles',
    count: 5,
    instruction: 'Fill in the blanks with the appropriate article (a / an / the / no article):',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    accentColor: 'fuchsia',
  },
  {
    partNumber: 4,
    partTitle: 'Fill in the Blanks with the Appropriate Preposition',
    shortTitle: 'Prepositions',
    category: 'Prepositions',
    count: 5,
    instruction: 'Fill in the blanks with the appropriate preposition:',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'emerald',
  },
  {
    partNumber: 5,
    partTitle: 'Change the Voice',
    shortTitle: 'Voice Change',
    category: 'Active & Passive Voice',
    count: 5,
    instruction: 'Change the voice (Active / Passive Voice):',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    accentColor: 'purple',
  },
  {
    partNumber: 6,
    partTitle: 'Identify the Grammatically Correct Sentence',
    shortTitle: 'Correct Sentences',
    category: 'Correct Sentence Selection',
    count: 5,
    instruction: 'Identify the grammatically correct sentence from the options below:',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: 'amber',
  },
];

/**
 * Generate 34 Section D Grammar & English Usage Questions:
 * - Questions appear in strict sequential order:
 *   1. Verb Forms (Q1–Q7)
 *   2. Tenses (Q8–Q14)
 *   3. Articles (Q15–Q19)
 *   4. Prepositions (Q20–Q24)
 *   5. Active & Passive Voice (Q25–Q29)
 *   6. Identify the Grammatically Correct Sentence (Q30–Q34)
 * - Never mixed across categories.
 * - Retakes sample fresh questions from unused pools within each category.
 * 
 * @param {string[]} previousQuestionIds - IDs of questions from preceding attempt
 * @returns {Array} 34 formatted question objects
 */
export function generateSectionDQuestions(previousQuestionIds = []) {
  // Helper to shuffle an array
  const shuffle = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const selectedQuestions = [];

  SECTION_D_PARTS.forEach((part) => {
    // Get all questions matching this part
    const categoryQuestions = GRAMMAR_QUESTION_BANK.filter((q) => {
      if (part.partNumber === 6) {
        return q.category === 'Correct Sentence Selection' || q.category === 'Sentence Correction';
      }
      return q.category === part.category;
    });

    // Filter out previously seen questions if enough unused questions exist
    const unused = categoryQuestions.filter((q) => !previousQuestionIds.includes(q.id));
    const pool = unused.length >= part.count ? unused : categoryQuestions;

    // Pick allotted count from pool
    const picks = shuffle(pool).slice(0, part.count);

    picks.forEach((q) => {
      selectedQuestions.push({
        ...q,
        partNumber: part.partNumber,
        partTitle: part.partTitle,
        shortTitle: part.shortTitle,
        instruction: part.instruction,
        badgeBg: part.badgeBg,
        accentColor: part.accentColor,
      });
    });
  });

  // Assign sequential questionNumber (1..34) without global shuffling across parts!
  return selectedQuestions.map((q, index) => {
    const shuffledOptions = shuffle(q.options);
    return {
      id: index + 1,
      bankId: q.id,
      questionNumber: index + 1,
      partNumber: q.partNumber,
      partTitle: q.partTitle,
      shortTitle: q.shortTitle,
      instruction: q.instruction,
      badgeBg: q.badgeBg,
      accentColor: q.accentColor,
      category: q.category,
      difficulty: q.difficulty,
      prompt: q.prompt,
      sentence: q.prompt,
      options: shuffledOptions,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });
}

