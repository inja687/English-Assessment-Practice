import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  FileText,
  Volume2,
  Mic,
  Brain,
  Headphones,
  Sparkles,
  HelpCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

/**
 * FullAssessmentReportCard
 * Addresses user questions:
 * 1. "amr overall result koto" (Overall Assessment Result %)
 * 2. "ami konta section a koto % pelam" (Section-by-section % score breakdown table)
 * 3. "ki problem seta jeno thake" (Comprehensive mistake diagnostics with explanations & weak categories)
 */
export default function FullAssessmentReportCard({ report, showNavigationButtons = true }) {
  const [mistakeFilter, setMistakeFilter] = useState('all'); // 'all' | 'section-d' | 'section-e'

  if (!report) return null;

  const {
    displayOverallScore,
    metTarget,
    target,
    sectionsReport = [],
    allMistakes = [],
    mistakesCount = 0,
    weakGrammarCategories = [],
    isFullTestComplete,
    totalCompletedSections,
  } = report;

  const sectionIcons = {
    'section-a': FileText,
    'section-b': Volume2,
    'section-c': Mic,
    'section-d': Brain,
    'section-e': Headphones,
  };

  const filteredMistakes = allMistakes.filter((m) => {
    if (mistakeFilter === 'section-d') return m.sectionId === 'section-d';
    if (mistakeFilter === 'section-e') return m.sectionId === 'section-e';
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8" id="full-assessment-report-card">
      {/* ------------------------------------------------------------- */}
      {/* 1. OVERALL ASSESSMENT SCORE BANNER ("amr overall result koto") */}
      {/* ------------------------------------------------------------- */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg transition-all ${
        metTarget
          ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 text-white border-emerald-400'
          : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white border-indigo-400'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                <Award className="w-4 h-4" />
                <span>Full Mock Assessment Overall Result</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                metTarget ? 'bg-emerald-200 text-emerald-950' : 'bg-amber-200 text-amber-950'
              }`}>
                {metTarget ? 'Benchmark Achieved' : `Benchmark: ${target}%`}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white">
                {totalCompletedSections} of 5 Sections Completed
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {metTarget
                ? 'Excellent Performance! You Met Your Target Benchmark'
                : 'Test Complete — Review Identified Areas for Improvement Below'}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              Your overall score aggregates your objective English grammar usage and listening comprehension accuracy alongside your spoken voice modules.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 shrink-0">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-blue-100 block">
                Overall Score
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                {displayOverallScore}
              </div>
            </div>
            <div className="border-l border-white/20 pl-4 text-xs text-blue-100 space-y-1">
              <div>Target: <strong>{target}%</strong></div>
              <div>Errors: <strong className="text-amber-200">{mistakesCount}</strong></div>
              <div className="text-[11px] text-blue-200">
                {isFullTestComplete ? 'Full 5-Part Mock' : 'Partial Session'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SECTION-BY-SECTION SCORE BREAKDOWN ("konta section a koto %") */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Section-by-Section Performance Breakdown (কোন সেকশনে কত % পেলেন)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Complete review of your score % and completion across all 5 assessment modules.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
            5 Distinct Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectionsReport.map((sec) => {
            const Icon = sectionIcons[sec.id] || BookOpen;
            const isTargetMet = sec.isObjective ? (sec.percent !== null && sec.percent >= target) : (sec.percent === 100);

            return (
              <div
                key={sec.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-md ${
                  sec.attempted
                    ? isTargetMet
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-indigo-50/50 border-indigo-200'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sec.code}</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      sec.attempted
                        ? isTargetMet
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {sec.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {sec.title}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500 block mb-3">
                    {sec.category}
                  </span>

                  {/* Percentage Score Metric */}
                  <div className="py-2 px-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-0.5 mb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {sec.isObjective ? 'Section Score' : 'Module Progress'}
                      </span>
                      <span className="text-xl font-black font-mono text-slate-900">
                        {sec.displayScore}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium flex justify-between">
                      <span>{sec.scoreText}</span>
                      <span className="text-slate-400">{sec.timeUsedFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link
                    to={`/${sec.id}/intro`}
                    className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-700 hover:text-blue-600 py-1 transition"
                  >
                    <span>{sec.attempted ? 'Retake Module' : 'Start Module'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. IDENTIFIED PROBLEMS & MISTAKES ("ki problem seta jeno thake") */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-100 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Identified Mistakes & Diagnostics (ভুল প্রশ্ন ও কারণের বিশ্লেষণ)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Detailed list of questions answered incorrectly or skipped, with your response vs. correct answer and explanatory rules.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 mr-1">Filter Errors:</span>
            <button
              type="button"
              onClick={() => setMistakeFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                mistakeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Errors ({allMistakes.length})
            </button>
            <button
              type="button"
              onClick={() => setMistakeFilter('section-d')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                mistakeFilter === 'section-d'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Grammar Sec D ({allMistakes.filter((m) => m.sectionId === 'section-d').length})
            </button>
            <button
              type="button"
              onClick={() => setMistakeFilter('section-e')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                mistakeFilter === 'section-e'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              Listening Sec E ({allMistakes.filter((m) => m.sectionId === 'section-e').length})
            </button>
          </div>
        </div>

        {/* Weak Grammar Categories Banner */}
        {weakGrammarCategories.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Critical Weak Areas Identified (Accuracy &lt; 65%):</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {weakGrammarCategories.map((c) => (
                <div key={c.category} className="px-3 py-1 rounded-xl bg-white border border-amber-300 font-medium shadow-2xs">
                  <strong>{c.category}</strong>: <span className="text-rose-600 font-bold">{c.accuracy}% Accuracy</span> ({c.correct}/{c.total})
                </div>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
              💡 <strong>Actionable Tip:</strong> Review grammar rules for Subject-Verb agreement, Tense consistency, and Preposition placement before retaking Section D.
            </p>
          </div>
        )}

        {/* Mistakes List */}
        {filteredMistakes.length === 0 ? (
          <div className="p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-emerald-900">
              {allMistakes.length === 0 
                ? 'Outstanding! No Mistakes Found in Objective Sections' 
                : 'No mistakes recorded for this filter'}
            </h4>
            <p className="text-xs text-emerald-700 max-w-md mx-auto">
              {allMistakes.length === 0
                ? 'All answered grammar and comprehension questions were answered with 100% precision. Keep up the high standard!'
                : 'Select another filter above to inspect error details.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMistakes.map((mistake, index) => (
              <div
                key={mistake.id || index}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-md text-white font-bold text-xs flex items-center justify-center ${
                      mistake.sectionId === 'section-d' ? 'bg-amber-600' : 'bg-purple-600'
                    }`}>
                      {mistake.sectionCode}
                    </span>
                    <span className="font-bold text-slate-800 text-xs">
                      Question {mistake.questionNumber}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {mistake.category}
                    </span>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    mistake.isUnanswered
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {mistake.isUnanswered ? (
                      <>
                        <HelpCircle className="w-3 h-3" />
                        <span>Skipped / Unanswered</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Incorrect Selection</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Prompt */}
                <p className="text-sm font-bold text-slate-900 leading-snug">
                  "{mistake.prompt}"
                </p>

                {/* Answer comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                      ❌ Your Selected Answer:
                    </span>
                    <span className="font-bold text-rose-900 block text-sm">
                      {mistake.userAnswer}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      ✅ Correct Authentic Answer:
                    </span>
                    <span className="font-bold text-emerald-900 block text-sm">
                      {mistake.correctAnswer}
                    </span>
                  </div>
                </div>

                {/* Explanation / Rule */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs space-y-1">
                  <span className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Grammar Rule & Contextual Explanation:</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {mistake.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. SPOKEN SECTIONS (A, B, C) PRACTICE RECOMMENDATIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Mic className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Spoken Assessment (Sections A, B, C) Recommendations
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Section A (Calibration)</span>
            </span>
            <p className="leading-relaxed text-slate-600">
              Ensure clear enunciation of sibilant sounds ('s', 'z', 'sh') without rushing. Maintain 2 inches distance from your microphone to avoid audio clipping.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Section B (Repetition)</span>
            </span>
            <p className="leading-relaxed text-slate-600">
              For Part 2 (Listen & Say), speak immediately after the tone. Avoid adding filler words ('um', 'ah') and replicate the sentence stress pattern naturally.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>Section C (1-Min Speech)</span>
            </span>
            <p className="leading-relaxed text-slate-600">
              Use the 30-second prep time to mentally structure your 3 points: Introduction, personal experience / rationale, and concluding thought to speak comfortably for 60 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. ACTION BUTTONS */}
      {/* ------------------------------------------------------------- */}
      {showNavigationButtons && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Back to Home Dashboard</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/setup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#0c59cf] hover:bg-blue-600 active:bg-blue-800 text-white shadow-md transition"
            >
              <span>Take Another Full Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
