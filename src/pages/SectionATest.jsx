import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X, 
  Maximize2, 
  Minimize2, 
  Settings as SettingsIcon, 
  Cloud, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  LayoutGrid, 
  Info, 
  MoreVertical, 
  ArrowRight,
  Headphones
} from 'lucide-react';
import { generateSectionAQuestions } from '../data/sectionAQuestions';
import { artifactPlayer } from '../utils/audioArtifactPlayer';
import { saveAttempt, markSectionCompleted } from '../utils/storage';

/**
 * Custom SVG Illustration for "Use a good quality mic" (Screenshot 1)
 */
function GoodMicIllustration() {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-2 sm:p-3 shadow-2xs">
        {/* Headset SVG */}
        <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-24 sm:h-24 text-slate-700">
          {/* Headband */}
          <path
            d="M 22 55 A 28 28 0 0 1 78 55"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Accent top arc */}
          <path
            d="M 26 48 A 24 24 0 0 1 74 48"
            fill="none"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Left Earcup */}
          <rect x="15" y="48" width="12" height="22" rx="6" fill="#1e293b" />
          {/* Right Earcup */}
          <rect x="73" y="48" width="12" height="22" rx="6" fill="#1e293b" />
          {/* Microphone boom */}
          <path
            d="M 21 68 C 21 82, 38 86, 48 83"
            fill="none"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Microphone head capsule */}
          <rect x="46" y="79" width="10" height="7" rx="3.5" fill="#0f172a" />
        </svg>

        {/* Green checkmark overlay badge */}
        <div className="absolute top-0.5 right-1 sm:top-1 sm:right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      <span className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-2 sm:mt-2.5 max-w-[130px] sm:max-w-[140px] leading-snug">
        Use a good quality mic
      </span>
    </div>
  );
}

/**
 * Custom SVG Illustration for "Do not use computer mic" (Screenshot 1)
 */
function BadLaptopMicIllustration() {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center p-2 sm:p-3 shadow-2xs">
        {/* Laptop SVG */}
        <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-24 sm:h-24 text-slate-700">
          {/* Screen frame */}
          <rect x="24" y="24" width="52" height="36" rx="4" fill="#334155" />
          {/* Screen glass */}
          <rect x="27" y="27" width="46" height="30" rx="2" fill="#0f172a" />
          {/* Mic glyph in screen */}
          <circle cx="50" cy="42" r="4.5" fill="#94a3b8" />
          <path d="M 46 43 C 46 47, 54 47, 54 43" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="50" y1="47" x2="50" y2="50" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Sound waves emitted */}
          <path d="M 43 40 A 10 10 0 0 1 43 44" fill="none" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 57 40 A 10 10 0 0 0 57 44" fill="none" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
          {/* Laptop keyboard base */}
          <polygon points="16,68 84,68 76,62 24,62" fill="#475569" />
          <rect x="42" y="62" width="16" height="2" rx="1" fill="#94a3b8" />
        </svg>

        {/* Red X overlay badge */}
        <div className="absolute top-0.5 right-1 sm:top-1 sm:right-2 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 sm:w-5 sm:h-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      </div>
      <span className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-2 sm:mt-2.5 max-w-[130px] sm:max-w-[140px] leading-snug">
        Do not use computer mic
      </span>
    </div>
  );
}

/**
 * Realistic HTML5-styled Audio Player Pill Component
 * Matching the exact visual style in Screenshot 2:
 * Pill container: Play button, elapsed/total time, scrubber slider, volume icon, 3 dots
 */
