import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Construction, 
  Sparkles, 
  Volume2, 
  Mic, 
  CheckCircle2
} from 'lucide-react';

export default function AssessmentInstructions() {
  const location = useLocation();
  const isTextOnly = location.state?.isTextOnly ?? false;
  const cameraEnabled = location.state?.cameraEnabled ?? false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/setup"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Setup Checks</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
          Prompt 3 Staging Area
        </span>
      </div>

      {/* Main Notice Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
            <Construction className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Setup Complete • Instructions Stage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Instructions & Audio Calibration
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              System verification passed successfully! This is the placeholder route for <strong>Prompt 3</strong>, where audio quality checks and sample recording tests will be implemented.
            </p>
          </div>
        </div>

        {/* Verification Summary Pill */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>System Compatibility: <strong>Verified</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Text Input: <strong>Verified</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Voice Audio: <strong>{isTextOnly ? 'Text-Only Practice (Microphone Skipped)' : 'Microphone Ready'}</strong>
            </span>
          </div>
          {cameraEnabled && (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Webcam: <strong>Verified</strong></span>
            </div>
          )}
        </div>

        {/* Blueprint preview of upcoming Prompt 3 features */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Next Implementation Stage (Prompt 3)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1">
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span>Audio Playback Quality Test</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Test audio sample playback with a volume slider to ensure prompts and examiner questions will be heard distinctly.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm mb-1">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span>Sample Sentence Recording Check</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Record and playback the sample test sentence: <br />
                <em className="font-semibold text-slate-800 font-mono">“The quick brown fox jumps over the lazy dog”</em>.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/setup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Re-run Setup Checks</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
