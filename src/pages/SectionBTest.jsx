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
  LayoutGrid
} from 'lucide-react';
import { generateSectionBQuestions } from '../data/sectionBQuestions';
import { saveAttempt } from '../utils/storage';

/**
 * Section B Assessment Interface
 * Matches the user reference screenshot pixel-for-pixel:
 * 1. Top dark navy assessment header (#06182c) with candidate details, timer, fullscreen, finish test button.
 * 2. Light navigation toolbar (#f4f6f8) with "2. Section - B", info icon, pager < 1 2 3 4 5 6 7 8 9 10 >, "Attempted: X/18", and Next button.
 * 3. 2-column workspace with vertical divider:
 *    - Left column: Question number, Revisit Later bookmark, bold prompt ("Read the sentence given below and say it out loud." / "Listen carefully to the audio and repeat the sentence out loud."), text prompt, and audio player for Part 2.
 *    - Right column: "Record your response", "Maximum Recording Time: 00:15 Minutes", pale blue/yellow notification banner, large circular recording ring with microphone icon, "Recording Response 00:00/00:15 Minutes", sleek dark waveform level bar, Stop Recording (red square) / Start Audio Recording (blue).
 * 4. Floating blue arrow button on the right margin.
/**
 * Helper to select an authentic American English voice from browser speechSynthesis
 */
function getAmericanEnglishVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Look for explicit en-US voices (excluding British/UK/AU)
  const usVoices = voices.filter(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && 
           !v.name.toLowerCase().includes('united kingdom') && 
           !v.name.toLowerCase().includes('british') && 
           !v.name.toLowerCase().includes('australia')
  );

  // Preferred priority: Google US English, Natural, Microsoft en-US (Zira/David/Jenny/Guy), Apple Samantha/Alex
  const preferredVoice = usVoices.find((v) => {
    const n = v.name.toLowerCase();
    return n.includes('google us english') ||
           n.includes('natural') ||
           n.includes('samantha') ||
           n.includes('zira') ||
           n.includes('david') ||
           n.includes('jenny') ||
           n.includes('guy') ||
           n.includes('aria');
  }) || usVoices[0];

  if (preferredVoice) return preferredVoice;

  // Fallback to any voice with en-US
  const fallbackUs = voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US');
  if (fallbackUs) return fallbackUs;

  // Fallback to any en voice
  return voices.find((v) => v.lang.startsWith('en')) || null;
}

