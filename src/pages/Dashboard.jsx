import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Target, 
  Trophy, 
  Clock, 
  ArrowRight,
  Sparkles,
  Lock,
  Mic,
  Volume2,
  Brain,
  ShieldCheck,
  RotateCcw,
  Headphones,
  FileText,
  Play,
  Award
} from 'lucide-react';
import WelcomePanel from '../components/WelcomePanel';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import RecentAttempts from '../components/RecentAttempts';
import { ASSESSMENT_SECTIONS, ASSESSMENT_SUMMARY } from '../data/sections';
import { 
  getAttempts, 
  getPracticeTarget, 
  clearAttempts,
  isSectionUnlocked,
  getLatestUnlockedSection,
  getCompletedSections,
  resetSectionLocking,
  getOverallAssessmentScore,
  calculatePerformanceAnalytics
} from '../utils/storage';

export default function Dashboard() {
  const [attempts, setAttempts] = useState(() => getAttempts());
  const [practiceTarget] = useState(() => getPracticeTarget());
  const [completedSections, setCompletedSections] = useState(() => getCompletedSections());

  const handleClearAttempts = () => {
    if (window.confirm('Are you sure you want to clear your local practice history?')) {
      clearAttempts();
      setAttempts([]);
    }
  };

  const handleResetLocking = () => {
    if (window.confirm('Reset all section locks back to Section A?')) {
      resetSectionLocking();
      setCompletedSections([]);
    }
  };

  const testsCompleted = attempts.length;
  const overallScoreData = getOverallAssessmentScore(attempts);
  const analytics = calculatePerformanceAnalytics(attempts);
  const overallScoreDisplay = overallScoreData.hasScore 
    ? overallScoreData.displayScore 
    : '--';

  const latestUnlocked = getLatestUnlockedSection();
  const nextTarget = latestUnlocked === 'section-a' ? '/section-a/intro' : `/${latestUnlocked}/intro`;

  const sectionFlow = [
    { id: 'section-a', code: 'A', name: 'Word Calibration', time: '5m', questions: '5 Qs', icon: FileText },
    { id: 'section-b', code: 'B', name: 'Sentence Repetition', time: '15m', questions: '18 Qs', icon: Volume2 },
    { id: 'section-c', code: 'C', name: '1-Min Extempore', time: '10m', questions: '3 Topics', icon: Mic },
    { id: 'section-d', code: 'D', name: 'Grammar & Usage', time: '15m', questions: '34 MCQs', icon: Brain },
    { id: 'section-e', code: 'E', name: 'Listening Stories', time: '10m', questions: '12 Qs', icon: Headphones },
  ];

  return (
    <div className="space-y-8 sm:space-y-10 pb-8">
      {/* 1. Hero Welcome Panel */}
      <WelcomePanel />

      {/* 2. Interactive Sequential Journey Stepper */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Sequential Assessment Journey
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                A → B → C → D → E
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Test unlocks in authentic sequential order. Complete each module or allow section timers to finish to proceed.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to={nextTarget}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#0c59cf] hover:bg-blue-600 active:bg-blue-800 text-white shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue: Section {latestUnlocked.slice(-1).toUpperCase()}</span>
            </Link>

            <button
              type="button"
              onClick={handleResetLocking}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
              title="Reset progress to Section A"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stepper Track */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {sectionFlow.map((sec) => {
            const isUnlocked = isSectionUnlocked(sec.id);
            const isCompleted = completedSections.includes(sec.id);
            const isCurrent = latestUnlocked === sec.id;
            const StepIcon = sec.icon;

            return (
              <div
                key={sec.id}
                className={`relative rounded-xl p-3.5 border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : isCurrent
                    ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20 text-blue-950 shadow-xs'
                    : isUnlocked
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold gap-1 ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : isUnlocked 
                        ? 'bg-slate-200 text-slate-700' 
                        : 'bg-slate-200 text-slate-400'
                    }`}>
                      <StepIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Sec {sec.code}
                    </span>
                  </div>

                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isUnlocked ? (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold tracking-tight mb-1 truncate">
                  {sec.name}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{sec.questions}</span>
                  <span>{sec.time}</span>
                </div>

                {isUnlocked ? (
                  <Link
                    to={`/${sec.id}/intro`}
                    className="mt-3 block text-center py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs transition"
                  >
                    {isCurrent ? 'Start Now' : 'Review'}
                  </Link>
                ) : (
                  <div className="mt-3 py-1.5 text-center text-[10px] font-bold text-slate-400 bg-slate-100 rounded-lg">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2b. Overall Assessment Performance Score Card (displayed when attempts exist) */}
      {overallScoreData.hasScore && (
        <section className={`p-5 sm:p-7 rounded-2xl border-2 transition-all shadow-sm ${
          overallScoreData.metTarget
            ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/70 border-emerald-300'
            : 'bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-100/70 border-purple-300'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Overall Mock Assessment Result
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  overallScoreData.metTarget 
                    ? 'bg-emerald-200 text-emerald-900 border border-emerald-300' 
                    : 'bg-purple-200 text-purple-900 border border-purple-300'
                }`}>
                  {overallScoreData.metTarget ? 'Target Benchmark Met' : 'Below Practice Target'}
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                  overallScoreData.metTarget ? 'text-emerald-700' : 'text-purple-700'
                }`}>
                  {overallScoreData.displayScore}
                </span>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  Practice Benchmark: <strong>{practiceTarget}%</strong>
                  {analytics.overallMCQAnswered > 0 && (
                    <span className="block text-slate-500 text-xs mt-0.5">
                      Cumulative accuracy: {analytics.overallMCQCorrect} correct out of {analytics.overallMCQAnswered} objective questions
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {analytics.sectionDAnalytics.latestScore !== null && (
                <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Section D</span>
                  <strong className="text-slate-800 font-bold">{analytics.sectionDAnalytics.latestScore}%</strong>
                </div>
              )}
              {analytics.sectionEAnalytics.latestScore !== null && (
                <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Section E</span>
                  <strong className="text-slate-800 font-bold">{analytics.sectionEAnalytics.latestScore}%</strong>
                </div>
              )}
              <Link
                to="/results"
                id="btn-view-detailed-results"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition shadow-xs"
              >
                <span>View Full Results</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. Key Metrics & Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Tests Completed"
          value={testsCompleted}
          subtitle="Mock modules taken"
          icon={CheckCircle2}
          color="blue"
          badge={testsCompleted === 0 ? 'Not Started' : 'Active'}
        />
        <StatCard
          title="Overall Practice Score"
          value={overallScoreDisplay}
          subtitle={
            overallScoreData.hasScore
              ? overallScoreData.metTarget
                ? `Benchmark Met (>= ${practiceTarget}%)`
                : `Target: ${practiceTarget}% (Keep Practicing)`
              : "Complete Section D or E to compute"
          }
          icon={Trophy}
          color="emerald"
          badge={overallScoreData.hasScore ? (overallScoreData.metTarget ? 'Target Met' : 'In Progress') : 'Not Taken Yet'}
        />
        <StatCard
          title="Practice Target"
          value={`${practiceTarget}%`}
          subtitle="Proficiency benchmark"
          icon={Target}
          color="indigo"
          badge="Configurable"
        />
        <StatCard
          title="Full Assessment Time"
          value={`${ASSESSMENT_SUMMARY.totalMinutes}m`}
          subtitle="72 questions total"
          icon={Clock}
          color="amber"
          badge="5 Modules"
        />
      </section>

      {/* 4. Five Section Cards Grid */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Assessment Modules</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                5 Total
              </span>
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Practice each module individually to focus on pronunciation, voice fluency, extempore speech, and grammar.
            </p>
          </div>
          <Link
            to="/sections"
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Section Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {ASSESSMENT_SECTIONS.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}

          {/* Voice Clarity Checklist Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0e1d38] text-slate-100 rounded-2xl p-6 shadow-md flex flex-col justify-between border border-slate-700">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Examiner Pro Tips</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Voice Clarity Checklist
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 mt-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <span>Use wired headphones or a dedicated headset to reduce background room echo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <span>Maintain an even pace without rushing, pausing naturally between commas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                  <span>Enunciate ending consonants crisply (e.g., "-ed", "-ing", "-s", "-t").</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-700/80 mt-4 flex items-center justify-between">
              <Link
                to="/audio-check"
                className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1"
              >
                <span>Calibrate Mic</span>
                <Mic className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/setup"
                className="text-xs font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1"
              >
                <span>Read Guidelines</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why This Practice Portal Section (Interactive Highlights) */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Autonomous Practice Standard</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
            Why Practice With This Platform?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Engineered to faithfully reproduce the high-stakes corporate English speech assessment environment, giving you the edge before official testing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                Authentic Section Timers
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experience real 15-second sentence recording windows, 60-second spontaneous extempore limits, and strict 15-minute grammar countdowns.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                Dynamic Question Rotation
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Includes 108 authentic grammar MCQs, 8 listening stories, 17 sentence paragraphs, and 13 extempore topics that automatically rotate on retakes.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                Web Speech Engine Playback
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Listen to natural spoken English audio for listening stories and sentence repetition with single-play protection matching test rules.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/50 border border-slate-800/80 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                Objective Local Scoring & Analytics
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Instant objective grading for objective grammar and listening tasks, full pedagogical explanations for every option, and offline storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Progress and Attempt History */}
      <section className="space-y-4">
        <RecentAttempts attempts={attempts} onClear={handleClearAttempts} />
      </section>
    </div>
  );
}
