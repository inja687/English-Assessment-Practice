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
  LayoutGrid
} from 'lucide-react';
import { generateSectionDQuestions, SECTION_D_PARTS } from '../data/sectionDQuestions';
import { saveAttempt, getPracticeTarget } from '../utils/storage';

/**
 * Section D Assessment Interface — Grammar & English Usage
 * Authentic Assessment Design:
 * - Top dark navy header with candidate details, 15-minute timer, save state, finish test button.
 * - Light navigation toolbar with "4. Section - D", 10-window pager across 34 questions, "Attempted: X/34", Next button.
 * - 2-column workspace: Question sentence with blank on left, 4 clean options (A, B, C, D) on right.
 * - Floating blue arrow button on right margin.
 * - Finish modal unlocking Section E and proceeding to /section-e/intro.
 */
export default function SectionDTest() {
  const navigate = useNavigate();

  // 15-Minute Section Countdown Timer (900 seconds)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(900);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // Active question index (0 to 33)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Pager offset for question toolbar (showing 10 numbers at a time)
  const [customPagerOffset, setCustomPagerOffset] = useState(null);
  const pagerOffset = customPagerOffset !== null ? customPagerOffset : Math.min(24, Math.floor(currentQuestionIndex / 10) * 10);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Panels
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  // Questions generated for this attempt (34 questions)
  const [questions, setQuestions] = useState(() => generateSectionDQuestions([]));
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // User responses: { [questionId]: selectedOptionString }
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
  const currentAnswer = answers[currentQuestion?.id];
  const isCurrentRevisit = Boolean(revisitFlags[currentQuestion?.id]);

  // Helper format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Handle section timer expiration
  const handleTimeExpire = useCallback(() => {
    setTimeExpired(true);
    setIsTestFinished(true);
  }, []);

  // 15-Minute Countdown Timer
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

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Handle Option Selection
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

  // Metrics
  const attemptedCount = Object.keys(answers).length;
  const unattemptedCount = questions.length - attemptedCount;
  const revisitCount = Object.values(revisitFlags).filter(Boolean).length;
  const timeUsed = 900 - sectionTimeRemaining;

  // Objective Scoring Calculations
  const scoring = useMemo(() => {
    let correct = 0;
    let incorrect = 0;
    const categoryStats = {};

    questions.forEach((q) => {
      const selected = answers[q.id];
      const isAnswered = selected !== undefined;
      const isCorrect = isAnswered && selected === q.correctAnswer;

      if (!categoryStats[q.category]) {
        categoryStats[q.category] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
      }
      categoryStats[q.category].total += 1;

      if (isCorrect) {
        correct += 1;
        categoryStats[q.category].correct += 1;
      } else if (isAnswered) {
        incorrect += 1;
        categoryStats[q.category].incorrect += 1;
      } else {
        categoryStats[q.category].unanswered += 1;
      }
    });

    const scorePercent = Math.round((correct / questions.length) * 100);
    const metTarget = scorePercent >= practiceTarget;

    return {
      correct,
      incorrect,
      unanswered: questions.length - (correct + incorrect),
      scorePercent,
      metTarget,
      categoryStats,
    };
  }, [answers, questions, practiceTarget]);

  // Save attempt to storage & unlock Section E
  const saveSectionDAttempt = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const currentAttempted = Object.keys(answers).length;
    const currentUnattempted = questionsRef.current.length - currentAttempted;
    const currentRevisit = Object.values(revisitFlags).filter(Boolean).length;
    const elapsed = Math.max(1, 900 - sectionTimeRemaining);

    saveAttempt({
      id: `att_section-d_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sectionId: 'section-d',
      sectionName: 'Section D — Grammar & English Usage',
      startedAt: attemptStartTimeRef.current || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds: 900,
      timeUsedSeconds: elapsed,
      totalQuestions: 34,
      attemptedCount: currentAttempted,
      unansweredCount: currentUnattempted,
      revisitCount: currentRevisit,
      isObjective: true,
      practiceTarget,
      correctCount: scoring.correct,
      incorrectCount: scoring.incorrect,
      scorePercent: scoring.scorePercent,
      metTarget: scoring.metTarget,
      categoryPerformance: scoring.categoryStats,
      questionsReview: questionsRef.current.map((q) => ({
        questionNumber: q.questionNumber,
        partNumber: q.partNumber,
        category: q.category,
        sentence: q.sentence || q.prompt,
        prompt: q.prompt,
        userAnswer: answers[q.id] || null,
        correctAnswer: q.correctAnswer,
        isCorrect: answers[q.id] === q.correctAnswer,
        isAttempted: answers[q.id] !== undefined,
        isRevisit: Boolean(revisitFlags[q.id]),
        explanation: q.explanation,
        options: q.options,
      })),
    });
  }, [sectionTimeRemaining, practiceTarget, scoring, answers, revisitFlags]);

  // Finish confirmation
  const handleConfirmFinish = () => {
    saveSectionDAttempt();
    setShowFinishModal(false);
    setIsTestFinished(true);
  };

  // Finish and proceed to Section E
  const handleFinishAndProceedToSectionE = () => {
    saveSectionDAttempt();
    setShowFinishModal(false);
    navigate('/section-e/intro');
  };

  // Retake Section D
  const handleRetakeSectionD = () => {
    hasSavedRef.current = false;
    attemptStartTimeRef.current = new Date().toISOString();
    const previousIds = questions.map((q) => q.bankId);
    const newQuestions = generateSectionDQuestions(previousIds);
    setQuestions(newQuestions);
    setAnswers({});
    setRevisitFlags({});
    setSectionTimeRemaining(900);
    setIsTestFinished(false);
    setTimeExpired(false);
    setCurrentQuestionIndex(0);
  };

  // Fallback save effect
  useEffect(() => {
    if (isTestFinished && !hasSavedRef.current) {
      saveSectionDAttempt();
    }
  }, [isTestFinished, saveSectionDAttempt]);

  // Questions to display in toolbar (10-window pager)
  const displayedQuestionNumbers = questions.slice(pagerOffset, pagerOffset + 10);

  // ----------------------------------------------------
  // Summary Screen (rendered upon finishing or timeout)
  // ----------------------------------------------------
  if (isTestFinished) {
    const filteredReviewQuestions = questions.filter((q) => {
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section D Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Section D Summary — Grammar & English Usage
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {timeExpired 
                ? 'Time expired (15:00 limit reached). Review your detailed score below.' 
                : 'You have concluded Section D. Your scores have been calculated and Section E is unlocked.'}
            </p>
          </div>

          {/* Score Banner */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            scoring.metTarget ? 'bg-emerald-50/80 border-emerald-300' : 'bg-amber-50/80 border-amber-300'
          }`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-500 mb-1">
                Your Practice Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-black ${scoring.metTarget ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {scoring.scorePercent}%
                </span>
                <span className="text-sm font-semibold text-slate-600">
                  ({scoring.correct} of 34 correct)
                </span>
              </div>
              <span className="text-xs text-slate-600 mt-1 block">
                Practice Benchmark: <strong>{practiceTarget}%</strong> • {scoring.metTarget ? 'Target Achieved' : 'Below Practice Target'}
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
                <span className="block text-xl font-bold text-slate-600">{scoring.unanswered}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Unanswered</span>
              </div>
            </div>
          </div>

          {/* Time Used Tile */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Total Section Time Used: <strong>{formatTime(timeUsed)}</strong> (out of 15:00)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">15-Minute Maximum</span>
          </div>

          {/* Next Module: Section E Navigation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100 border-2 border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white uppercase tracking-wider">
                Next Assessment Section (Unlocked)
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ready for Section E — Listening Comprehension?
              </h3>
              <p className="text-xs text-slate-600">
                12 Questions (4 Audio Stories + 8 Comprehension MCQs) • 10 Minutes
              </p>
            </div>

            <Link
              to="/section-e/intro"
              id="btn-proceed-to-section-e-main"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition shrink-0"
            >
              <span>Proceed to Section E</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Question Review Section with Filter */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Question Review ({filteredReviewQuestions.length})
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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-6 h-6 rounded bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                          {q.questionNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${q.badgeBg || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                          Part {q.partNumber || ''}: {q.shortTitle || q.category}
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
                      {q.sentence}
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
                to="/section-e/intro"
                id="btn-proceed-to-section-e-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
              >
                <span>Proceed to Section E</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                id="btn-retake-section-d"
                onClick={handleRetakeSectionD}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Section D</span>
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
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
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
            <span>4. Section - D</span>
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

        {/* Center Desktop: Question Navigation Pager < 1 2 3 ... 10 > & Attempted: X/34 */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (pagerOffset > 0) setCustomPagerOffset(Math.max(0, pagerOffset - 5));
                handlePrev();
              }}
              disabled={currentQuestionIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
              {displayedQuestionNumbers.map((q) => {
                const idx = q.questionNumber - 1;
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = answers[q.id] !== undefined;

                let itemClasses = 'px-2.5 py-1 text-xs font-semibold border-r border-slate-200 last:border-r-0 transition';
                if (isCurrent) {
                  itemClasses += ' bg-[#0c59cf] text-white';
                } else if (isAnswered) {
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
              onClick={() => {
                if (pagerOffset + 10 < questions.length) setCustomPagerOffset(Math.min(24, pagerOffset + 5));
                handleNext();
              }}
              disabled={currentQuestionIndex === questions.length - 1}
              className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
              title="Next Question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Grid icon toggle */}
            <button
              type="button"
              onClick={() => setShowQuestionGrid((g) => !g)}
              className="p-1.5 ml-1 rounded border border-slate-300 bg-white text-slate-600 hover:text-slate-900 shadow-2xs"
              title="Toggle All 34 Questions Palette"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-tight">
            Attempted: {attemptedCount}/34
          </span>
        </div>

        {/* Center Mobile (< md): Compact Nav with Q X/34 + Palette + Attempted */}
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

          <button
            type="button"
            onClick={() => setShowQuestionGrid(true)}
            className="px-2 py-1 rounded bg-white border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1 shadow-2xs"
            title="Question Palette"
          >
            <span>Q {currentQuestionIndex + 1}/{questions.length}</span>
            <LayoutGrid className="w-3 h-3 text-slate-500" />
          </button>

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
            {attemptedCount}/34
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

      {/* Quick Grid Palette for 34 Questions grouped by Authentic Parts */}
      {showQuestionGrid && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 shadow-inner z-10 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Question Palette (34 Questions)
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                • Organized strictly in sequence (Parts 1 to 6)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowQuestionGrid(false)}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-2 py-0.5 rounded hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {SECTION_D_PARTS.map((part) => {
              const partQuestions = questions.filter((q) => q.partNumber === part.partNumber);
              const answeredCount = partQuestions.filter((q) => answers[q.id] !== undefined).length;
              const isCurrentPart = currentQuestion?.partNumber === part.partNumber;

              return (
                <div 
                  key={part.partNumber} 
                  className={`p-2.5 rounded-lg border bg-white shadow-2xs transition ${
                    isCurrentPart ? 'border-blue-400 ring-1 ring-blue-200' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${part.badgeBg}`}>
                      Part {part.partNumber}: {part.shortTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {answeredCount}/{partQuestions.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {partQuestions.map((q) => {
                      const idx = q.questionNumber - 1;
                      const isCurrent = idx === currentQuestionIndex;
                      const isAnswered = answers[q.id] !== undefined;
                      const isRevisit = Boolean(revisitFlags[q.id]);

                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            handleSelectQuestion(idx);
                            setShowQuestionGrid(false);
                          }}
                          className={`relative w-7 h-7 rounded text-xs font-bold border transition flex items-center justify-center ${
                            isCurrent 
                              ? 'bg-[#0c59cf] text-white border-[#0c59cf] ring-2 ring-blue-300' 
                              : isAnswered 
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200' 
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                          }`}
                          title={`Q${q.questionNumber}: ${q.shortTitle}`}
                        >
                          {q.questionNumber}
                          {isRevisit && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TWO-COLUMN WORKSPACE WITH THIN VERTICAL DIVIDER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {/* LEFT COLUMN: Question sentence and category (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e8f0] overflow-y-visible md:overflow-y-auto shrink-0 md:shrink">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Question {currentQuestion.questionNumber}
              </h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${currentQuestion.badgeBg || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                Part {currentQuestion.partNumber}: {currentQuestion.shortTitle || currentQuestion.category}
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

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-100/90 border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                {currentQuestion.partTitle || `Part ${currentQuestion.partNumber}`}
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {currentQuestion.instruction || 'Choose the correct option to complete the sentence:'}
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-md bg-slate-50/80 border border-slate-200/80 text-slate-900 text-base sm:text-lg leading-relaxed font-normal">
              {currentQuestion.prompt || currentQuestion.sentence}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Options Workspace (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 md:p-10 flex flex-col justify-between overflow-y-visible md:overflow-y-auto bg-white">
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
                  Select the option that best completes the sentence.
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                  Section D
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Finish Section D & Proceed?
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
              You are completing Section D. Submitting will score your answers and <strong>unlock Section E (Listening Comprehension)</strong>.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Attempted questions:</span>
                <strong className="text-emerald-700 font-bold">{attemptedCount} of 34</strong>
              </div>
              <div className="flex justify-between">
                <span>Unattempted questions:</span>
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
                id="btn-confirm-finish-section-d"
                onClick={handleConfirmFinish}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Summary
              </button>

              <button
                type="button"
                id="btn-finish-and-proceed-to-e"
                onClick={handleFinishAndProceedToSectionE}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-[#0c59cf] hover:bg-[#094ab0] shadow-xs transition"
              >
                <span>Proceed to Section E</span>
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
                <Info className="w-4 h-4 text-amber-600" />
                <span>Section D Guidelines & Instructions</span>
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
                <strong>Structure:</strong> 34 Multiple-Choice Questions covering English grammar and syntax.
              </p>
              <p>
                <strong>Time Limit:</strong> 15 minutes continuous countdown.
              </p>
              <p>
                <strong>Sequential Unlocking:</strong> Finishing Section D automatically unlocks Section E (Listening Comprehension).
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