function StyledAudioPlayerBar({ 
  id, 
  title, 
  durationSeconds = 3, 
  _artifactType, 
  _speakerText, 
  isPlaying, 
  onTogglePlay,
  progress = 0 
}) {
  const [isMuted, setIsMuted] = useState(false);

  // Format time (0:01 / 0:03)
  const currentSecs = Math.min(durationSeconds, Math.floor((progress / 100) * durationSeconds));
  const formatDigit = (s) => `0:${String(s).padStart(2, '0')}`;

  return (
    <div className="space-y-1.5 my-3">
      <div className="text-xs font-bold text-slate-800">
        {title}
      </div>

      <div className="bg-[#eaedf1] hover:bg-[#e2e6eb] rounded-full px-2.5 sm:px-3.5 py-1.5 sm:py-2 flex items-center justify-between gap-2 sm:gap-3 text-xs shadow-2xs border border-slate-300/70 transition w-full max-w-md">
        {/* Play / Pause button */}
        <button
          type="button"
          onClick={onTogglePlay}
          id={`btn-play-sample-${id}`}
          title={isPlaying ? 'Pause' : 'Play audio example'}
          className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-black transition shrink-0 focus:outline-none"
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Time display: 0:01 / 0:03 */}
        <span className="font-mono text-[11px] font-semibold text-slate-700 shrink-0 w-16">
          {formatDigit(currentSecs)} / {formatDigit(durationSeconds)}
        </span>

        {/* Scrubber slider bar */}
        <div className="flex-1 relative flex items-center">
          <div className="w-full h-1 bg-slate-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-800 transition-all duration-100 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          {/* Scrubber knob */}
          <div 
            className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full shadow-xs -ml-1 transition-all duration-100"
            style={{ left: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {/* Volume toggle */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="text-slate-600 hover:text-slate-900 transition shrink-0 p-1"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-600" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>

        {/* 3-dots Menu */}
        <button
          type="button"
          className="text-slate-400 hover:text-slate-700 transition shrink-0 p-0.5"
          title="Audio options"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Section A Test Interface
 * Faithfully matches Screenshot 1 and Screenshot 2:
 * 1. Dark navy-blue header:
 *    Branding, candidate name, Voice Assessment / Saved indicator, Section timer, icons, Finish Test
 * 2. Question navigation toolbar directly below header:
 *    Section dropdown, info icon, < 1 2 3 4 5 > question numbers, grid icon, Attempted: 0/5, Next button
 * 3. Two-column workspace with visible vertical divider:
 *    Left Column (50%):
 *      Question header, Revisit Later, instructions, Examples with realistic audio player bars,
 *      Next Step with reading words in italics, Corrective Action with Headset & Laptop mic illustrations
 *    Right Column (50%):
 *      Record your response header, Maximum Recording Time: 01:00 Minutes,
 *      Pale yellow instruction banner,
 *      Large circular microphone indicator with subtle outer ring,
 *      Recording Time 01:00 Minutes countdown,
 *      Available attempts: 1/1,
 *      Blue Start Audio Recording button, real MediaRecorder recording
 *    Floating blue arrow button on right margin
 */
export default function SectionATest() {
  const navigate = useNavigate();

  // Section 10-Minute Continuous Timer (600 seconds)
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(600);
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // Tracking attempt start and save uniqueness
  const attemptStartTimeRef = useRef(null);
  useEffect(() => {
    if (!attemptStartTimeRef.current) {
      attemptStartTimeRef.current = new Date().toISOString();
    }
  }, []);
  const hasSavedRef = useRef(false);

  // Active questions for this attempt (5 questions generated and randomized from calibration bank)
  const [questions, setQuestions] = useState(() => generateSectionAQuestions([]));

  // Active question index (0 to 4)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions state map: { [questionId]: { isAttempted: bool, isRevisit: bool, audioBlob, audioUrl, duration } }
  const [questionStates, setQuestionStates] = useState(() => {
    const initial = {};
    questions.forEach((q) => {
      initial[q.id] = {
        isAttempted: false,
        isRevisit: false,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
      };
    });
    return initial;
  });

  const questionStatesRef = useRef(questionStates);
  useEffect(() => {
    questionStatesRef.current = questionStates;
  }, [questionStates]);

  // Audio example player states for Question 1 examples
  // Examples: 1. Garbling (3s), 2. Constant hiss (3s), 3. White noise (4s)
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [sampleProgress, setSampleProgress] = useState(0);
  const sampleProgressTimerRef = useRef(null);

  // Per-question recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  // Player state for user recorded response
  const [isPlayingResponse, setIsPlayingResponse] = useState(false);
  const userAudioPlayerRef = useRef(null);

  // MediaRecorder refs
  const mediaRecorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Dialog state for "Finish Test"
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const currentState = questionStates[currentQuestion?.id] || {};

  // Format MM:SS helper
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Cleanup helper for active mic tracks
  const stopMicStream = useCallback(() => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // Ignore
        }
      });
      audioStreamRef.current = null;
    }
  }, []);

  // Stop real recording
  const stopCurrentRecording = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsRecording(false);
  }, []);

  // Stop active sample audio example player
  const stopSamplePlayback = useCallback(() => {
    artifactPlayer.stop();
    if (sampleProgressTimerRef.current) {
      clearInterval(sampleProgressTimerRef.current);
      sampleProgressTimerRef.current = null;
    }
    setActiveSampleId(null);
    setSampleProgress(0);
  }, []);

  // Play a specific sample audio example with progress tracking
  const handlePlaySample = (sampleId, artifactType, speakerText, durationSecs) => {
    if (activeSampleId === sampleId) {
      // Toggle stop
      stopSamplePlayback();
      return;
    }

    stopSamplePlayback();
    setActiveSampleId(sampleId);
    setSampleProgress(0);

    const stepMs = 50;
    const totalMs = durationSecs * 1000;
    let elapsed = 0;

    sampleProgressTimerRef.current = setInterval(() => {
      elapsed += stepMs;
      const pct = (elapsed / totalMs) * 100;
      if (pct >= 100) {
        stopSamplePlayback();
      } else {
        setSampleProgress(pct);
      }
    }, stepMs);

    artifactPlayer.playArtifact(artifactType, speakerText, () => {
      stopSamplePlayback();
    });
  };

  // Handle when 10-minute section timer hits 0
  const handleTimeExpire = useCallback(() => {
    stopCurrentRecording();
    stopSamplePlayback();
    setTimeExpired(true);
    setIsTestFinished(true);
  }, [stopCurrentRecording, stopSamplePlayback]);

  // Section Timer countdown effect
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
      artifactPlayer.stop();
      stopMicStream();
      if (sampleProgressTimerRef.current) {
        clearInterval(sampleProgressTimerRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      // Revoke all created URLs from ref
      Object.values(questionStatesRef.current).forEach((st) => {
        if (st.audioUrl) {
          URL.revokeObjectURL(st.audioUrl);
        }
      });
    };
  }, [stopMicStream]);

  // Start real microphone recording
  const startCurrentRecording = async () => {
    if (currentState.isAttempted || isRecording) return;
    setRecordingError(null);
    stopSamplePlayback();

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
            },
          }));
        }
      };

      recorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      // Start recording timer with 60-second limit
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
      console.warn('Microphone error:', err);
      stopMicStream();
      setRecordingError(
        err.name === 'NotAllowedError'
          ? 'Microphone permission denied. Please allow microphone access in your browser.'
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

  // Navigation handlers
  const handleSelectQuestion = (idx) => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSamplePlayback();
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
      // On question 5, prompt finish modal
      setShowFinishModal(true);
    }
  };

  // Metrics
  const attemptedCount = Object.values(questionStates).filter((s) => s.isAttempted).length;
  const revisitCount = Object.values(questionStates).filter((s) => s.isRevisit).length;
  const unattemptedCount = Math.max(0, questions.length - attemptedCount);
  const timeUsed = 600 - sectionTimeRemaining;

  // Persistent Attempt Saving Helper (Unified Data Model + Sequential Lock)
  const saveSectionAAttempt = useCallback(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    const currentAttempted = Object.values(questionStatesRef.current).filter((s) => s.isAttempted).length;
    const currentRevisit = Object.values(questionStatesRef.current).filter((s) => s.isRevisit).length;
    const currentUnattempted = Math.max(0, questions.length - currentAttempted);
    const elapsed = Math.max(1, 600 - sectionTimeRemaining);

    // Save attempt record
    saveAttempt({
      id: `att_section-a_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sectionId: 'section-a',
      sectionName: 'Section A — Audio Quality Assessment',
      startedAt: attemptStartTimeRef.current || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      durationSeconds: 600,
      timeUsedSeconds: elapsed,
      totalQuestions: questions.length,
      attemptedCount: currentAttempted,
      unansweredCount: currentUnattempted,
      revisitCount: currentRevisit,
      isObjective: false,
      recordingStatus: {
        totalRecordingsExpected: questions.length,
        completedRecordings: currentAttempted,
      },
      questionsReview: questions.map((q) => ({
        questionNumber: q.questionNumber,
        prompt: q.instruction,
        type: 'voice_recording',
        category: q.defectCategory,
        wordsToRead: q.wordsToRead,
        isAttempted: Boolean(questionStatesRef.current[q.id]?.isAttempted),
        recordedDuration: questionStatesRef.current[q.id]?.duration || 0,
        isRevisit: Boolean(questionStatesRef.current[q.id]?.isRevisit),
      })),
    });

    // Mark Section A complete to unlock Section B
    markSectionCompleted('section-a');
  }, [questions, sectionTimeRemaining]);

  // Finalize Test (display Section A summary)
  const handleConfirmFinish = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSamplePlayback();
    saveSectionAAttempt();
    setShowFinishModal(false);
    setIsTestFinished(true);
  };

  // Finalize Test and Proceed Directly to Section B
  const handleFinishAndProceedToSectionB = () => {
    if (isRecording) {
      stopCurrentRecording();
    }
    stopSamplePlayback();
    saveSectionAAttempt();
    setShowFinishModal(false);
    navigate('/section-b/intro');
  };

  // Retake Section A
  const handleRetakeSectionA = () => {
    hasSavedRef.current = false;
    attemptStartTimeRef.current = new Date().toISOString();
    Object.values(questionStates).forEach((st) => {
      if (st.audioUrl) {
        URL.revokeObjectURL(st.audioUrl);
      }
    });

    // Generate fresh randomized questions avoiding preceding attempt order
    const previousBankIds = questions.map((q) => q.bankId);
    const newQuestions = generateSectionAQuestions(previousBankIds);
    setQuestions(newQuestions);

    const reset = {};
    newQuestions.forEach((q) => {
      reset[q.id] = {
        isAttempted: false,
        isRevisit: false,
        audioBlob: null,
        audioUrl: null,
        duration: 0,
      };
    });

    setQuestionStates(reset);
    setSectionTimeRemaining(600);
    setIsTestFinished(false);
    setTimeExpired(false);
    setCurrentQuestionIndex(0);
    setIsRecording(false);
    setRecordingSeconds(0);
    setRecordingError(null);
  };

  // Fallback save effect on timer expiration
  useEffect(() => {
    if (isTestFinished && !hasSavedRef.current) {
      saveSectionAAttempt();
    }
  }, [isTestFinished, saveSectionAAttempt]);

  // ----------------------------------------------------
  // Summary Screen (rendered upon finishing or timer end)
  // ----------------------------------------------------
  if (isTestFinished) {
    return (
      <div className="min-h-screen bg-[#07192f] p-4 sm:p-8 flex flex-col justify-start items-center">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Section A Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Section A Summary — Audio Quality Assessment
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {timeExpired 
                ? 'Time expired (10:00 limit reached). Review your attempt breakdown below.' 
                : 'You have concluded Section A. Your recordings have been saved locally and Section B is unlocked.'}
            </p>
          </div>

          {/* Metrics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-slate-900">{questions.length}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Questions</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center">
              <span className="block text-2xl font-bold text-emerald-700">{attemptedCount}</span>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase">Completed Recordings</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-2xl font-bold text-slate-700">{unattemptedCount}</span>
              <span className="text-[11px] font-semibold text-slate-700 uppercase">Unattempted</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center">
              <span className="block text-2xl font-bold text-amber-700">{revisitCount}</span>
              <span className="text-[11px] font-semibold text-amber-700 uppercase">Marked Revisit</span>
            </div>
          </div>

          {/* Time Used Tile */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Total Section Time Used: <strong>{formatTime(timeUsed)}</strong> (out of 10:00)</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">10-Minute Maximum</span>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Question Recordings Status
            </h2>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {questions.map((q) => {
                const st = questionStates[q.id];
                return (
                  <div key={q.id} className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-slate-100 font-bold text-slate-700 flex items-center justify-center shrink-0">
                        {q.questionNumber}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 block">{q.title}</span>
                        <span className="text-slate-500 text-[11px] block">{q.defectCategory}</span>
                        <span className="text-slate-600 text-[11px] italic block mt-0.5">"{q.wordsToRead}"</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {st.isAttempted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Voice Recorded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <span>Not Recorded</span>
                        </span>
                      )}

                      {st.isRevisit && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Bookmark className="w-3 h-3" />
                          <span>Revisit</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Module: Section B Navigation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 border-2 border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600 text-white uppercase tracking-wider">
                Next Assessment Section (Unlocked)
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Ready for Section B — Reading and Listening?
              </h3>
              <p className="text-xs text-slate-600">
                18 Questions (Read Paragraph & Listen Carefully and Say) • 10 Minutes
              </p>
            </div>

            <Link
              to="/section-b/intro"
              id="btn-proceed-to-section-b-main"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition shrink-0"
            >
              <span>Proceed to Section B</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <Link
                to="/section-b/intro"
                id="btn-proceed-to-section-b-bottom"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
              >
                <span>Proceed to Section B</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                id="btn-retake-section-a"
                onClick={handleRetakeSectionA}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Section A</span>
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
  // Main Assessment Interface matching Screenshots 1 & 2
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans select-none relative">
      {/* 1. TOP HEADER (Dark Navy-Blue matching authentic screenshots) */}
      <header className="bg-[#06182c] border-b border-[#0d2745] text-white px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between z-30 shrink-0">
        {/* Left: Branding & Candidate Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Subtle stylized practice branding glyph */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
            <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>

          <div className="leading-tight min-w-0">
            <span className="text-xs sm:text-sm font-semibold text-white tracking-wide block truncate max-w-[130px] sm:max-w-none">
              Chandrashekar Durgam
            </span>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400">
              <span className="hidden sm:inline">Voice Assessment</span>
              <span className="hidden sm:inline">/</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Cloud className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-400" />
                <span className="truncate">Saved</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Timer, Utilities & Finish Test Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Developed By Attribution Badge */}
          <div className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/80 text-[11px] text-slate-300">
            <span className="text-slate-400">Developed By</span>
            <strong className="text-white font-semibold">Injamamul</strong>
          </div>

          {/* Section Timer with dropdown caret */}
          <div 
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-mono font-medium text-slate-200 bg-slate-800/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded border border-slate-700"
            title="Section Time Countdown"
          >
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" />
            <span className="text-slate-400 text-xs hidden md:inline">Time:</span>
            <span className="font-bold text-white tracking-wider text-xs sm:text-sm">
              {formatTime(sectionTimeRemaining)}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5 hidden sm:inline" />
          </div>

          {/* Fullscreen icon */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition hidden md:inline-flex"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Settings icon */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition hidden sm:inline-flex"
            title="Section Information"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Finish Test button matching screenshot outline styling */}
          <button
            type="button"
            id="btn-finish-test"
            onClick={() => setShowFinishModal(true)}
            className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded text-xs font-semibold bg-transparent hover:bg-rose-900/50 text-white border border-slate-500 hover:border-slate-300 transition whitespace-nowrap"
          >
            Finish<span className="hidden sm:inline"> Test</span>
          </button>
        </div>
      </header>

      {/* 2. QUESTION NAVIGATION TOOLBAR */}
      <div className="bg-[#f4f6f8] border-b border-[#e2e8f0] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 z-20 shrink-0">
        {/* Left: Section badge & Information icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-white border border-slate-300 rounded px-2 sm:px-3 py-1 text-xs text-slate-800 font-medium shadow-2xs whitespace-nowrap">
            <span>1. Section - A</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
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

        {/* Center: Desktop Full question navigation strip */}
        <div className="hidden md:flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            {/* Prev Question Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Question numbers 1 to 5 */}
            <div className="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded border border-slate-300/80">
              {questions.map((q, idx) => {
                const isSelected = idx === currentQuestionIndex;
                const st = questionStates[q.id];

                return (
                  <button
                    key={q.id}
                    type="button"
                    id={`btn-nav-q-${q.id}`}
                    onClick={() => handleSelectQuestion(idx)}
                    className={`relative w-7 h-7 rounded text-xs font-medium flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{q.questionNumber}</span>
                    {st?.isRevisit && (
                      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    )}
                    {st?.isAttempted && !isSelected && (
                      <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next Question Arrow */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentQuestionIndex === questions.length - 1}
              className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed p-1 transition"
              title="Next Question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Question Grid Icon */}
            <button
              type="button"
              onClick={() => setShowQuestionGrid(!showQuestionGrid)}
              className="text-slate-500 hover:text-slate-800 p-1 ml-1"
              title="Question Overview Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-600 mt-0.5">
            Attempted: {attemptedCount}/{questions.length}
          </span>
        </div>

        {/* Center: Mobile Compact question navigation */}
        <div className="flex md:hidden items-center gap-1 shrink-0">
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
            onClick={() => setShowQuestionGrid(!showQuestionGrid)}
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
            {attemptedCount}/{questions.length}
          </span>
        </div>

        {/* Right: Next button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-next-question-top"
            onClick={handleNext}
            className="px-3 sm:px-4 py-1 rounded bg-[#0c59cf] md:bg-white hover:bg-[#094ab0] md:hover:bg-slate-50 text-white md:text-slate-700 md:hover:text-slate-900 md:border md:border-slate-300 text-xs font-semibold shadow-2xs transition whitespace-nowrap"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      {/* Optional Quick Grid Dropdown Panel */}
      {showQuestionGrid && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 shadow-inner z-10 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Question Palette ({questions.length} Questions)
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

      {/* 3. MAIN TWO-COLUMN WORKSPACE (Visible vertical divider down center) */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto flex flex-col md:grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 overflow-y-auto md:overflow-hidden bg-white">
        {/* LEFT COLUMN: Question Instructions & Audio Examples (~50% width) */}
        <section className="w-full p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 overflow-y-visible md:overflow-y-auto">
          {/* Question Header & Revisit Later */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Question {currentQuestion.questionNumber}
            </h2>

            <button
              type="button"
              id="btn-revisit-later"
              onClick={handleToggleRevisit}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded transition ${
                currentState.isRevisit 
                  ? 'bg-amber-50 text-amber-800 border border-amber-300' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {currentState.isRevisit ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Marked for Revisit</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Revisit Later</span>
                </>
              )}
            </button>
          </div>

          {/* Question Instruction Text matching Screenshot 2 */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            The following audios are examples reflecting different problems that can occur if the microphone quality is bad. Please listen to each of them carefully.
          </p>

          {/* Heading: Examples: */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 underline underline-offset-2">
              Examples:
            </h3>

            {/* Example 1: Garbling in the audio */}
            <StyledAudioPlayerBar
              id="ex-garble"
              title="1. Garbling in the audio"
              durationSeconds={3}
              artifactType="garbled"
              speakerText="The quarterly financial summary will be distributed tomorrow."
              isPlaying={activeSampleId === 'ex-garble'}
              progress={activeSampleId === 'ex-garble' ? sampleProgress : 0}
              onTogglePlay={() => handlePlaySample('ex-garble', 'garbled', 'The quarterly financial summary will be distributed tomorrow.', 3)}
            />

            {/* Example 2: Constant "hiss" sound in the background */}
            <StyledAudioPlayerBar
              id="ex-hiss"
              title='2. Constant "hiss" sound in the background'
              durationSeconds={3}
              artifactType="hiss"
              speakerText="Please verify the delivery address and provide your contact telephone number."
              isPlaying={activeSampleId === 'ex-hiss'}
              progress={activeSampleId === 'ex-hiss' ? sampleProgress : 0}
              onTogglePlay={() => handlePlaySample('ex-hiss', 'hiss', 'Please verify the delivery address and provide your contact telephone number.', 3)}
            />

            {/* Example 3: White noise in the background */}
            <StyledAudioPlayerBar
              id="ex-whitenoise"
              title="3. White noise in the background"
              durationSeconds={4}
              artifactType="white_noise"
              speakerText="All passengers for flight 402 should proceed to gate seventeen."
              isPlaying={activeSampleId === 'ex-whitenoise'}
              progress={activeSampleId === 'ex-whitenoise' ? sampleProgress : 0}
              onTogglePlay={() => handlePlaySample('ex-whitenoise', 'white_noise', 'All passengers for flight 402 should proceed to gate seventeen.', 4)}
            />
          </div>

          {/* Next Step Section matching Screenshot 1 */}
          <div className="pt-2 space-y-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 underline underline-offset-2">
              Next Step:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              After you have listened to all the audios given above, read the words given below in italics and say them out loud to record a sample audio.
            </p>
            <p className="italic text-slate-900 text-xs sm:text-sm font-semibold pt-1 tracking-wide">
              {currentQuestion?.wordsToRead || 'Talk, send, casual, kept, seen, wizard, leave.'}
            </p>
          </div>

          {/* Corrective Action Section with Illustrations matching Screenshot 1 */}
          <div className="pt-3 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 underline underline-offset-2">
              Corrective Action:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              If your sample audio had any of the issues reflected in the above examples, please do the following:
            </p>

            {/* Two Illustration Cards: Headset (Good) & Laptop (Bad) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 pb-2 max-w-sm">
              <GoodMicIllustration />
              <BadLaptopMicIllustration />
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Response Recording Area (~50% width) */}
        <section className="w-full p-4 sm:p-6 md:p-8 flex flex-col justify-start space-y-5 overflow-y-visible md:overflow-y-auto relative">
          {/* Header Row: Record your response & Maximum Recording Time */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Record your response
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Maximum Recording Time: <strong className="text-slate-800">01:00 Minutes</strong>
            </span>
          </div>

          {/* Pale Yellow Instruction Banner matching Screenshot 1 & 2 */}
          <div className="bg-[#fff8e1] border border-[#ffe082]/70 rounded-md p-3 text-xs text-[#795548] font-medium flex items-center gap-2 shadow-2xs">
            <Info className="w-4 h-4 text-[#b78103] shrink-0" />
            <span>Start recording your response whenever you are ready.</span>
          </div>

          {/* Center Area: Large Circular Microphone Recording Indicator */}
          <div className="py-4 sm:py-8 flex flex-col items-center justify-center space-y-4">
            <div 
              className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                isRecording 
                  ? 'border-rose-500 bg-rose-50/50 shadow-lg ring-8 ring-rose-500/20 animate-pulse' 
                  : currentState.isAttempted
                  ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200 bg-slate-50/40 shadow-xs'
              }`}
            >
              {/* Mic Icon */}
              <Mic className={`w-7 h-7 sm:w-9 sm:h-9 mb-1 sm:mb-1.5 transition ${
                isRecording 
                  ? 'text-rose-600 animate-bounce' 
                  : currentState.isAttempted 
                  ? 'text-emerald-600' 
                  : 'text-slate-700'
              }`} />

              {/* Text: Recording Time */}
              <span className="text-xs font-semibold text-slate-700">
                Recording Time
              </span>

              {/* Timer Display: 01:00 Minutes or live countdown */}
              <span className="font-mono text-sm sm:text-base font-bold text-slate-900 tracking-tight mt-0.5">
                {isRecording 
                  ? `${formatTime(60 - recordingSeconds)} Minutes`
                  : '01:00 Minutes'
                }
              </span>

              {/* Active Pulsing Indicator if recording */}
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600"></span>
                </span>
              )}
            </div>

            {/* Available attempts text below circular indicator */}
            <span className="text-xs font-medium text-slate-500">
              {currentState.isAttempted 
                ? 'Available attempts: 0/1 (Attempt Completed)' 
                : 'Available attempts: 1/1'
              }
            </span>

            {/* Recording Error Banner */}
            {recordingError && (
              <div className="w-full max-w-sm p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{recordingError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Primary Start / Stop Audio Recording Button */}
              {!isRecording ? (
                <button
                  type="button"
                  id="btn-start-audio-recording"
                  onClick={startCurrentRecording}
                  disabled={currentState.isAttempted}
                  className="w-full sm:w-auto px-6 sm:px-7 py-2.5 rounded bg-[#0c59cf] hover:bg-[#094ab0] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Mic className="w-4 h-4" />
                  <span>Start Audio Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-stop-audio-recording"
                  onClick={stopCurrentRecording}
                  className="w-full sm:w-auto px-6 sm:px-7 py-2.5 rounded bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md transition flex items-center justify-center gap-2 animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current text-rose-500" />
                  <span>Stop Recording ({60 - recordingSeconds}s remaining)</span>
                </button>
              )}

              {/* Play Recorded Audio Button */}
              {currentState.isAttempted && currentState.audioUrl && (
                <button
                  type="button"
                  id="btn-play-user-recording"
                  onClick={handleTogglePlayResponse}
                  disabled={isRecording}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-xs transition flex items-center justify-center gap-2"
                >
                  {isPlayingResponse ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Recording</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Recording</span>
                    </>
                  )}
                </button>
              )}

              {/* Hidden audio element for user recording */}
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
        </section>
      </main>

      {/* Floating Right Navigation Drawer Arrow matching Screenshot 1 */}
      <button
        type="button"
        onClick={handleNext}
        title={currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
        className="fixed right-0 top-1/2 -translate-y-1/2 w-7 h-12 bg-[#0c59cf] hover:bg-[#094ab0] text-white hidden md:flex items-center justify-center rounded-l shadow-md z-40 transition focus:outline-none"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* CONFIRMATION MODAL FOR FINISH TEST */}
      {showFinishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Section A
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Finish Section A & Proceed?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFinishModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are completing Section A. Submitting will save your progress and <strong>unlock Section B (Reading and Listening)</strong>.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Attempted recordings:</span>
                <strong className="text-emerald-700 font-bold">{attemptedCount} of {questions.length}</strong>
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
                id="btn-confirm-finish-section-a"
                onClick={handleConfirmFinish}
                className="w-full sm:w-auto px-3.5 py-2 rounded text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition"
              >
                View Summary
              </button>

              <button
                type="button"
                id="btn-finish-and-proceed-to-b"
                onClick={handleFinishAndProceedToSectionB}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded text-xs font-bold text-white bg-[#0c59cf] hover:bg-[#094ab0] shadow-xs transition"
              >
                <span>Proceed to Section B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION INFORMATION MODAL */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Section A Guidelines & Instructions</span>
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
                <strong>Purpose:</strong> Audio Quality Assessment evaluates microphone setup and speech clarity to ensure accurate audio transmission.
              </p>
              <p>
                <strong>Structure:</strong> 5 numbered questions covering different acoustic defect types. Each question allows 1 voice recording attempt up to 60 seconds.
              </p>
              <p>
                <strong>Sequential Locking:</strong> Submitting Section A automatically unlocks Section B. You may navigate between questions 1–5 freely before submission.
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
