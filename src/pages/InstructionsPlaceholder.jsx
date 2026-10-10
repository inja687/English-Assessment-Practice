import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  Volume2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Construction,
  Sparkles
} from 'lucide-react';
import { ASSESSMENT_SUMMARY } from '../data/sections';

export default function InstructionsPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
          Prompt 2 Staging Area
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
              <span>Assessment Setup Stage</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Instructions & Audio Setup
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              This is the dedicated placeholder route for the comprehensive pre-assessment setup stage. This stage will be fully implemented in <strong>Prompt 2</strong>.
            </p>
          </div>
        </div>

        {/* Blueprint preview of upcoming Prompt 2 features */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Upcoming Setup Checklist (Prompt 2 Implementation)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Mic className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Microphone Permission & Test</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Browser audio input verification with real-time waveform decibel indicator.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Audio Playback Check</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Synthetic test chime and speaker level calibration to ensure prompts are audible.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Environment & Quiet Room Check</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Guidelines to eliminate ambient noise, echoes, and background human conversation.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Pacing & Auto-Submission Rules</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Detailed section time allocation: {ASSESSMENT_SUMMARY.totalMinutes} minutes total for all {ASSESSMENT_SUMMARY.totalQuestions} questions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/sections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>Explore Individual Sections</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
