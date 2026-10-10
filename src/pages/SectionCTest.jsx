import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  ArrowRight, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
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
  Timer
} from 'lucide-react';
import { generateSectionCQuestions } from '../data/sectionCQuestions';
import { saveAttempt } from '../utils/storage';

const CHECKLIST_ITEMS = [
  { key: 'spokeMostTime', label: 'I spoke for most of the available time.' },
  { key: 'stayedOnTopic', label: 'I stayed on the given topic.' },
  { key: 'usedCompleteSentences', label: 'I used complete English sentences.' },
  { key: 'voiceClearAudible', label: 'My voice was clear and audible.' },
  { key: 'avoidedLongPauses', label: 'I avoided long unnecessary pauses.' },
];

/**
 * Section C Assessment Interface — Speak for One Minute
 * Authentic Assessment Design:
 * - Top dark navy header with candidate details, timer, save state, finish test button.
 * - Light navigation toolbar with "3. Section - C", < 1 2 3 >, "Attempted: X/3", Next.
 * - 2-column workspace with topic details on left, circular recording indicator & dark waveform bar on right.
 * - Floating blue arrow button on right margin.
 * - Finish modal unlocking Section D and proceeding to /section-d/intro.
 */
export default function SectionCTest() {
  const navigate = useNavigate();

  // 10-Minute Continuous Section Timer (600 seconds)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(600);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // Attempt tracking
  const attemptStartTimeRef = useRef(null);
  useEffect(() => {
    if (!attemptStartTimeRef.current) {
      attemptStartTimeRef.current = new Date().toISOString();
    }
  }, []);
  const hasSavedRef = useRef(false);

  // Active question index (0 to 2)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Questions generated for this attempt (3 topics)
  const [questions, setQuestions] = useState(() => generateSectionCQuestions([]));
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // Per-question state map
  const [questionStates, setQuestionStates] = useState(() => {
    const initial = {};
    for (let i = 1; i <= 3; i++) {
      initial[i] = {
        hasStartedPrep: i === 1,
        prepRemaining: 30,
        prepCompleted: false,
        isAttempted: false,
        isRevisit: false,
        audioBlob: null,
        audioUrl: null,
        recordedDuration: 0,
        checklist: {
          spokeMostTime: false,
          stayedOnTopic: false,
          usedCompleteSentences: false,
          voiceClearAudible: false,
          avoidedLongPauses: false,
        },
      };
    }
    return initial;
  });

  const questionStatesRef = useRef(questionStates);
  useEffect(() => {
    questionStatesRef.current = questionStates;
  }, [questionStates]);

  // Recording State (60s limit)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  // User Playback State
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const userAudioPlayerRef = useRef(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const prepTimerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentState = questionStates[currentQuestion?.id || 1] || {
    hasStartedPrep: true,
    prepRemaining: 30,
    prepCompleted: false,
    isAttempted: false,
    isRevisit: false,
    audioBlob: null,
    audioUrl: null,
    recordedDuration: 0,
    checklist: {},
  };

  // Helper format MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Cleanup helper for mic stream
  const stopMicStream = useCallback(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      audioStreamRef.current = null;
    }
  }, []);

  // Stop recording helper
  const stopCurrentRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
  }, []);

  // Stop prep timer
  const stopPrepTimer = useCallback(() => {
    if (prepTimerRef.current) {
      clearInterval(prepTimerRef.current);
      prepTimerRef.current = null;
    }
  }, []);

  // Handle section timer expiration
  const handleTimeExpire = useCallback(() => {
    stopCurrentRecording();
    stopPrepTimer();
    setTimeExpired(true);
    setIsTestFinished(true);
  }, [stopCurrentRecording, stopPrepTimer]);

  // Section 10-minute timer
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

  // Prep timer effect
  useEffect(() => {
    if (isTestFinished) return;
    const qId = currentQuestion?.id;
    if (!qId) return;

    const st = questionStatesRef.current[qId];
    if (st && st.hasStartedPrep && !st.prepCompleted && !st.isAttempted && !isRecording) {
      stopPrepTimer();
      prepTimerRef.current = setInterval(() => {
        setQuestionStates((prev) => {
          const currentPrep = prev[qId]?.prepRemaining ?? 30;
          if (currentPrep <= 1) {
            clearInterval(prepTimerRef.current);
            return {
              ...prev,
              [qId]: {
                ...prev[qId],
                prepRemaining: 0,
                prepCompleted: true,
              },
            };
          }
          return {
            ...prev,
            [qId]: {
              ...prev[qId],
              prepRemaining: currentPrep - 1,
            },
          };
        });
      }, 1000);
    }

    return () => stopPrepTimer();
  }, [currentQuestion?.id, isRecording, isTestFinished, stopPrepTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPrepTimer();
      stopMicStream();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      Object.values(questionStatesRef.current).forEach((st) => {
        if (st.audioUrl) {
          URL.revokeObjectURL(st.audioUrl);
        }
      });
    };
  }, [stopMicStream, stopPrepTimer]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Skip prep
  const handleSkipPrep = () => {
    stopPrepTimer();
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        prepRemaining: 0,
        prepCompleted: true,
      },
    }));
  };

  // Start 60s recording
  const startCurrentRecording = async () => {
    setRecordingError(null);
    stopPrepTimer();

    // Ensure prep is marked completed
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        prepRemaining: 0,
        prepCompleted: true,
      },
    }));

    if (!navigator?.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setRecordingError('Your browser does not support audio recording.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];

      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stopMicStream();
        if (audioChunksRef.current.length > 0) {
          const type = recorder.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type });
          const url = URL.createObjectURL(blob);

          setQuestionStates((prev) => ({
            ...prev,
            [currentQuestion.id]: {
              ...prev[currentQuestion.id],
              isAttempted: true,
              audioBlob: blob,
              audioUrl: url,
              recordedDuration: 60,
            },
          }));
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 59) {
            stopCurrentRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.warn('Mic error:', err);
      stopMicStream();
      setRecordingError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access.'
          : `Unable to access microphone: ${err.message}`
      );
    }
  };

  // Playback user recorded answer
  const handleTogglePlayResponse = () => {
    if (!userAudioPlayerRef.current || !currentState.audioUrl) return;

    if (isPlayingResponse) {
      userAudioPlayerRef.current.pause();
      setIsPlayingResponse(false);
    } else {
      userAudioPlayerRef.current.play().then(() => {
        setIsPlayingResponse(true);
      }).catch((e) => console.warn(e));
    }
  };

  // Toggle Revisit Later
  const handleToggleRevisit = () => {
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        isRevisit: !prev[currentQuestion.id].isRevisit,
      },
    }));
  };

  // Toggle checklist item
  const handleToggleChecklist = (key) => {
    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        checklist: {
          ...prev[currentQuestion.id]?.checklist,
          [key]: !prev[currentQuestion.id]?.checklist?.[key],
        },
      },
    }));
  };

  // Navigation handlers
  const handleSelectQuestion = (idx) => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopPrepTimer();
    if (isPlayingResponse && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      setIsPlayingResponse(false);
    }

    const nextQId = questions[idx]?.id;
    if (nextQId) {
      setQuestionStates((prev) => ({
        ...prev,
        [nextQId]: {
          ...prev[nextQId],
          hasStartedPrep: true,
        },
      }));
    }

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
  const attemptedCount = Object.values(questionStates).filter((s) => s.isAttempted).length;
  const revisitCount = Object.values(questionStates).filter((s) => s.isRevisit).length;
  const unattemptedCount = questions.length - attemptedCount;
  const timeUsed = 600 - sectionTimeRemaining;

  // Save attempt to storage & unlock Section D
  const saveSectionCAttempt = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const currentAttempted = Object.values(questionStatesRef.current).filter((s) => s.isAttempted).length;
    const currentRevisit = Object.values(questionStatesRef.current).filter((s) => s.isRevisit).length;
    const currentUnattempted = questionsRef.current.length - currentAttempted;
    const elapsed = Math.max(1, 600 - sectionTimeRemaining);

    saveAttempt({
      id: `att_section-c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sectionId: 'section-c',
      sectionName: 'Section C — Speak for One Minute',
      startedAt: attemptStartTimeRef.current || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds: 600,
      timeUsedSeconds: elapsed,
      totalQuestions: 3,
      attemptedCount: currentAttempted,
      unansweredCount: currentUnattempted,
      revisitCount: currentRevisit,
      isObjective: false,
      recordingStatus: {
        totalRecordingsExpected: 3,
        completedRecordings: currentAttempted,
      },
      questionsReview: questionsRef.current.map((q) => ({
        questionNumber: q.questionNumber,
        prompt: q.title,
        topic: q.title,
        isAttempted: Boolean(questionStatesRef.current[q.id]?.isAttempted),
        recordedDuration: questionStatesRef.current[q.id]?.recordedDuration || 0,
        isRevisit: Boolean(questionStatesRef.current[q.id]?.isRevisit),
        checklist: questionStatesRef.current[q.id]?.checklist || {},
      })),
    });
  }, [sectionTimeRemaining]);

  // Finish confirmation
  const handleConfirmFinish = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopPrepTimer();
    saveSectionCAttempt();
    setShowFinishModal(false);
    setIsTestFinished(true);
  };

  // Finish and proceed to Section D
  const handleFinishAndProceedToSectionD = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopPrepTimer();
    saveSectionCAttempt();
    setShowFinishModal(false);
    navigate('/section-d/intro');
  };

  // Retake Section C
  const handleRetakeSectionC = () => {
    hasSavedRef.current = false;
    attemptStartTimeRef.current = new Date().toISOString();
    Object.values(questionStatesRef.current).forEach((st) => {
      if (st.audioUrl) {
        URL.revokeObjectURL(st.audioUrl);
      }
    });

    const previousIds = questions.map((q) => q.id);
    const newQuestions = generateSectionCQuestions(previousIds);
    setQuestions(newQuestions);

    const resetStates = {};
    for (let i = 1; i <= 3; i++) {
      resetStates[i] = {
        hasStartedPrep: i === 1,
        prepRemaining: 30,
        prepCompleted: false,
        isAttempted: false,
        isRevisit: false,
        audioBlob: null,
        audioUrl: null,
        recordedDuration: 0,
        checklist: {
          spokeMostTime: false,
          stayedOnTopic: false,
          usedCompleteSentences: false,
          voiceClearAudible: false,
          avoidedLongPauses: false,
        },
      };
    }

    setQuestionStates(resetStates);
    setSectionTimeRemaining(600);
    setIsTestFinished(false);
    setTimeExpired(false);
    setCurrentQuestionIndex(0);
    setIsRecording(false);
    setRecordingSeconds(0);
    setRecordingError(null);
  };

  // Fallback save effect
  useEffect(() => {
    if (isTestFinished && !hasSavedRef.current) {
      saveSectionCAttempt();
    }
  }, [isTestFinished, saveSectionCAttempt]);

  // ----------------------------------------------------
  // Summary Screen (rendered upon finishing or timeout)
  // ----------------------------------------------------
  if (isTestFinished) {
    return (
      <div className="min-h-screen bg-[#07192f] p-4 sm:p-8 flex flex-col justify-start items-center">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section C Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Section C Summary — Speak for One Minute
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {timeExpired 
                ? 'Time expired (10:00 limit reached). Review your attempt breakdown below.' 
                : 'You have concluded Section C. Your spoken discourses are saved and Section D is unlocked.'}
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-slate-900">3</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Questions</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <span className="block text-2xl font-bold text-emerald-700">{attemptedCount}</span>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase">Completed Recordings</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-slate-700">{unattemptedCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Unattempted</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
              <span className="block text-2xl font-bold text-amber-700">{revisitCount}</span>
              <span className="text-[11px] font-semibold text-amber-700 uppercase">Marked Revisit</span>
            </div>
          </div>

          {/* Time Used */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Total Section Time Used: <strong>{formatTime(timeUsed)}</strong> (out of 10:00)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">10-Minute Maximum</span>
          </div>

          {/* Next Module: Section D Navigation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 border-2 border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider">
                Next Assessment Section (Unlocked)
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ready for Section D — Grammar & English Usage?
              </h3>
              <p className="text-xs text-slate-600">
                34 Questions • 15 Minutes
              </p>
            </div>

            <Link
              to="/section-d/intro"
              id="btn-proceed-to-section-d-main"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition shrink-0"
            >
              <span>Proceed to Section D</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Link
                to="/section-d/intro"
                id="btn-proceed-to-section-d-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition"
              >
                <span>Proceed to Section D</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                id="btn-retake-section-c"
                onClick={handleRetakeSectionC}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Section C</span>
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
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
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
            <span>3. Section - C</span>
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

        {/* Center Desktop: Question Navigation Tabs & Attempted counter */}
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
                const st = questionStates[q.id];

                let itemClasses = 'px-3 py-1 text-xs font-semibold border-r border-slate-200 last:border-r-0 transition';
                if (isCurrent) {
                  itemClasses += ' bg-[#0c59cf] text-white';
                } else if (st?.isAttempted) {
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
            Attempted: {attemptedCount}/3
          </span>
        </div>

        {/* Center Mobile (< md): Compact Nav with Q X/3 + Attempted */}
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
            {attemptedCount}/3
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
        {/* LEFT COLUMN: Speaking topic prompt details (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e8f0] overflow-y-visible md:overflow-y-auto shrink-0 md:shrink">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Question {currentQuestion.questionNumber}
              </h2>
              {currentQuestion.category && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {currentQuestion.category}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggleRevisit}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded transition ${
                currentState.isRevisit 
                  ? 'text-amber-800 bg-amber-100 font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${currentState.isRevisit ? 'fill-amber-600 text-amber-600' : 'text-slate-500'}`} />
              <span>Revisit Later</span>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
              Speak for one minute on the topic given below.
            </p>

            <div className="p-4 sm:p-6 rounded-md bg-slate-50/80 border border-slate-200/80 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQuestion.prompt || currentQuestion.title}
              </h3>
              
              {currentQuestion.bulletPrompts?.length > 0 ? (
                <div className="space-y-2 pt-2 border-t border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <p className="font-semibold text-slate-800">Points to cover in your speech:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {currentQuestion.bulletPrompts.map((pt, i) => (
                      <li key={i} className="font-medium text-slate-800">{pt}</li>
                    ))}
                  </ul>
                  {currentQuestion.guidance && (
                    <p className="text-slate-500 pt-1 text-xs italic">{currentQuestion.guidance}</p>
                  )}
                </div>
              ) : currentQuestion.guidance ? (
                <div className="space-y-1.5 pt-2 border-t border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  <p className="font-semibold text-slate-800">Consider including the following points in your response:</p>
                  <p className="text-slate-600 pl-1">{currentQuestion.guidance}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recording workspace (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 md:p-10 flex flex-col justify-between overflow-y-visible md:overflow-y-auto bg-white">
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-900">
                Record your response
              </span>
              <span className="text-slate-600 text-xs">
                Maximum Recording Time: <strong>01:00 Minutes</strong>
              </span>
            </div>

            {/* Preparation / Recording Status Banner */}
            {!currentState.prepCompleted && !currentState.isAttempted && !isRecording ? (
              <div className="p-3 sm:p-3.5 rounded bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs flex items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 shrink-0 text-[#b06000] animate-spin" />
                  <span className="font-medium">
                    Preparation Time: <strong>{currentState.prepRemaining}s remaining</strong>. Organize your thoughts.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSkipPrep}
                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0"
                >
                  Skip Prep
                </button>
              </div>
            ) : isRecording ? (
              <div className="p-3 sm:p-3.5 rounded bg-[#e8f0fe] border border-[#d2e3fc] text-[#1967d2] text-xs flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
                <Info className="w-4 h-4 shrink-0 text-[#1967d2]" />
                <span className="font-medium">
                  The recording has started. Speak clearly for up to 60 seconds.
                </span>
              </div>
            ) : currentState.isAttempted ? (
              <div className="p-3 sm:p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium">
                  Response recorded. Complete the self-check below or proceed to the next question.
                </span>
              </div>
            ) : (
              <div className="p-3 sm:p-3.5 rounded bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs flex items-center gap-2.5 shadow-2xs">
                <Info className="w-4 h-4 shrink-0 text-[#b06000]" />
                <span className="font-medium">
                  Preparation finished. Click Start Audio Recording when ready.
                </span>
              </div>
            )}

            {/* Recording Error Alert */}
            {recordingError && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recordingError}</span>
              </div>
            )}

            {/* Circular Recording Ring (~190px diameter) */}
            <div className="flex flex-col items-center justify-center py-2 sm:py-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-slate-200 bg-[#fbfcfd] flex flex-col items-center justify-center shadow-xs">
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
                )}

                <Mic className={`w-7 h-7 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 transition ${isRecording ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`} />

                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  {isRecording ? 'Recording Response' : currentState.isAttempted ? 'Recorded' : !currentState.prepCompleted ? 'Preparing...' : 'Ready'}
                </span>

                <span className="text-xs font-mono font-bold text-slate-700 mt-1">
                  00:{String(isRecording ? recordingSeconds : (currentState.recordedDuration || 0)).padStart(2, '0')}/01:00 Minutes
                </span>
              </div>

              {/* Sleek Dark Rounded Audio Waveform Bar */}
              <div className="w-full max-w-xs sm:max-w-md mt-4 sm:mt-6 h-9 sm:h-10 rounded-full bg-[#081729] border border-slate-800 flex items-center justify-center px-4 overflow-hidden shadow-inner">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    {[16, 24, 38, 52, 28, 44, 60, 32, 20, 48, 64, 36, 18, 50, 26, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-gradient-to-t from-emerald-400 to-teal-400 rounded-full animate-pulse"
                        style={{
                          height: `${Math.max(8, (h * ((recordingSeconds % 3) + 1)) / 2.5)}px`,
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

              {/* Recording Action Button */}
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {isRecording ? (
                  <button
                    type="button"
                    id="btn-stop-recording-c"
                    onClick={stopCurrentRecording}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-400 text-xs font-bold transition shadow-2xs"
                  >
                    <Square className="w-3.5 h-3.5 fill-current text-rose-600" />
                    <span>Stop Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-start-recording-c"
                    onClick={startCurrentRecording}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#0c59cf] hover:bg-[#094ab0] text-white text-xs font-bold transition shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{currentState.isAttempted ? 'Re-record Audio' : 'Start Audio Recording'}</span>
                  </button>
                )}

                {currentState.audioUrl && !isRecording && (
                  <button
                    type="button"
                    onClick={handleTogglePlayResponse}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition"
                  >
                    {isPlayingResponse ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{isPlayingResponse ? 'Playing Response' : 'Play My Recording'}</span>
                  </button>
                )}
              </div>

              {currentState.audioUrl && (
                <audio
                  ref={userAudioPlayerRef}
                  src={currentState.audioUrl}
                  onEnded={() => setIsPlayingResponse(false)}
                  className="hidden"
                />
              )}
            </div>

            {/* Self-evaluation Checklist after recording */}
            {currentState.isAttempted && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Self-Evaluation Checklist (Optional)
                </span>
                <div className="space-y-1.5">
                  {CHECKLIST_ITEMS.map((item) => (
                    <label key={item.key} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentState.checklist?.[item.key])}
                        onChange={() => handleToggleChecklist(item.key)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Section C
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Finish Section C & Proceed?
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
              You are completing Section C. Submitting will record your attempt and <strong>unlock Section D (Grammar & English Usage)</strong>.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Attempted recordings:</span>
                <strong className="text-emerald-700 font-bold">{attemptedCount} of 3</strong>
              </div>
              <div className="flex justify-between">
                <span>Unattempted topics:</span>
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
                id="btn-confirm-finish-section-c"
                onClick={handleConfirmFinish}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Summary
              </button>

              <button
                type="button"
                id="btn-finish-and-proceed-to-d"
                onClick={handleFinishAndProceedToSectionD}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-[#0c59cf] hover:bg-[#094ab0] shadow-xs transition"
              >
                <span>Proceed to Section D</span>
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
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Section C Guidelines & Instructions</span>
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
                <strong>Structure:</strong> 3 Speaking Topics. For each question, 30 seconds preparation followed by 60 seconds of speaking time.
              </p>
              <p>
                <strong>Evaluation Criteria:</strong> Fluency, coherence, topic adherence, vocabulary, and sentence structures.
              </p>
              <p>
                <strong>Sequential Unlocking:</strong> Finishing Section C automatically unlocks Section D (Grammar & English Usage).
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
