import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Layers, 
  Clock, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock,
  Headphones
} from 'lucide-react';
import { ASSESSMENT_SUMMARY } from '../data/sections';
import { getLatestUnlockedSection, isSectionUnlocked } from '../utils/storage';

export default function WelcomePanel() {
  const latestUnlocked = getLatestUnlockedSection();
  const nextTarget = latestUnlocked === 'section-a' ? '/section-a/intro' : `/${latestUnlocked}/intro`;

  const sectionsList = [
    { code: 'A', name: 'Word Calibration', id: 'section-a' },
    { code: 'B', name: 'Sentence Read & Repeat', id: 'section-b' },
    { code: 'C', name: '1-Min Extempore', id: 'section-c' },
    { code: 'D', name: 'Grammar & Usage', id: 'section-d' },
    { code: 'E', name: 'Listening Stories', id: 'section-e' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#06182c] via-[#0b2447] to-[#111c38] text-white border border-slate-700/60 shadow-2xl transition-all">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 -ml-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 p-5 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headline, Description & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-xs">
                <Code2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Developed By <strong className="text-white font-bold">Injamamul</strong></span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Autonomous Simulator</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/80 hidden xs:inline-flex">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Corporate Voice Standard</span>
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight text-white leading-tight">
                Master Your Voice & English{' '}
                <span className="block mt-1 sm:mt-1.5 bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                  Corporate Assessment
                </span>
              </h1>
              <p className="mt-3 sm:mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Prepare with precision for voice & accent corporate evaluations. Practice speech pacing, pronunciation calibration, spontaneous extempore speaking, and grammar comprehension with automated timers and scoring.
              </p>
            </div>

            {/* Quick Metrics Bar (Responsive: Stacks on mobile, 3 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-700/60 backdrop-blur-md shadow-inner">
              <div className="flex items-center sm:flex-col sm:items-start gap-3 sm:gap-1 px-2">
                <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                    Questions
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {ASSESSMENT_SUMMARY.totalQuestions} Questions
                  </span>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-start gap-3 sm:gap-1 px-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0">
                <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                    Structure
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {ASSESSMENT_SUMMARY.totalSections} Modules (A–E)
                  </span>
                </div>
              </div>

              <div className="flex items-center sm:flex-col sm:items-start gap-3 sm:gap-1 px-2 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0">
                <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {ASSESSMENT_SUMMARY.totalMinutes} Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Link
                to="/setup"
                id="btn-start-assessment"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-[#0c59cf] hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-900/50 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                <span>Start Full Assessment</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/sections"
                id="btn-practice-sections"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold bg-slate-800/90 hover:bg-slate-700 active:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Browse Modules</span>
              </Link>

              <Link
                to="/audio-check"
                id="btn-check-mic"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mic & Audio Check</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Simulator Preview Widget (5 cols, hidden on very small screens, responsive) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/80 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-700/70 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white tracking-wide block">
                      Mock Session Monitor
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Audio Engine Active
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Ready
                </span>
              </div>

              {/* Animated Waveform Visualization */}
              <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 mb-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                    Speech Frequency Calibration
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-medium">Optimal 16kHz</span>
                </div>
                {/* Visualizer bars */}
                <div className="flex items-end justify-between gap-1 h-9 px-1">
                  {[45, 75, 30, 90, 60, 40, 85, 95, 55, 35, 70, 80, 50, 90, 65, 40, 85, 30, 75, 60].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-600 via-sky-400 to-indigo-300 rounded-full transition-all duration-300"
                      style={{ 
                        height: `${height}%`,
                        opacity: 0.75 + (i % 3) * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Section Unlocking Progress Track */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Sequential Test Progress</span>
                  <span className="text-[10px] font-mono text-blue-300">Step by Step</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {sectionsList.map((sec) => {
                    const unlocked = isSectionUnlocked(sec.id);
                    const isCurrent = latestUnlocked === sec.id;
                    return (
                      <div
                        key={sec.code}
                        className={`p-2 rounded-lg text-center border transition-all ${
                          unlocked
                            ? isCurrent
                              ? 'bg-blue-600/30 border-blue-400/60 text-white shadow-xs'
                              : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                        }`}
                        title={`${sec.name} (${unlocked ? 'Unlocked' : 'Locked'})`}
                      >
                        <div className="flex items-center justify-center gap-0.5 text-xs font-bold mb-0.5">
                          {sec.code}
                          {unlocked ? (
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          ) : (
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                          )}
                        </div>
                        <span className="text-[9px] block truncate text-slate-300 font-medium">
                          {unlocked ? (isCurrent ? 'Next' : 'Open') : 'Lock'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Resume Link */}
              <Link
                to={nextTarget}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-200 hover:text-white transition group"
              >
                <span>Jump directly to latest unlocked: <strong>Section {latestUnlocked.slice(-1).toUpperCase()}</strong></span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
