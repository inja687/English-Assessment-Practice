import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  X, 
  Headphones, 
  Cloud,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings as SettingsIcon,
  Info,
  AlertCircle,
  Play,
  Pause,
  Volume2,
  BookOpen
} from 'lucide-react';
import { generateSectionEQuestions } from '../data/sectionEStories';
import { saveAttempt, getPracticeTarget } from '../utils/storage';

/**
 * Section E Assessment Interface — Listening Comprehension
 * Authentic Assessment Design:
 * - Top dark navy header with candidate details, 10-minute timer, save state, finish test button.
 * - Light navigation toolbar with "5. Section - E", numbered tabs 1 to 12, "Attempted: X/12", Next button.
 * - 2-column workspace:
 *    - For Story items: Story briefing on left, audio playback player & status on right.
 *    - For MCQ items: Question prompt on left, 4 clean options (A, B, C, D) on right.
 * - Floating blue arrow button on right margin.
 * - Finish modal leading to Results Dashboard (/results).
 */
export default function SectionETest() {
  const navigate = useNavigate();

  // 10-Minute Continuous Section Timer (600 seconds)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(600);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // Active question index (0 to 11)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Panels
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // State of current attempt's stories and questions
  const [attemptData, setAttemptData] = useState(() => generateSectionEQuestions([]));
  const { stories, questions } = attemptData;
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Played state for each of the 4 stories: { [storyId]: boolean }
  const [playedStories, setPlayedStories] = useState({});

  // Active speech synthesis playback state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackError, setPlaybackError] = useState(null);

  // MCQ user answers: { [questionId]: selectedOptionString }
  const [answers, setAnswers] = useState({});

  // Revisit flags: { [questionId]: boolean }
  const [revisitFlags, setRevisitFlags] = useState({});

  // Practice benchmark target
  const [practiceTarget] = useState(() => getPracticeTarget());

  // Attempt tracking
  const attemptStartTimeRef = useRef(null);
  useEffect(() => {
    if (!attemptStartTimeRef.current) {
      attemptStartTimeRef.current = new Date().toISOString();
    }
  }, []);
  const hasSavedRef = useRef(false);

  // Review Filter in Results
  const [reviewFilter, setReviewFilter] = useState('all');

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const isStoryPlayback = currentQuestion?.type === 'story_playback';
  const associatedStory = stories.find((s) => s.id === currentQuestion?.storyId) || {
    id: currentQuestion?.storyId,
    title: currentQuestion?.storyTitle,
    category: currentQuestion?.category,
    script: currentQuestion?.script,
  };
  const isStoryPlayed = Boolean(playedStories[currentQuestion?.storyId]);
  const currentAnswer = answers[currentQuestion?.id];
  const isCurrentRevisit = Boolean(revisitFlags[currentQuestion?.id]);

  // Helper format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Stop speech synthesis
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Handle section timer expiration
  const handleTimeExpire = useCallback(() => {
    stopSpeech();
    setTimeExpired(true);
    setIsTestFinished(true);
  }, [stopSpeech]);

  // 10-Minute Countdown Timer
  useEffect(() => {
    if (isTestFinished) return;

    const timer = setInterval(() => {
      setSectionTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestFinished, handleTimeExpire]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Play Story Audio (Speech Synthesis, once per story)
  const handlePlayStoryAudio = (story) => {
    const textToSpeak = story?.script || story?.transcript || currentQuestion?.script || '';
    const storyKey = story?.id || currentQuestion?.storyId;

    if (!textToSpeak || (storyKey && playedStories[storyKey]) || isSpeaking) return;

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setPlaybackError('Speech playback is not supported in your browser.');
      return;
    }

    setPlaybackError(null);
    stopSpeech();

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 0.90; // Clear speaking rate
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (storyKey) {
          setPlayedStories((prev) => ({
            ...prev,
            [storyKey]: true,
          }));
        }
      };

      utterance.onerror = (e) => {
        console.warn('Playback error:', e);
        setIsSpeaking(false);
        if (storyKey) {
          setPlayedStories((prev) => ({
            ...prev,
            [storyKey]: true,
          }));
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Playback failed:', err);
      setIsSpeaking(false);
    }
  };

  // Select MCQ option
  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  // Toggle Revisit Later
  const handleToggleRevisit = () => {
    setRevisitFlags((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  // Navigation handlers
  const handleSelectQuestion = (idx) => {
    stopSpeech();
    setCurrentQuestionIndex(idx);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      handleSelectQuestion(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      handleSelectQuestion(currentQuestionIndex + 1);
    } else {
      setShowFinishModal(true);
    }
  };

  // Metrics: 8 MCQs + 4 stories
  const mcqQuestions = questions.filter((q) => q.isMCQ);
  const attemptedMCQCount = Object.keys(answers).length;
  const storiesPlayedCount = Object.keys(playedStories).length;
  const totalAttempted = attemptedMCQCount + storiesPlayedCount;
  const revisitCount = Object.values(revisitFlags).filter(Boolean).length;
  const unattemptedCount = 12 - totalAttempted;
  const timeUsed = 600 - sectionTimeRemaining;

  // Objective Scoring for 8 MCQs
  const scoring = useMemo(() => {
    let correct = 0;
    let incorrect = 0;

    mcqQuestions.forEach((q) => {
      const selected = answers[q.id];
      if (selected !== undefined) {
        if (selected === q.correctAnswer) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      }
    });

    const unanswered = mcqQuestions.length - (correct + incorrect);
    const scorePercent = mcqQuestions.length > 0 ? Math.round((correct / mcqQuestions.length) * 100) : 0;
    const metTarget = scorePercent >= practiceTarget;

    return {
      correct,
      incorrect,
      unanswered,
      scorePercent,
      metTarget,
    };
  }, [answers, mcqQuestions, practiceTarget]);

  // Save attempt to persistent storage & update cross-section analytics
  const saveSectionEAttempt = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const attemptedMCQ = Object.keys(answers).length;
    const playedCount = Object.keys(playedStories).length;
    const attempted = attemptedMCQ + playedCount;
    const currentUnattempted = 12 - attempted;
    const currentRevisit = Object.values(revisitFlags).filter(Boolean).length;
    const elapsed = Math.max(1, 600 - sectionTimeRemaining);

    saveAttempt({
      id: `att_section-e_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sectionId: 'section-e',
      sectionName: 'Section E — Listening Comprehension',
      startedAt: attemptStartTimeRef.current || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds: 600,
      timeUsedSeconds: elapsed,
      totalQuestions: 12,
      attemptedCount: attempted,
      unansweredCount: currentUnattempted,
      revisitCount: currentRevisit,
      isObjective: true,
      practiceTarget,
      correctCount: scoring.correct,
      incorrectCount: scoring.incorrect,
      scorePercent: scoring.scorePercent,
      metTarget: scoring.metTarget,
      storiesPlayedCount: playedCount,
      storyPerformance: stories.map((s) => ({
        storyId: s.id,
        title: s.title,
        played: Boolean(playedStories[s.id]),
      })),
      questionsReview: questionsRef.current.map((q) => {
        if (!q.isMCQ) {
          return {
            questionNumber: q.questionNumber,
            type: 'story_playback',
            prompt: `Listen to Story: ${q.storyTitle}`,
            isAttempted: Boolean(playedStories[q.storyId]),
            isRevisit: Boolean(revisitFlags[q.id]),
          };
        }
        return {
          questionNumber: q.questionNumber,
          type: 'mcq',
          prompt: q.question,
          storyTitle: q.storyTitle,
          userAnswer: answers[q.id] || null,
          correctAnswer: q.correctAnswer,
          isCorrect: answers[q.id] === q.correctAnswer,
          isAttempted: answers[q.id] !== undefined,
          isRevisit: Boolean(revisitFlags[q.id]),
          explanation: q.explanation,
          options: q.options,
        };
      }),
    });
  }, [sectionTimeRemaining, practiceTarget, scoring, stories, playedStories, answers, revisitFlags]);

  // Finish confirmation
  const handleConfirmFinish = () => {
    stopSpeech();
    saveSectionEAttempt();
    setShowFinishModal(false);
    setIsTestFinished(true);
  };

  // Finish and view full portal results
  const handleFinishAndProceedToResults = () => {
    stopSpeech();
    saveSectionEAttempt();
    setShowFinishModal(false);
    navigate('/results');
  };

  // Retake Section E
  const handleRetakeSectionE = () => {
    stopSpeech();
    hasSavedRef.current = false;
    attemptStartTimeRef.current = new Date().toISOString();
    const previousStoryIds = stories.map((s) => s.id);
    const newAttempt = generateSectionEQuestions(previousStoryIds);
    setAttemptData(newAttempt);
    setPlayedStories({});
    setAnswers({});
    setRevisitFlags({});
    setSectionTimeRemaining(600);
    setIsTestFinished(false);
    setTimeExpired(false);
    setCurrentQuestionIndex(0);
  };

  // Fallback save effect
  useEffect(() => {
    if (isTestFinished && !hasSavedRef.current) {
      saveSectionEAttempt();
    }
  }, [isTestFinished, saveSectionEAttempt]);

  // ----------------------------------------------------
  // Summary Screen (rendered upon finishing or timeout)
  // ----------------------------------------------------
  if (isTestFinished) {
    const filteredReviewQuestions = mcqQuestions.filter((q) => {
      const isAns = answers[q.id] !== undefined;
      const isCorr = isAns && answers[q.id] === q.correctAnswer;
      if (reviewFilter === 'incorrect') return isAns && !isCorr;
      if (reviewFilter === 'unanswered') return !isAns;
      if (reviewFilter === 'revisit') return Boolean(revisitFlags[q.id]);
      return true;
    });

    return (
      <div className="min-h-screen bg-[#07192f] p-4 sm:p-8 flex flex-col justify-start items-center">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section E Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Section E Summary — Listening Comprehension
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {timeExpired 
                ? 'Time expired (10:00 limit reached). Review your comprehension breakdown below.' 
                : 'You have concluded Section E and completed the full mock assessment!'}
            </p>
          </div>

          {/* Score Banner */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            scoring.metTarget ? 'bg-emerald-50/80 border-emerald-300' : 'bg-purple-50/80 border-purple-300'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 mb-1">
                Comprehension MCQ Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black ${scoring.metTarget ? 'text-emerald-700' : 'text-purple-700'}`}>
                  {scoring.scorePercent}%
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  ({scoring.correct} of 8 correct)
                </span>
              </div>
              <span className="text-xs text-slate-600 mt-1 block">
                Practice Benchmark: <strong>{practiceTarget}%</strong> • Stories Played: <strong>{storiesPlayedCount} of 4</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-center px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl font-bold text-emerald-600">{scoring.correct}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Correct</span>
              </div>
              <div className="text-center px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl font-bold text-rose-600">{scoring.incorrect}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Incorrect</span>
              </div>
              <div className="text-center px-3 py-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="block text-xl font-bold text-purple-600">{storiesPlayedCount}/4</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Stories</span>
              </div>
            </div>
          </div>

          {/* Time Used Tile */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Total Section Time Used: <strong>{formatTime(timeUsed)}</strong> (out of 10:00)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">10-Minute Maximum</span>
          </div>

          {/* All Sections Completed Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider mb-1">
                Full Assessment Complete
              </span>
              <h3 className="text-lg font-bold">
                All 5 Sections Completed Successfully!
              </h3>
              <p className="text-xs text-blue-100">
                View your complete performance analytics, score trends, and recording history on the Results Dashboard.
              </p>
            </div>

            <Link
              to="/results"
              id="btn-view-full-results"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-white text-indigo-700 hover:bg-blue-50 shadow-md transition shrink-0"
            >
              <span>View Results & Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Question Review Section with Filter */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                MCQ Question Review ({filteredReviewQuestions.length})
              </h3>
              <div className="flex items-center gap-1.5 text-xs">
                {['all', 'incorrect', 'unanswered', 'revisit'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setReviewFilter(f)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition ${
                      reviewFilter === f 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
              {filteredReviewQuestions.map((q) => {
                const userAns = answers[q.id];
                const isCorr = userAns === q.correctAnswer;
                const isUnans = userAns === undefined;

                return (
                  <div key={q.id} className="p-4 bg-white space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                          {q.questionNumber}
                        </span>
                        <span className="font-semibold text-purple-700 uppercase tracking-wider text-[11px]">
                          Story: {q.storyTitle}
                        </span>
                      </div>

                      {isUnans ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600 text-[11px]">
                          Unanswered
                        </span>
                      ) : isCorr ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 text-[11px] flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>

                    <p className="text-slate-800 font-medium text-sm">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>Your Answer: <strong className={isCorr ? 'text-emerald-700' : 'text-rose-700'}>{userAns || 'None'}</strong></div>
                      <div>Correct Answer: <strong className="text-emerald-700">{q.correctAnswer}</strong></div>
                    </div>

                    {q.explanation && (
                      <p className="text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-100 italic">
                        Explanation: {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Link
                to="/results"
                id="btn-proceed-to-results-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <span>Go to Results Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                id="btn-retake-section-e"
                onClick={handleRetakeSectionE}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Section E</span>
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                to="/sections"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                All Sections
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
            English Assessment Practice • Developed By <strong className="text-slate-600 font-semibold">Injamamul</strong>
          </div>
        </div>
      </div>
    );
  }


  // ----------------------------------------------------
  // Main Assessment Interface
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans select-none relative">
      {/* 1. TOP HEADER (Dark Navy-Blue matching Screenshot) */}
      <header className="bg-[#06182c] border-b border-[#0d2745] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between z-30 shrink-0 gap-2">
        {/* Left: Branding & Candidate Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>

          <div className="leading-tight min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate block">
              Chandrashekar Durgam
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
              <span className="hidden sm:inline">Voice Assessment /</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Cloud className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="hidden md:inline">Saved: 30 seconds ago</span>
                <span className="md:hidden">Saved</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Section Timer, Utilities & Finish Test Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Developed By Attribution Badge */}
          <div className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
            <span className="text-slate-400">Developed By</span>
            <strong className="text-white font-semibold">Injamamul</strong>
          </div>

          <div 
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-mono font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-800 px-2 py-1 sm:px-3 sm:py-1.5 rounded border border-slate-700 cursor-pointer"
            title="Section Time Countdown"
          >
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-400 text-xs hidden sm:inline">Section Time:</span>
            <span className="font-bold text-white tracking-wider">
              {formatTime(sectionTimeRemaining)}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5 hidden xs:inline" />
          </div>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition hidden sm:inline-flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="text-slate-300 hover:text-white p-1 sm:p-1.5 rounded hover:bg-slate-800 transition"
            title="Section Information"
          >
            <SettingsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            id="btn-finish-test"
            onClick={() => setShowFinishModal(true)}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded text-xs font-semibold bg-transparent hover:bg-rose-900/50 text-white border border-slate-500 hover:border-slate-300 transition whitespace-nowrap"
          >
            Finish Test
          </button>
        </div>
      </header>

      {/* 2. QUESTION NAVIGATION TOOLBAR */}
      <div className="bg-[#f4f6f8] border-b border-[#e2e8f0] px-3 sm:px-6 py-2 flex items-center justify-between z-20 shrink-0 gap-2">
        {/* Left: Section dropdown & Info icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-white border border-slate-300 rounded px-2 sm:px-3 py-1 text-xs text-slate-800 font-medium shadow-2xs whitespace-nowrap">
            <span>5. Section - E</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </div>

          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="bg-white border border-slate-300 rounded p-1 sm:px-2 sm:py-1 text-slate-600 hover:text-slate-900 text-xs flex items-center justify-center shadow-2xs transition"
            title="Section Instructions"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Desktop: Question Navigation Tabs 1 to 12 & Attempted counter */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isCompleted = !q.isMCQ ? Boolean(playedStories[q.storyId]) : answers[q.id] !== undefined;

                let itemClasses = 'px-2.5 py-1 text-xs font-semibold border-r border-slate-200 last:border-r-0 transition';
                if (isCurrent) {
                  itemClasses += ' bg-[#0c59cf] text-white';
                } else if (isCompleted) {
                  itemClasses += ' text-emerald-700 bg-emerald-50 hover:bg-emerald-100';
                } else {
                  itemClasses += ' text-slate-700 hover:bg-slate-100';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    id={`btn-nav-q-${q.questionNumber}`}
                    onClick={() => handleSelectQuestion(idx)}
                    className={itemClasses}
                  >
                    {q.questionNumber}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-tight">
            Attempted: {totalAttempted}/12
          </span>
        </div>

        {/* Center Mobile (< md): Compact Nav with Q X/12 + Attempted */}
        <div className="flex md:hidden items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="p-1 rounded bg-white border border-slate-300 text-slate-600 disabled:opacity-30"
            title="Previous Question"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 py-1 rounded bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-2xs">
            Q {currentQuestionIndex + 1}/{questions.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="p-1 rounded bg-white border border-slate-300 text-slate-600 disabled:opacity-30"
            title="Next Question"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded whitespace-nowrap hidden xs:inline">
            {totalAttempted}/12
          </span>
        </div>

        {/* Right: Next button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-toolbar-next"
            onClick={handleNext}
            className="px-3 sm:px-4 py-1 rounded bg-[#0c59cf] md:bg-white hover:bg-[#094ab0] md:hover:bg-slate-50 text-white md:text-slate-700 md:hover:text-slate-900 md:border md:border-slate-300 text-xs font-semibold shadow-2xs transition whitespace-nowrap"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      {/* 3. TWO-COLUMN WORKSPACE WITH THIN VERTICAL DIVIDER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {/* LEFT COLUMN (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e8f0] overflow-y-visible md:overflow-y-auto shrink-0 md:shrink">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Question {currentQuestion.questionNumber}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                {isStoryPlayback ? 'Story Audio' : `Story: ${associatedStory?.title || currentQuestion.storyTitle}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleRevisit}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded transition ${
                isCurrentRevisit 
                  ? 'text-amber-800 bg-amber-100 font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isCurrentRevisit ? 'fill-amber-600 text-amber-600' : 'text-slate-500'}`} />
              <span>Revisit Later</span>
            </button>
          </div>

          {isStoryPlayback ? (
            /* Story Playback Left Column */
            <div className="space-y-4">
              <p className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                Listen carefully to the audio story below. Each story can only be played once.
              </p>

              <div className="p-4 sm:p-6 rounded-md bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {associatedStory?.title || currentQuestion.storyTitle}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Topic: <strong>{associatedStory?.category || currentQuestion.category}</strong> • Approximate Duration: <strong>~25s</strong>
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded text-xs">
                  Important: Pay close attention to character actions, key dates, names, and decisions. You will answer questions immediately afterward.
                </div>
              </div>
            </div>
          ) : (
            /* Comprehension MCQ Left Column */
            <div className="space-y-4">
              <p className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
                Answer the comprehension question based on the story you heard:
              </p>

              <div className="p-4 sm:p-6 rounded-md bg-slate-50/80 border border-slate-200/80 text-slate-900 text-base sm:text-lg leading-relaxed font-normal">
                {currentQuestion.prompt || currentQuestion.question}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 md:p-10 flex flex-col justify-between overflow-y-visible md:overflow-y-auto bg-white">
          {isStoryPlayback ? (
            /* Story Playback Right Column */
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-900">
                  Audio Story Player
                </span>
                <span className="text-slate-500 text-xs">
                  Plays Allowed: <strong>1 of 1</strong>
                </span>
              </div>

              {/* Status Banner */}
              {playbackError && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{playbackError}</span>
                </div>
              )}
              {isSpeaking ? (
                <div className="p-3 sm:p-3.5 rounded bg-[#e8f0fe] border border-[#d2e3fc] text-[#1967d2] text-xs flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
                  <Volume2 className="w-4 h-4 shrink-0 text-[#1967d2] animate-pulse" />
                  <span className="font-medium">
                    Story playback in progress. Listen carefully through your headset.
                  </span>
                </div>
              ) : isStoryPlayed ? (
                <div className="p-3 sm:p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">
                    Story playback finished. Click Next to answer related questions.
                  </span>
                </div>
              ) : (
                <div className="p-3 sm:p-3.5 rounded bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs flex items-center gap-2.5 shadow-2xs">
                  <Info className="w-4 h-4 shrink-0 text-[#b06000]" />
                  <span className="font-medium">
                    Click Play Story Audio whenever you are ready.
                  </span>
                </div>
              )}

              {/* Player Card & Waveform */}
              <div className="flex flex-col items-center justify-center py-4 sm:py-6">
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-slate-200 bg-[#fbfcfd] flex flex-col items-center justify-center shadow-xs">
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-25" />
                  )}

                  <Headphones className={`w-7 h-7 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 transition ${isSpeaking ? 'text-purple-600 animate-pulse' : 'text-slate-700'}`} />

                  <span className="text-xs font-bold text-slate-800 tracking-tight">
                    {isSpeaking ? 'Playing Story...' : isStoryPlayed ? 'Listened' : 'Ready to Play'}
                  </span>
                </div>

                {/* Sleek Dark Rounded Waveform Bar */}
                <div className="w-full max-w-xs sm:max-w-md mt-4 sm:mt-6 h-9 sm:h-10 rounded-full bg-[#081729] border border-slate-800 flex items-center justify-center px-4 overflow-hidden shadow-inner">
                  {isSpeaking ? (
                    <div className="flex items-center gap-1.5 w-full justify-center">
                      {[16, 24, 38, 52, 28, 44, 60, 32, 20, 48, 64, 36, 18, 50, 26, 40].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-gradient-to-t from-purple-400 to-indigo-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.max(8, h / 2.2)}px`,
                            animationDuration: `${0.4 + (i % 5) * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <div className="h-0.5 w-3/4 bg-slate-700 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Play Button */}
                <div className="mt-4 sm:mt-5 w-full sm:w-auto flex justify-center">
                  <button
                    type="button"
                    onClick={() => handlePlayStoryAudio(associatedStory)}
                    disabled={isStoryPlayed || isSpeaking}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded text-xs font-bold transition shadow-xs ${
                      isStoryPlayed 
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : isSpeaking 
                          ? 'bg-purple-700 text-white cursor-wait'
                          : 'bg-[#0c59cf] hover:bg-[#094ab0] text-white'
                    }`}
                  >
                    {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? 'Playing...' : isStoryPlayed ? 'Story Already Played' : 'Play Story Audio'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MCQ Options Right Column */
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-900">
                  Select your answer
                </span>
                <span className="text-slate-500 text-xs">
                  Multiple Choice • 1 Option
                </span>
              </div>

              {/* Notification Banner */}
              {currentAnswer !== undefined ? (
                <div className="p-3 sm:p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">
                    Option selected: <strong>{currentAnswer}</strong>. You may update your choice or proceed.
                  </span>
                </div>
              ) : (
                <div className="p-3 sm:p-3.5 rounded bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs flex items-center gap-2.5 shadow-2xs">
                  <Info className="w-4 h-4 shrink-0 text-[#b06000]" />
                  <span className="font-medium">
                    Select the option that best answers the comprehension question.
                  </span>
                </div>
              )}

              {/* 4 Clean Options (A, B, C, D) */}
              <div className="space-y-3 pt-1 sm:pt-2">
                {currentQuestion.options?.map((opt, idx) => {
                  const optLetter = String.fromCharCode(65 + idx);
                  const isSelected = currentAnswer === opt;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border-2 flex items-center gap-3 sm:gap-3.5 transition group ${
                        isSelected
                          ? 'border-[#0c59cf] bg-blue-50/60 text-slate-900 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                        isSelected 
                          ? 'bg-[#0c59cf] text-white' 
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}>
                        {optLetter}
                      </span>
                      <span className="text-sm sm:text-base font-normal leading-snug">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING BLUE ARROW BUTTON ON RIGHT MARGIN (Desktop only to prevent obstructing mobile content) */}
      <button
        type="button"
        id="btn-floating-next"
        onClick={handleNext}
        className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-40 w-9 h-12 rounded bg-[#0c59cf] hover:bg-[#094ab0] text-white items-center justify-center shadow-lg transition transform hover:scale-105"
        title={currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
      >
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* FINISH TEST CONFIRMATION MODAL */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block">
                  Section E
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Finish Section E & Complete Assessment?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are completing Section E. Submitting will score your answers and complete your full assessment attempt.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Attempted tasks:</span>
                <strong className="text-emerald-700 font-bold">{totalAttempted} of 12</strong>
              </div>
              <div className="flex justify-between">
                <span>Unattempted tasks:</span>
                <strong className={unattemptedCount > 0 ? 'text-amber-700' : 'text-slate-700'}>{unattemptedCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Marked for Revisit:</span>
                <strong>{revisitCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Time remaining:</span>
                <strong>{formatTime(sectionTimeRemaining)}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition"
              >
                Keep Practicing
              </button>

              <button
                type="button"
                id="btn-confirm-finish-section-e"
                onClick={handleConfirmFinish}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Summary
              </button>

              <button
                type="button"
                id="btn-finish-and-proceed-to-results"
                onClick={handleFinishAndProceedToResults}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-[#0c59cf] hover:bg-[#094ab0] shadow-xs transition"
              >
                <span>Complete & View Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION INFORMATION MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-600" />
                <span>Section E Guidelines & Instructions</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                <strong>Structure:</strong> 12 Items total (4 Spoken Narrative Stories + 8 Multiple-Choice Comprehension Questions).
              </p>
              <p>
                <strong>Rules:</strong> Each audio story can only be played once. Answer the MCQs based on the facts and sequence of events in the story.
              </p>
              <p>
                <strong>Time Limit:</strong> 10 minutes total section duration.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
