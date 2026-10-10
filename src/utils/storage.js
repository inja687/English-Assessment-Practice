/**
 * Storage Utility for Practice Portal
 * Manages attempt history, unified attempt models, and practice configuration settings in localStorage.
 * 
 * Label: Browser-local storage (localStorage). No external backend required.
 */

export const STORAGE_KEYS = {
  ATTEMPTS: 'voice_assessment_attempts_v1',
  SETTINGS: 'voice_assessment_settings_v1',
  PRACTICE_TARGET: 'voice_assessment_practice_target_v1',
  COMPLETED_SECTIONS: 'voice_assessment_completed_sections_v1',
};

// Cross-environment safe storage helper (Browser localStorage + Node memory fallback)
const memoryStorage = new Map();
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch {}
    return memoryStorage.has(key) ? memoryStorage.get(key) : null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, String(val));
        return;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, String(val));
        return;
      }
    } catch {}
    memoryStorage.set(key, String(val));
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
        return;
      }
    } catch {}
    memoryStorage.delete(key);
  },
};

export const SECTION_SEQUENCE = ['section-a', 'section-b', 'section-c', 'section-d', 'section-e'];

export const SECTION_NAMES = {
  'section-a': 'Section A — Audio Quality Assessment',
  'section-b': 'Section B — Reading and Listening',
  'section-c': 'Section C — Speak for One Minute',
  'section-d': 'Section D — Grammar & English Usage',
  'section-e': 'Section E — Listening Comprehension',
};

export const DEFAULT_PRACTICE_TARGET = 60; // Configurable personal practice benchmark (default 60%)

export const DEFAULT_SETTINGS = {
  targetScore: 60, // percentage practice target (default 60%)
  timerAlertMinutes: 2, // warning alert before time ends
  autoAdvance: false, // auto advance after recording ends
  micVolumeGain: 1.0,
  enableSoundEffects: true,
  practiceDifficulty: 'standard', // 'standard' | 'challenging'
};

/**
 * Get the current personal practice target percentage (default: 60%)
 * @returns {number} Practice target percentage (e.g. 60)
 */
export const getPracticeTarget = () => {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.PRACTICE_TARGET);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 20 && parsed <= 100) {
        return parsed;
      }
    }
    const settings = getSettings();
    if (settings && typeof settings.targetScore === 'number') {
      return settings.targetScore;
    }
    return DEFAULT_PRACTICE_TARGET;
  } catch (err) {
    console.error('Failed to read practice target:', err);
    return DEFAULT_PRACTICE_TARGET;
  }
};

/**
 * Save updated practice target percentage
 * @param {number} target - Percentage target (e.g. 60)
 * @returns {number} Updated target
 */
export const savePracticeTarget = (target) => {
  try {
    const num = Math.max(20, Math.min(100, Math.round(Number(target) || DEFAULT_PRACTICE_TARGET)));
    safeStorage.setItem(STORAGE_KEYS.PRACTICE_TARGET, String(num));
    // Also sync with settings.targetScore
    const settings = getSettings();
    saveSettings({ ...settings, targetScore: num });
    return num;
  } catch (err) {
    console.error('Failed to save practice target:', err);
    return DEFAULT_PRACTICE_TARGET;
  }
};

/**
 * Get all saved practice attempts, newest first
 * @returns {Array} List of attempt objects
 */
export const getAttempts = () => {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each attempt has basic integrity
    return parsed.filter((item) => item && typeof item === 'object' && item.id);
  } catch (error) {
    console.error('Failed to read attempts from localStorage:', error);
    return [];
  }
};

/**
 * Get an attempt by its unique ID
 * @param {string} id - Attempt ID
 * @returns {Object|null} Attempt record or null
 */
export const getAttemptById = (id) => {
  if (!id) return null;
  const attempts = getAttempts();
  return attempts.find((a) => a.id === id) || null;
};

/**
 * Save a new practice attempt
 * Prevents duplicates and maintains historical records
 * @param {Object} attempt - Attempt record conforming to unified data model
 * @returns {Object|null} Saved attempt record or null on error
 */
