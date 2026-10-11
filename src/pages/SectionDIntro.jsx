import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

/**
 * Section D Introduction Screen
 * Matches Screenshot 3 design:
 * - Dark navy-blue page background (#07192f)
 * - Large white rectangular content panel near the top
 * - Heading: "Section - D"
 * - Thin line divider below heading
 * - Explanatory paragraph describing grammar assessment
 * - Blue "Proceed to Test" button aligned toward lower-left
 */
export default function SectionDIntro() {
  const navigate = useNavigate();
  const location = useLocation();
  const lockedNotice = location.state?.lockedMessage;

  return (
    <div className="min-h-screen bg-[#07192f] text-slate-800 flex flex-col justify-start items-center px-4 sm:px-6 py-6 sm:py-10">
      {/* Locked Section Notice Banner */}
      {lockedNotice && (
        <div className="w-full max-w-4xl mb-4 p-4 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-md backdrop-blur-xs">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block text-amber-300 font-bold">Sequential Section Locked</strong>
            <span>{lockedNotice}</span>
          </div>
        </div>
      )}

      {/* Top subtle back navigation */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <Link
          to="/sections"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Sections</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Developed By <strong className="text-slate-300 font-semibold">Injamamul</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Section D Briefing
          </span>
        </div>
      </div>

      {/* Main Rectangular Content Panel matching Screenshot 3 */}
      <div className="w-full max-w-4xl bg-white rounded-md shadow-xl border border-slate-200/90 p-5 sm:p-8 md:p-10 transition-all">
        {/* Heading: Section - D */}
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Section - D
        </h1>

        {/* Thin divider below heading */}
        <div className="border-b border-slate-200 mt-3 sm:mt-4 mb-5 sm:mb-6" />

        {/* Explanatory Paragraph */}
        <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed font-normal">
          This section evaluates your mastery of standard English grammar and usage. It contains 34 multiple-choice questions arranged sequentially in 6 fixed parts, following the authentic assessment paper structure:
        </p>

        {/* 6 Sequential Parts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-5">
          <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Part 1 (Q1–Q7)</span>
            <span className="text-xs font-semibold text-slate-800">Verb Forms (Bracket)</span>
          </div>
          <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Part 2 (Q8–Q14)</span>
            <span className="text-xs font-semibold text-slate-800">Appropriate Tense</span>
          </div>
          <div className="p-2.5 rounded-lg border border-fuchsia-200 bg-fuchsia-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-700 block">Part 3 (Q15–Q19)</span>
            <span className="text-xs font-semibold text-slate-800">Appropriate Article</span>
          </div>
          <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Part 4 (Q20–Q24)</span>
            <span className="text-xs font-semibold text-slate-800">Appropriate Preposition</span>
          </div>
          <div className="p-2.5 rounded-lg border border-purple-200 bg-purple-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Part 5 (Q25–Q29)</span>
            <span className="text-xs font-semibold text-slate-800">Change the Voice</span>
          </div>
          <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Part 6 (Q30–Q34)</span>
            <span className="text-xs font-semibold text-slate-800">Correct Sentence Selection</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
          Carefully read each question and select the single best option that correctly completes the sentence or repairs the error. The total duration for this section is 15 minutes.
        </p>

        {/* Action Button: Proceed to Test aligned toward lower-left */}
        <div className="mt-6 sm:mt-8 pt-2">
          <button
            type="button"
            id="btn-proceed-to-section-d-test"
            onClick={() => navigate('/section-d/test')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded bg-[#0c59cf] hover:bg-[#094ab0] active:bg-[#083e94] text-white text-sm font-medium tracking-wide shadow-xs transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Proceed to Test
          </button>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="w-full max-w-4xl mt-6 text-center text-xs text-slate-400/90">
        English Assessment Practice • Developed By <strong className="text-slate-300 font-semibold">Injamamul</strong>
      </div>
    </div>
  );
}