export default function SectionBTest() {
  const navigate = useNavigate();

  // Continuous Section 10-Minute Timer (600 seconds)
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

  // Pre-load speech synthesis voices on mount to ensure American English voice is ready
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Active question index (0 to 17)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Pager offset for question toolbar (showing 10 numbers at a time)
  const [customPagerOffset, setCustomPagerOffset] = useState(null);
  const pagerOffset = customPagerOffset !== null ? customPagerOffset : (currentQuestionIndex < 10 ? 0 : 8);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals & Panels
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);

  // Questions generated for this attempt (10 paragraphs + 8 sentences)
  const [questions, setQuestions] = useState(() => generateSectionBQuestions([]));
  const questionsRef = useRef(questions);
  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  // State map per question: { [questionId]: { isAttempted, isRevisit, hasPlayedAudio, audioBlob, audioUrl, duration } }
  const [questionStates, setQuestionStates] = useState(() => {
    const initial = {};
    for (let i = 1; i <= 18; i++) {
      initial[i] = {
        isAttempted: false,
        isRevisit: false,
        hasPlayedAudio: false,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
      };
    }
    return initial;
  });

  const questionStatesRef = useRef(questionStates);
  useEffect(() => {
    questionStatesRef.current = questionStates;
  }, [questionStates]);

  // Audio prompt playback for Questions 11–18 (Listen Carefully and Say)
  const [isPromptSpeaking, setIsPromptSpeaking] = useState(false);

  // Per-question recording state (15s limit)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  // User playback state
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const userAudioPlayerRef = useRef(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentState = questionStates[currentQuestion?.id || 1] || {
    isAttempted: false,
    isRevisit: false,
    hasPlayedAudio: false,
    audioBlob: null,
    audioUrl: null,
    duration: 0,
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

  // Stop speech synthesis prompt
  const stopSpeechPrompt = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPromptSpeaking(false);
  }, []);

  // Handle section timer expiration
  const handleTimeExpire = useCallback(() => {
    stopCurrentRecording();
    stopSpeechPrompt();
    setTimeExpired(true);
    setIsTestFinished(true);
  }, [stopCurrentRecording, stopSpeechPrompt]);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeechPrompt();
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
  }, [stopMicStream, stopSpeechPrompt]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Play audio prompt for Listen & Say
  const handlePlayAudioPrompt = () => {
    if (!currentQuestion?.content) return;

    if (isPromptSpeaking) {
      stopSpeechPrompt();
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis is not available in your browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.content);
      
      // Explicitly select American English Voice
      const usVoice = getAmericanEnglishVoice();
      if (usVoice) {
        utterance.voice = usVoice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsPromptSpeaking(true);
      utterance.onend = () => {
        setIsPromptSpeaking(false);
        setQuestionStates((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            ...prev[currentQuestion.id],
            hasPlayedAudio: true,
          },
        }));
      };
      utterance.onerror = () => setIsPromptSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsPromptSpeaking(false);
    }
  };

  // Start 15s recording
  const startCurrentRecording = async () => {
    setRecordingError(null);
    stopSpeechPrompt();

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
              duration: 15,
            },
          }));
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 14) {
            stopCurrentRecording();
            return 15;
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

  // Question selection
  const handleSelectQuestion = (idx) => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSpeechPrompt();
    if (isPlayingResponse && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      setIsPlayingResponse(false);
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

  // Save attempt to storage & unlock Section C
  const saveSectionBAttempt = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const currentAttempted = Object.values(questionStatesRef.current).filter((s) => s.isAttempted).length;
    const currentRevisit = Object.values(questionStatesRef.current).filter((s) => s.isRevisit).length;
    const currentUnattempted = questionsRef.current.length - currentAttempted;
    const elapsed = Math.max(1, 600 - sectionTimeRemaining);

    saveAttempt({
      id: `att_section-b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sectionId: 'section-b',
      sectionName: 'Section B — Reading and Listening',
      startedAt: attemptStartTimeRef.current || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds: 600,
      timeUsedSeconds: elapsed,
      totalQuestions: 18,
      attemptedCount: currentAttempted,
      unansweredCount: currentUnattempted,
      revisitCount: currentRevisit,
      isObjective: false,
      recordingStatus: {
        totalRecordingsExpected: 18,
        completedRecordings: currentAttempted,
      },
      questionsReview: questionsRef.current.map((q) => ({
        questionNumber: q.questionNumber,
        type: q.type,
        prompt: q.instruction,
        text: q.content,
        isAttempted: Boolean(questionStatesRef.current[q.id]?.isAttempted),
        recordedDuration: questionStatesRef.current[q.id]?.duration || 0,
        isRevisit: Boolean(questionStatesRef.current[q.id]?.isRevisit),
      })),
    });
  }, [sectionTimeRemaining]);

  // Finish confirmation handler
  const handleConfirmFinish = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSpeechPrompt();
    saveSectionBAttempt();
    setShowFinishModal(false);
    setIsTestFinished(true);
  };

  // Finish and proceed to Section C
  const handleFinishAndProceedToSectionC = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSpeechPrompt();
    saveSectionBAttempt();
    setShowFinishModal(false);
    navigate('/section-c/intro');
  };

  // Retake Section B
  const handleRetakeSectionB = () => {
    hasSavedRef.current = false;
    attemptStartTimeRef.current = new Date().toISOString();
    Object.values(questionStatesRef.current).forEach((st) => {
      if (st.audioUrl) {
        URL.revokeObjectURL(st.audioUrl);
      }
    });

    const previousIds = questions.map((q) => q.bankId || q.sourceId);
    const newQuestions = generateSectionBQuestions(previousIds);
    setQuestions(newQuestions);

    const resetStates = {};
    for (let i = 1; i <= 18; i++) {
      resetStates[i] = {
        isAttempted: false,
        isRevisit: false,
        hasPlayedAudio: false,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
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
      saveSectionBAttempt();
    }
  }, [isTestFinished, saveSectionBAttempt]);

  // Questions to display in toolbar (10-window pager)
  const displayedQuestionNumbers = questions.slice(pagerOffset, pagerOffset + 10);

  // ----------------------------------------------------
  // Summary Screen (rendered upon finishing or timeout)
  // ----------------------------------------------------
  if (isTestFinished) {
    return (
      <div className="min-h-screen bg-[#07192f] p-4 sm:p-8 flex flex-col justify-start items-center">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section B Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Section B Summary — Reading and Listening
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {timeExpired 
                ? 'Time expired (10:00 limit reached). Review your recording breakdown below.' 
                : 'You have concluded Section B. Your spoken responses are saved and Section C is unlocked.'}
            </p>
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-slate-900">18</span>
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
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Total Section Time Used: <strong>{formatTime(timeUsed)}</strong> (out of 10:00)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">10-Minute Maximum</span>
          </div>

          {/* Next Module: Section C Navigation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                Next Assessment Section (Unlocked)
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ready for Section C — Speak for One Minute?
              </h3>
              <p className="text-xs text-slate-600">
                3 Questions (30s Preparation & 60s Speaking) • 10 Minutes
              </p>
            </div>

            <Link
              to="/section-c/intro"
              id="btn-proceed-to-section-c-main"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition shrink-0"
            >
              <span>Proceed to Section C</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Link
                to="/section-c/intro"
                id="btn-proceed-to-section-c-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                <span>Proceed to Section C</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                id="btn-retake-section-b"
                onClick={handleRetakeSectionB}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Section B</span>
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
  // Main Assessment Interface matching user screenshot
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans select-none relative">
      {/* 1. TOP HEADER (Dark Navy-Blue matching Screenshots) */}
      <header className="bg-[#06182c] border-b border-[#0d2745] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between z-30 shrink-0 gap-2">
        {/* Left: Branding & Candidate Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
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

          {/* Section Timer with caret */}
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

          {/* Fullscreen icon */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition hidden sm:inline-flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings / Info icon */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="text-slate-300 hover:text-white p-1 sm:p-1.5 rounded hover:bg-slate-800 transition"
            title="Section Information"
          >
            <SettingsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Finish Test button */}
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

      {/* 2. QUESTION NAVIGATION TOOLBAR matching screenshot */}
      <div className="bg-[#f4f6f8] border-b border-[#e2e8f0] px-3 sm:px-6 py-2 flex items-center justify-between z-20 shrink-0 gap-2">
        {/* Left: Section dropdown & Info icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-white border border-slate-300 rounded px-2 sm:px-3 py-1 text-xs text-slate-800 font-medium shadow-2xs whitespace-nowrap">
            <span>2. Section - B</span>
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

        {/* Center Desktop: Full Numbers Strip matching Screenshot */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1">
            {/* Prev caret */}
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

            {/* Numbered buttons */}
            <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden shadow-2xs">
              {displayedQuestionNumbers.map((q) => {
                const idx = q.questionNumber - 1;
                const isCurrent = idx === currentQuestionIndex;
                const st = questionStates[q.id];

                let itemClasses = 'px-2.5 py-1 text-xs font-semibold border-r border-slate-200 last:border-r-0 transition';
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

            {/* Next caret */}
            <button
              type="button"
              onClick={() => {
                if (pagerOffset + 10 < questions.length) setCustomPagerOffset(Math.min(8, pagerOffset + 5));
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
              title="Toggle All Questions Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Attempted: X/18 centered directly below numbers matching screenshot */}
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 tracking-tight">
            Attempted: {attemptedCount}/18
          </span>
        </div>

        {/* Center Mobile (< md): Compact Nav with Q X/18 + Palette + Attempted */}
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
            {attemptedCount}/18
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

      {/* Optional Quick Grid Dropdown Panel */}
      {showQuestionGrid && (
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shadow-inner z-10 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Question Palette (18 Questions)
            </span>
            <button
              type="button"
              onClick={() => setShowQuestionGrid(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Close
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const st = questionStates[q.id];
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    handleSelectQuestion(idx);
                    setShowQuestionGrid(false);
                  }}
                  className={`w-8 h-8 rounded text-xs font-bold border transition ${
                    isCurrent 
                      ? 'bg-[#0c59cf] text-white border-[#0c59cf]' 
                      : st?.isAttempted 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {q.questionNumber}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TWO-COLUMN WORKSPACE WITH THIN VERTICAL DIVIDER */}
      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
        {/* LEFT COLUMN: Question prompt, text & audio (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#e2e8f0] overflow-y-visible md:overflow-y-auto shrink-0 md:shrink">
          {/* Top row: Question number & Revisit Later bookmark */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Question {currentQuestion.questionNumber}
            </h2>

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

          {/* Bold Instruction Prompt matching screenshot */}
          <div className="space-y-4">
            <p className="text-sm sm:text-[15px] font-bold text-slate-900 leading-snug">
              {currentQuestion.type === 'read_paragraph' 
                ? 'Read the sentence given below and say it out loud.' 
                : 'Listen carefully to the audio and repeat the sentence out loud.'}
            </p>

            {/* Target Content Text */}
            <div className="p-4 sm:p-5 rounded-md bg-slate-50/80 border border-slate-200/80 text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
              {currentQuestion.type === 'read_paragraph' ? (
                <span>{currentQuestion.content}</span>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={handlePlayAudioPrompt}
                      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded text-xs font-bold text-white transition ${
                        isPromptSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-[#0c59cf] hover:bg-[#094ab0]'
                      }`}
                    >
                      {isPromptSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPromptSpeaking ? 'Listening...' : 'Play Audio Prompt'}</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-500">
                        {currentState.hasPlayedAudio ? 'Listened (You may listen again before recording)' : 'Click to hear the sentence'}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        American English (en-US)
                      </span>
                    </div>
                  </div>
                  {/* Subtle transcript helper if already listened */}
                  {currentState.hasPlayedAudio && (
                    <div className="text-xs text-slate-500 italic pt-1 border-t border-slate-200">
                      Spoken sentence: "{currentQuestion.content}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Recording workspace (~50% width) */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 md:p-10 flex flex-col justify-between overflow-y-visible md:overflow-y-auto bg-white">
          <div className="space-y-5 sm:space-y-6">
            {/* Top row: Record your response & Maximum Recording Time */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-900">
                Record your response
              </span>
              <span className="text-slate-600 text-xs">
                Maximum Recording Time: <strong>00:15 Minutes</strong>
              </span>
            </div>

            {/* Notification Banner matching screenshot */}
            {isRecording ? (
              <div className="p-3 sm:p-3.5 rounded bg-[#e8f0fe] border border-[#d2e3fc] text-[#1967d2] text-xs flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
                <Info className="w-4 h-4 shrink-0 text-[#1967d2]" />
                <span className="font-medium">
                  The recording has started. Your response will be auto submitted when the recording stops.
                </span>
              </div>
            ) : currentState.isAttempted ? (
              <div className="p-3 sm:p-3.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className="font-medium">
                  Response recorded. You can listen to your audio or proceed to the next question.
                </span>
              </div>
            ) : (
              <div className="p-3 sm:p-3.5 rounded bg-[#fef7e0] border border-[#feefc3] text-[#b06000] text-xs flex items-center gap-2.5 shadow-2xs">
                <Info className="w-4 h-4 shrink-0 text-[#b06000]" />
                <span className="font-medium">
                  Start recording your response whenever you are ready.
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

            {/* Circular Recording Ring matching screenshot */}
            <div className="flex flex-col items-center justify-center py-2 sm:py-4">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-slate-200 bg-[#fbfcfd] flex flex-col items-center justify-center shadow-xs">
                {/* Outer subtle ring glow when recording */}
                {isRecording && (
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-25" />
                )}

                {/* Microphone Icon */}
                <Mic className={`w-7 h-7 sm:w-8 sm:h-8 mb-1.5 sm:mb-2 transition ${isRecording ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`} />

                {/* Status text */}
                <span className="text-xs font-bold text-slate-800 tracking-tight">
                  {isRecording ? 'Recording Response' : currentState.isAttempted ? 'Recorded' : 'Ready'}
                </span>

                {/* Timer text: 00:00/00:15 Minutes */}
                <span className="text-xs font-mono font-bold text-slate-700 mt-1">
                  00:{String(isRecording ? recordingSeconds : (currentState.duration || 0)).padStart(2, '0')}/00:15 Minutes
                </span>
              </div>

              {/* Sleek Dark Rounded Audio Waveform Bar matching screenshot */}
              <div className="w-full max-w-xs sm:max-w-md mt-4 sm:mt-6 h-9 sm:h-10 rounded-full bg-[#081729] border border-slate-800 flex items-center justify-center px-4 overflow-hidden shadow-inner">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    {[16, 24, 38, 52, 28, 44, 60, 32, 20, 48, 64, 36, 18, 50, 26, 40].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-gradient-to-t from-sky-400 to-indigo-400 rounded-full animate-pulse"
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

              {/* Recording Action Button matching screenshot */}
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {isRecording ? (
                  <button
                    type="button"
                    id="btn-stop-recording-b"
                    onClick={stopCurrentRecording}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-300 hover:border-rose-400 text-xs font-bold transition shadow-2xs"
                  >
                    <Square className="w-3.5 h-3.5 fill-current text-rose-600" />
                    <span>Stop Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-start-recording-b"
                    onClick={startCurrentRecording}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded bg-[#0c59cf] hover:bg-[#094ab0] text-white text-xs font-bold transition shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{currentState.isAttempted ? 'Re-record Audio' : 'Start Audio Recording'}</span>
                  </button>
                )}

                {/* User recorded audio playback button */}
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

              {/* Hidden audio element for user playback */}
              {currentState.audioUrl && (
                <audio
                  ref={userAudioPlayerRef}
                  src={currentState.audioUrl}
                  onEnded={() => setIsPlayingResponse(false)}
                  className="hidden"
                />
              )}
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Section B
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Finish Section B & Proceed?
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
              You are completing Section B. Submitting will record your attempt and <strong>unlock Section C (Speak for One Minute)</strong>.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Attempted recordings:</span>
                <strong className="text-emerald-700 font-bold">{attemptedCount} of 18</strong>
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
                id="btn-confirm-finish-section-b"
                onClick={handleConfirmFinish}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Summary
              </button>

              <button
                type="button"
                id="btn-finish-and-proceed-to-c"
                onClick={handleFinishAndProceedToSectionC}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-[#0c59cf] hover:bg-[#094ab0] shadow-xs transition"
              >
                <span>Proceed to Section C</span>
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
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Section B Guidelines & Instructions</span>
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
                <strong>Structure:</strong> 18 Questions total. Questions 1–10 are reading passages; Questions 11–18 are spoken sentences.
              </p>
              <p>
                <strong>Time Limits:</strong> 10 minutes total section duration. Each recording has a maximum limit of 15 seconds.
              </p>
              <p>
                <strong>Sequential Unlocking:</strong> Finishing Section B automatically unlocks Section C (Speak for One Minute).
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
