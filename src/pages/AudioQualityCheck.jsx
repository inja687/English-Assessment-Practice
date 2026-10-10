import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Headphones,
  Sparkles
} from 'lucide-react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';

export default function AudioQualityCheck() {
  const navigate = useNavigate();
  const {
    status,
    formattedTime,
    audioUrl,
    errorMessage,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  // Audio player state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Self-review checkboxes
  const [reviewAudible, setReviewAudible] = useState(false);
  const [reviewClear, setReviewClear] = useState(false);
  const [reviewNoise, setReviewNoise] = useState(false);

  // Audio playback handler
  const handleTogglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlaybackTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleRecordAgain = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setPlaybackTime(0);
    setReviewAudible(false);
    setReviewClear(false);
    setReviewNoise(false);
    resetRecording();
  };

  // Status badge helper
  const renderStatusBadge = () => {
    switch (status) {
      case 'recording':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            <span>Recording in progress ({formattedTime})</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Recording completed</span>
          </span>
        );
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Microphone permission denied</span>
          </span>
        );
      case 'unavailable':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Recording unavailable</span>
          </span>
        );
      case 'idle':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Ready to record</span>
          </span>
        );
    }
  };

  const isContinueEnabled = status === 'completed';

  const handleContinue = () => {
    if (isContinueEnabled) {
      navigate('/ready-to-start');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/setup"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to System Setup</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          Audio Calibration Stage
        </span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 2 of 2: Voice & Microphone Calibration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Examine Your Audio Quality
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Record the following sentence in your own voice to check your microphone and audio quality.
            </p>
          </div>

          <div>{renderStatusBadge()}</div>
        </div>

        {/* Passage to read aloud */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 border border-blue-200 text-center space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block">
            Sentence to Read Aloud:
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
            “The quick brown fox jumps over the lazy dog”
          </p>
          <p className="text-xs text-slate-500 font-medium">
            (Pangram containing all letters of the English alphabet for acoustic range testing)
          </p>
        </div>

        {/* Error message if microphone denied or unavailable */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-bold mb-0.5">Recording Issue:</strong>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Interactive Recording Controls Bar */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Start Recording Button */}
            {status !== 'recording' ? (
              <button
                type="button"
                onClick={startRecording}
                id="btn-start-recording"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-md shadow-rose-600/20 transition transform hover:-translate-y-0.5"
              >
                <Mic className="w-4 h-4" />
                <span>Start Recording</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                id="btn-stop-recording"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-900 hover:bg-black text-white shadow-md transition animate-pulse"
              >
                <Square className="w-4 h-4 fill-current text-rose-400" />
                <span>Stop Recording ({formattedTime})</span>
              </button>
            )}

            {/* Play Recording Button */}
            {audioUrl && status === 'completed' && (
              <button
                type="button"
                onClick={handleTogglePlay}
                id="btn-play-recording"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Playback</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Recording</span>
                  </>
                )}
              </button>
            )}

            {/* Record Again Button */}
            {status === 'completed' && (
              <button
                type="button"
                onClick={handleRecordAgain}
                id="btn-record-again"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-2xs transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Record Again</span>
              </button>
            )}
          </div>

          {/* Active Recording Waveform Indicator */}
          {status === 'recording' && (
            <div className="pt-2 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 60].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1 bg-rose-500 rounded-full animate-pulse transition-all"
                  ></span>
                ))}
              </div>
              <p className="text-xs text-rose-700 font-bold">
                Speak clearly now: “The quick brown fox jumps over the lazy dog”
              </p>
            </div>
          )}

          {/* Audio Playback Element */}
          {audioUrl && (
            <div className="pt-4 border-t border-slate-200 mt-4 max-w-lg mx-auto">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                className="hidden"
              />

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-slate-700 font-bold">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Recorded Audio Preview</span>
                  </span>
                  <span>
                    {Math.floor(playbackTime)}s / {Math.floor(duration || 0)}s
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{
                      width: `${duration > 0 ? (playbackTime / duration) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Self-Review Checklist */}
        {status === 'completed' && (
          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Self-Review Checklist</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                (Personal confirmation only — no automated grading)
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Listen to your sample recording and confirm the audio conditions before taking the timed sections:
            </p>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={reviewAudible}
                  onChange={(e) => setReviewAudible(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <span className="font-medium">My voice is audible.</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={reviewClear}
                  onChange={(e) => setReviewClear(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <span className="font-medium">My speech is clear.</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={reviewNoise}
                  onChange={(e) => setReviewNoise(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <span className="font-medium">There is no major background noise.</span>
              </label>
            </div>
          </div>
        )}

        {/* Instructions Card: You Will Need a Working Microphone and Speaker */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
            <Headphones className="w-4 h-4 text-indigo-600" />
            <span>You Will Need a Working Microphone and Speaker</span>
          </h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span>Use a good-quality microphone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span>Avoid using the built-in laptop or computer microphone if an external microphone is available.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span>Make sure the speaker volume is not muted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span>Record in a quiet environment.</span>
            </li>
            <li className="flex items-start gap-2 sm:col-span-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span>Speak clearly at a natural pace.</span>
            </li>
          </ul>
        </div>

        {/* Bottom Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            {!isContinueEnabled ? (
              <span className="flex items-center gap-1 text-amber-600">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Complete a test recording above to unlock the Continue button.</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Microphone validated. Ready to navigate to section selection.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/setup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              Back
            </Link>

            <button
              type="button"
              id="btn-continue-audio-check"
              onClick={handleContinue}
              disabled={!isContinueEnabled}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
