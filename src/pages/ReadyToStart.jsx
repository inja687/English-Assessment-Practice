import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  X,
  ArrowRight
} from 'lucide-react';
import { ASSESSMENT_SECTIONS, ASSESSMENT_SUMMARY } from '../data/sections';

export default function ReadyToStart() {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState('section-a');
  const [showModal, setShowModal] = useState(false);

  const handleStartTest = () => {
    if (selectedSection === 'section-a') {
      navigate('/section-a/intro');
    } else if (selectedSection === 'section-b') {
      navigate('/section-b/intro');
    } else if (selectedSection === 'section-c') {
      navigate('/section-c/intro');
    } else if (selectedSection === 'section-d') {
      navigate('/section-d/intro');
    } else if (selectedSection === 'section-e') {
      navigate('/section-e/intro');
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/audio-check"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Audio Quality Check</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
          Ready for Assessment
        </span>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>System Verification & Audio Calibration Complete</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All done. Ready to start?
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Select any section below (Sections A–E) and click <strong>Start Test</strong> to begin your assessment practice drill.
            </p>
          </div>

          {/* Test Metrics Overview Banner */}
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0">
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-blue-600">{ASSESSMENT_SUMMARY.totalQuestions}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Questions</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-slate-900">{ASSESSMENT_SUMMARY.totalSections}</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sections</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-amber-600">{ASSESSMENT_SUMMARY.totalMinutes}m</span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Time</span>
            </div>
          </div>
        </div>

        {/* Five Section Breakdown List with Section A Selectable */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Assessment Section Structure
            </h2>
            <span className="text-xs text-emerald-600 font-bold">
              All 5 Sections Active & Ready for Evaluation
            </span>
          </div>

          <div className="space-y-2.5">
            {ASSESSMENT_SECTIONS.map((section) => {
              const isSelected = selectedSection === section.id;
              const isSectionA = section.id === 'section-a';
              const isSectionB = section.id === 'section-b';
              const isSectionC = section.id === 'section-c';
              const isSectionD = section.id === 'section-d';
              const isSectionE = section.id === 'section-e';

              return (
                <div
                  key={section.id}
                  onClick={() => setSelectedSection(section.id)}
                  id={`card-select-${section.id}`}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-bold text-sm flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {section.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          {section.name} — {section.questionCount} Questions — {section.durationMinutes} Minutes
                        </h3>
                        {(isSectionA || isSectionB || isSectionC || isSectionD || isSectionE) && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Available Now
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {section.title} ({section.category})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                      {section.questionCount} Questions
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 font-semibold text-slate-700">
                      {section.durationMinutes} Mins
                    </span>
                    <input
                      type="radio"
                      name="selectedSection"
                      checked={isSelected}
                      onChange={() => setSelectedSection(section.id)}
                      className="ml-2 h-4 w-4 text-blue-600 accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Test Action Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/sections"
            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            Prefer to practice individual modules first?
          </Link>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              Back to Dashboard
            </Link>

            <button
              type="button"
              id="btn-start-test"
              onClick={handleStartTest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-base font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Unimplemented Sections B-E */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    All 5 Sections Active & Ready
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sections A, B, C, D & E are fully functional and ready for evaluation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              All 5 sections are active! Select any module: <strong>Section A (Audio Quality)</strong>, <strong>Section B (Reading & Listening)</strong>, <strong>Section C (Speaking)</strong>, <strong>Section D (Grammar & English Usage)</strong>, or <strong>Section E (Listening Comprehension)</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setSelectedSection('section-a');
                  navigate('/section-a/intro');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <span>Proceed to Section A</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