export const saveAttempt = (attempt) => {
  try {
    if (!attempt || typeof attempt !== 'object') {
      console.error('Invalid attempt object passed to saveAttempt');
      return null;
    }

    const attempts = getAttempts();
    
    // Prevent duplicate saves with the exact same ID
    const existingIndex = attempts.findIndex((a) => a.id === attempt.id);
    if (existingIndex !== -1) {
      console.warn(`Attempt with ID ${attempt.id} already exists in history. Skipping duplicate save.`);
      return attempts[existingIndex];
    }

    const uniqueId = attempt.id || `att_${attempt.sectionId || 'unknown'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const normalizedAttempt = {
      id: uniqueId,
      sectionId: attempt.sectionId || 'unknown',
      sectionName: attempt.sectionName || 'Assessment Section',
      startedAt: attempt.startedAt || nowIso,
      submittedAt: attempt.submittedAt || nowIso,
      timestamp: attempt.submittedAt || nowIso, // for backward-compatibility
      durationSeconds: Number(attempt.durationSeconds) || 600,
      timeUsedSeconds: Number(attempt.timeUsedSeconds) || 0,
      totalQuestions: Number(attempt.totalQuestions) || 0,
      attemptedCount: Number(attempt.attemptedCount) || 0,
      unansweredCount: Number(attempt.unansweredCount) || 0,
      revisitCount: Number(attempt.revisitCount) || 0,
      isObjective: Boolean(attempt.isObjective),
      practiceTarget: Number(attempt.practiceTarget) || getPracticeTarget(),
      
      // Objective fields (Sections D and E)
      correctCount: attempt.correctCount !== undefined ? Number(attempt.correctCount) : undefined,
      incorrectCount: attempt.incorrectCount !== undefined ? Number(attempt.incorrectCount) : undefined,
      scorePercent: attempt.scorePercent !== undefined ? Number(attempt.scorePercent) : undefined,
      metTarget: attempt.metTarget !== undefined ? Boolean(attempt.metTarget) : undefined,
      score: attempt.scorePercent !== undefined ? Number(attempt.scorePercent) : undefined, // legacy backward-compat
      
      // Section D specifics
      categoryPerformance: attempt.categoryPerformance || undefined,
      
      // Section E specifics
      storyPerformance: attempt.storyPerformance || undefined,
      storiesPlayedCount: attempt.storiesPlayedCount !== undefined ? Number(attempt.storiesPlayedCount) : undefined,
      
      // Sections A, B, C recording specifics
      recordingStatus: attempt.recordingStatus || undefined,
      
      // Detailed question-by-question review items (no raw audio blobs stored!)
      questionsReview: Array.isArray(attempt.questionsReview) ? attempt.questionsReview : [],
    };

    const updated = [normalizedAttempt, ...attempts];
    safeStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));

    // Automatically mark the submitted section as completed to unlock next section
    if (normalizedAttempt.sectionId) {
      markSectionCompleted(normalizedAttempt.sectionId);
    }

    return normalizedAttempt;
  } catch (error) {
    console.error('Failed to save attempt to localStorage:', error);
    return null;
  }
};

/**
 * Get all completed section IDs from persistent storage
 * @returns {Array<string>} Array of completed section IDs (e.g. ['section-a'])
 */
export const getCompletedSections = () => {
  try {
    const set = new Set();
    const raw = safeStorage.getItem(STORAGE_KEYS.COMPLETED_SECTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => set.add(id));
      }
    }
    // Also merge sections from existing saved attempts in history
    const attempts = getAttempts();
    attempts.forEach((a) => {
      if (a && a.sectionId) {
        set.add(a.sectionId);
      }
    });
    return Array.from(set);
  } catch (err) {
    console.error('Failed to get completed sections:', err);
    return [];
  }
};

/**
 * Mark a section as completed and persistently save to localStorage
 * @param {string} sectionId - Section identifier (e.g. 'section-a')
 * @returns {Array<string>} Updated completed section IDs
 */
export const markSectionCompleted = (sectionId) => {
  try {
    if (!sectionId || typeof sectionId !== 'string') return getCompletedSections();
    const current = getCompletedSections();
    if (!current.includes(sectionId)) {
      const updated = [...current, sectionId];
      safeStorage.setItem(STORAGE_KEYS.COMPLETED_SECTIONS, JSON.stringify(updated));
      return updated;
    }
    return current;
  } catch (err) {
    console.error('Failed to mark section completed:', err);
    return getCompletedSections();
  }
};

/**
 * Check if a section is unlocked according to strict sequential locking rules:
 * Section A -> Section B -> Section C -> Section D -> Section E
 * @param {string} sectionId - Section identifier
 * @returns {boolean} Whether the section is unlocked
 */
export const isSectionUnlocked = (sectionId) => {
  if (!sectionId) return false;
  // Section A is always unlocked first
  if (sectionId === 'section-a') return true;

  const index = SECTION_SEQUENCE.indexOf(sectionId);
  if (index <= 0) {
    // If unknown section, default to true or false; for sequence items index must be > 0
    return true;
  }

  const precedingSection = SECTION_SEQUENCE[index - 1];
  const completed = getCompletedSections();
  return completed.includes(precedingSection);
};

/**
 * Get the preceding section required to unlock the specified section
 * @param {string} sectionId - Section identifier
 * @returns {{ id: string, name: string } | null}
 */
export const getPrecedingSection = (sectionId) => {
  const index = SECTION_SEQUENCE.indexOf(sectionId);
  if (index <= 0) return null;
  const prevId = SECTION_SEQUENCE[index - 1];
  return {
    id: prevId,
    name: SECTION_NAMES[prevId] || prevId,
  };
};

/**
 * Get the latest unlocked section in the sequential chain
 * @returns {string} Section ID (defaults to 'section-a')
 */
export const getLatestUnlockedSection = () => {
  for (let i = SECTION_SEQUENCE.length - 1; i >= 0; i--) {
    const id = SECTION_SEQUENCE[i];
    if (isSectionUnlocked(id)) {
      return id;
    }
  }
  return 'section-a';
};

/**
 * Clear all attempt history from localStorage
 * @returns {boolean} Success status
 */
export const clearAttempts = () => {
  try {
    safeStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    safeStorage.removeItem(STORAGE_KEYS.COMPLETED_SECTIONS);
    return true;
  } catch (error) {
    console.error('Failed to clear attempts:', error);
    return false;
  }
};

/**
 * Reset section locking back to initial state (only Section A unlocked)
 * @returns {boolean}
 */
export const resetSectionLocking = () => {
  try {
    safeStorage.removeItem(STORAGE_KEYS.COMPLETED_SECTIONS);
    return true;
  } catch (err) {
    console.error('Failed to reset section locking:', err);
    return false;
  }
};

/**
 * Get current portal settings
 * @returns {Object} Settings object
 */
export const getSettings = () => {
  try {
    const raw = safeStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch (error) {
    console.error('Failed to read settings from localStorage:', error);
    return { ...DEFAULT_SETTINGS };
  }
};

/**
 * Save updated portal settings
 * @param {Object} newSettings - Updated settings
 * @returns {Object} Updated settings
 */
export const saveSettings = (newSettings) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...newSettings };
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Reset settings to default values
 * @returns {Object} Default settings
 */
export const resetSettings = () => {
  try {
    safeStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    safeStorage.setItem(STORAGE_KEYS.PRACTICE_TARGET, String(DEFAULT_PRACTICE_TARGET));
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Failed to reset settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Calculate comprehensive cross-section performance analytics
 * @param {Array} attempts - List of attempt records
 * @returns {Object} Aggregated analytics object
 */
export const calculatePerformanceAnalytics = (attempts = []) => {
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return {
      totalAttempts: 0,
      totalCompletedSections: 0,
      overallMCQAnswered: 0,
      overallMCQCorrect: 0,
      overallMCQAccuracy: 0,
      latestAttemptDate: null,
      recentBySection: {
        'section-a': null,
        'section-b': null,
        'section-c': null,
        'section-d': null,
        'section-e': null,
      },
      sectionDAnalytics: {
        attemptsCount: 0,
        latestScore: null,
        previousScore: null,
        scoreTrend: null,
        categoryBreakdown: {},
        weakCategories: [],
      },
      sectionEAnalytics: {
        attemptsCount: 0,
        latestScore: null,
        previousScore: null,
        scoreTrend: null,
        storiesPlayedTotal: 0,
        mcqsAnsweredTotal: 0,
        mcqsCorrectTotal: 0,
      },
      recordingAnalytics: {
        sectionA: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
        sectionB: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
        sectionC: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
      },
    };
  }

  const totalAttempts = attempts.length;
  const latestAttempt = attempts[0];
  const latestAttemptDate = latestAttempt?.submittedAt || latestAttempt?.timestamp || null;

  // Track most recent attempt per section
  const recentBySection = {
    'section-a': null,
    'section-b': null,
    'section-c': null,
    'section-d': null,
    'section-e': null,
  };

  attempts.forEach((att) => {
    const secId = att.sectionId;
    if (recentBySection[secId] === null && secId in recentBySection) {
      recentBySection[secId] = att;
    }
  });

  // Calculate MCQ overall stats (Sections D and E)
  let overallMCQAnswered = 0;
  let overallMCQCorrect = 0;

  attempts.forEach((att) => {
    if (att.isObjective && typeof att.correctCount === 'number') {
      const answered = att.attemptedCount || (att.correctCount + (att.incorrectCount || 0));
      overallMCQAnswered += answered;
      overallMCQCorrect += att.correctCount;
    }
  });

  const overallMCQAccuracy = overallMCQAnswered > 0 
    ? Math.round((overallMCQCorrect / overallMCQAnswered) * 100) 
    : 0;

  // Section D Analysis
  const sectionDAttempts = attempts.filter((a) => a.sectionId === 'section-d');
  const dLatest = sectionDAttempts[0] || null;
  const dPrev = sectionDAttempts[1] || null;
  let dTrend = null;
  if (dLatest && dPrev && typeof dLatest.scorePercent === 'number' && typeof dPrev.scorePercent === 'number') {
    const diff = dLatest.scorePercent - dPrev.scorePercent;
    dTrend = diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%';
  }

  // Aggregate category stats across all Section D attempts
  const categoryBreakdown = {};
  sectionDAttempts.forEach((att) => {
    if (att.categoryPerformance && typeof att.categoryPerformance === 'object') {
      Object.entries(att.categoryPerformance).forEach(([cat, stat]) => {
        if (!categoryBreakdown[cat]) {
          categoryBreakdown[cat] = { total: 0, correct: 0, accuracy: 0 };
        }
        categoryBreakdown[cat].total += stat.total || 0;
        categoryBreakdown[cat].correct += stat.correct || 0;
      });
    }
  });

  Object.keys(categoryBreakdown).forEach((cat) => {
    const item = categoryBreakdown[cat];
    item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
  });

  const weakCategories = Object.entries(categoryBreakdown)
    .map(([cat, stat]) => ({ category: cat, ...stat }))
    .filter((c) => c.accuracy < 65 && c.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy);

  // Section E Analysis
  const sectionEAttempts = attempts.filter((a) => a.sectionId === 'section-e');
  const eLatest = sectionEAttempts[0] || null;
  const ePrev = sectionEAttempts[1] || null;
  let eTrend = null;
  if (eLatest && ePrev && typeof eLatest.scorePercent === 'number' && typeof ePrev.scorePercent === 'number') {
    const diff = eLatest.scorePercent - ePrev.scorePercent;
    eTrend = diff > 0 ? `+${diff}%` : diff < 0 ? `${diff}%` : '0%';
  }

  let eStoriesPlayed = 0;
  let eMCQsAnswered = 0;
  let eMCQsCorrect = 0;
  sectionEAttempts.forEach((att) => {
    eStoriesPlayed += att.storiesPlayedCount || 0;
    eMCQsAnswered += (att.correctCount || 0) + (att.incorrectCount || 0);
    eMCQsCorrect += att.correctCount || 0;
  });

  // Recording sections (A, B, C)
  const recordingAnalytics = {
    sectionA: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
    sectionB: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
    sectionC: { attempts: 0, totalCompleted: 0, totalExpected: 0 },
  };

  attempts.forEach((att) => {
    if (att.sectionId === 'section-a') {
      recordingAnalytics.sectionA.attempts += 1;
      recordingAnalytics.sectionA.totalCompleted += att.attemptedCount || 0;
      recordingAnalytics.sectionA.totalExpected += att.totalQuestions || 5;
    } else if (att.sectionId === 'section-b') {
      recordingAnalytics.sectionB.attempts += 1;
      recordingAnalytics.sectionB.totalCompleted += att.attemptedCount || 0;
      recordingAnalytics.sectionB.totalExpected += att.totalQuestions || 18;
    } else if (att.sectionId === 'section-c') {
      recordingAnalytics.sectionC.attempts += 1;
      recordingAnalytics.sectionC.totalCompleted += att.attemptedCount || 0;
      recordingAnalytics.sectionC.totalExpected += att.totalQuestions || 3;
    }
  });

  return {
    totalAttempts,
    totalCompletedSections: totalAttempts,
    overallMCQAnswered,
    overallMCQCorrect,
    overallMCQAccuracy,
    latestAttemptDate,
    recentBySection,
    sectionDAnalytics: {
      attemptsCount: sectionDAttempts.length,
      latestScore: dLatest?.scorePercent ?? null,
      previousScore: dPrev?.scorePercent ?? null,
      scoreTrend: dTrend,
      categoryBreakdown,
      weakCategories,
    },
    sectionEAnalytics: {
      attemptsCount: sectionEAttempts.length,
      latestScore: eLatest?.scorePercent ?? null,
      previousScore: ePrev?.scorePercent ?? null,
      scoreTrend: eTrend,
      storiesPlayedTotal: eStoriesPlayed,
      mcqsAnsweredTotal: eMCQsAnswered,
      mcqsCorrectTotal: eMCQsCorrect,
    },
    recordingAnalytics,
  };
};
