import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Layers, 
  Construction, 
  CheckCircle2
} from 'lucide-react';
import { getSectionById, ASSESSMENT_SECTIONS } from '../data/sections';

export default function SectionPlaceholder() {
  const { sectionId } = useParams();

  if (sectionId === 'section-a' || sectionId === 'a') {
    return <Navigate to="/section-a/intro" replace />;
  }

  if (sectionId === 'section-b' || sectionId === 'b') {
    return <Navigate to="/section-b/intro" replace />;
  }

  if (sectionId === 'section-c' || sectionId === 'c') {
    return <Navigate to="/section-c/intro" replace />;
  }

  if (sectionId === 'section-d' || sectionId === 'd') {
    return <Navigate to="/section-d/intro" replace />;
  }

  if (sectionId === 'section-e' || sectionId === 'e') {
    return <Navigate to="/section-e/intro" replace />;
  }

  const section = getSectionById(sectionId);

  if (!section) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Section Not Found</h2>
        <p className="text-slate-500 mb-6 text-sm">
          The requested section code "{sectionId}" does not exist in the curriculum.
        </p>
        <Link
          to="/sections"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Section Selection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/sections"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Sections</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
          Module Preview
        </span>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                {section.name}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {section.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {section.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-bold text-slate-800">{section.questionCount}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Questions</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="block text-xl font-bold text-slate-800">{section.durationMinutes}m</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Duration</span>
            </div>
          </div>
        </div>

        {/* Notice Message */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
          <Construction className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">
              Module Under Construction
            </h3>
            <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
              This section will be implemented in a later setup step. The timed question flow, speech recorder, and audio prompts for {section.name} are coming in the subsequent implementation steps.
            </p>
          </div>
        </div>

        {/* Section Specification Details */}
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Section Specification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Overview & Format
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">
                {section.description}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Assessed Dimensions
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {section.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Other Sections Quick Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Explore Other Sections
          </h3>
          <div className="flex flex-wrap gap-2">
            {ASSESSMENT_SECTIONS.map((s) => (
              <Link
                key={s.id}
                to={`/practice/${s.id}`}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                  s.id === section.id
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.name} ({s.questionCount} Qs)
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/sections"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Layers className="w-4 h-4" />
            <span>Back to All Sections</span>
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
