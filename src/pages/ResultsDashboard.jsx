import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Eye, 
  ArrowRight, 
  ArrowLeft, 
  Sliders, 
  Calendar, 
  Mic, 
  Layers, 
  X, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Minus
} from 'lucide-react';
import { 
  getAttempts, 
  clearAttempts, 
  getPracticeTarget, 
  savePracticeTarget, 
  calculatePerformanceAnalytics 
} from '../utils/storage';
import { ASSESSMENT_SECTIONS } from '../data/sections';

export default function ResultsDashboard() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(() => getAttempts());
  const [practiceTarget, setPracticeTargetState] = useState(() => getPracticeTarget());
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics' | 'history'
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');
  const [viewingAttempt, setViewingAttempt] = useState(null); // Attempt object for detail modal
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // Sync practice target
  const handleTargetChange = (val) => {
    const updated = savePracticeTarget(val);
    setPracticeTargetState(updated);
  };

  // Clear attempts
  const handleConfirmClear = () => {
    clearAttempts();
    setAttempts([]);
    setShowClearConfirmModal(false);
  };

  // Re-calculate analytics whenever attempts or practiceTarget change
  const analytics = useMemo(() => {
    return calculatePerformanceAnalytics(attempts);
  }, [attempts]);

  // Filtered attempts for history tab
  const filteredAttempts = useMemo(() => {
    if (selectedSectionFilter === 'all') return attempts;
    return attempts.filter((a) => a.sectionId === selectedSectionFilter);
  }, [attempts, selectedSectionFilter]);

  // Helper format time
  const formatTime = (secs) => {
    if (secs === undefined || secs === null) return 'N/A';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Helper format date
  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            Local Browser Storage
          </span>
          {attempts.length > 0 && (
            <button
              type="button"
              id="btn-clear-history-modal"
              onClick={() => setShowClearConfirmModal(true)}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Assessment Diagnostics & Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Assessment Results & Performance
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Unified cross-section diagnostic dashboard. Review your objective grammar & listening accuracy, check recording completions, inspect past attempt logs, and analyze trends.
            </p>
          </div>

          {/* Configurable Practice Target Widget */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shrink-0 space-y-2.5 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                <span>Personal Target:</span>
              </span>
              <span className="text-sm font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200 font-mono">
                {practiceTarget}%
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={practiceTarget}
              onChange={(e) => handleTargetChange(Number(e.target.value))}
              id="results-target-slider"
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <p className="text-[11px] text-slate-500 leading-tight">
              Personal practice benchmark. Not an official Genpact pass threshold.
            </p>
          </div>
        </div>

        {/* 6 Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-2xl font-black text-slate-900" id="stat-total-attempts">
              {analytics.totalAttempts}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Attempts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-2xl font-black text-blue-600" id="stat-completed-sections">
              {analytics.totalCompletedSections}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed Sections
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-2xl font-black text-indigo-600" id="stat-mcqs-answered">
              {analytics.overallMCQAnswered}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MCQs Answered
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-2xl font-black text-emerald-600" id="stat-mcqs-correct">
              {analytics.overallMCQCorrect}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MCQs Correct
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-2xl font-black text-purple-600" id="stat-mcq-accuracy">
              {analytics.overallMCQAnswered > 0 ? `${analytics.overallMCQAccuracy}%` : '--'}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              MCQ Accuracy
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-xs font-bold text-slate-800 truncate" id="stat-latest-date">
              {analytics.latestAttemptDate ? new Date(analytics.latestAttemptDate).toLocaleDateString() : 'None Yet'}
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
              Latest Attempt
            </span>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            id="tab-overview"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Section Overviews & Latest Results</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            id="tab-analytics"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Cross-Section Analytics & Trends</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            id="tab-history"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Attempt History Logs ({attempts.length})</span>
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & LATEST SECTION RESULTS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Latest Result by Section</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                5 Sections
              </span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Click "View Details" to inspect question breakdowns
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ASSESSMENT_SECTIONS.map((sec) => {
              const latestAtt = analytics.recentBySection[sec.id];
              const isObj = sec.id === 'section-d' || sec.id === 'section-e';

              return (
                <div
                  key={sec.id}
                  id={`latest-card-${sec.id}`}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                          {sec.code}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                            {sec.name}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {sec.title}
                          </h3>
                        </div>
                      </div>

                      {latestAtt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
                          <span>Not Attempted</span>
                        </span>
                      )}
                    </div>

                    {/* Stats Body */}
                    {latestAtt ? (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                        {isObj ? (
                          <div className="flex items-baseline justify-between border-b border-slate-200/70 pb-2">
                            <span className="text-slate-500 font-medium">Score Achieved:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-slate-900 font-mono">
                                {latestAtt.scorePercent}%
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                latestAtt.scorePercent >= practiceTarget 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {latestAtt.scorePercent >= practiceTarget ? 'Met Target' : 'Below Target'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-between border-b border-slate-200/70 pb-2">
                            <span className="text-slate-500 font-medium">Recordings:</span>
                            <span className="text-sm font-extrabold text-blue-700">
                              {latestAtt.attemptedCount} of {latestAtt.totalQuestions} Completed
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-600">
                          <span>Questions Handled:</span>
                          <strong>{latestAtt.attemptedCount} / {latestAtt.totalQuestions}</strong>
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span>Time Used:</span>
                          <strong>{formatTime(latestAtt.timeUsedSeconds)}</strong>
                        </div>

                        <div className="flex justify-between text-slate-500 text-[11px]">
                          <span>Attempt Date:</span>
                          <span>{formatDate(latestAtt.submittedAt)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 text-center space-y-1">
                        <Clock className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-slate-600 block">No record for this module</span>
                        <span className="text-[11px] text-slate-400 block">
                          {sec.questionCount} Questions • {sec.durationMinutes} Minutes
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {latestAtt ? (
                      <button
                        type="button"
                        onClick={() => setViewingAttempt(latestAtt)}
                        id={`btn-view-details-${sec.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No details yet</span>
                    )}

                    <Link
                      to={`/${sec.id}/intro`}
                      id={`btn-retake-${sec.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition"
                    >
                      <span>{latestAtt ? 'Retake Section' : 'Start Section'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: CROSS-SECTION PERFORMANCE ANALYTICS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {attempts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Insufficient Data for Analytics</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete at least one assessment attempt in Section D (Grammar) or Section E (Listening) to populate diagnostic category graphs, trends, and weakness identification.
              </p>
              <Link
                to="/sections"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <span>Browse Assessment Sections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Section D Grammar Diagnostic Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Section D Grammar Diagnostic
                      </span>
                      {analytics.sectionDAnalytics.scoreTrend && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          analytics.sectionDAnalytics.scoreTrend.startsWith('+')
                            ? 'bg-emerald-100 text-emerald-800'
                            : analytics.sectionDAnalytics.scoreTrend.startsWith('-')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {analytics.sectionDAnalytics.scoreTrend.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : analytics.sectionDAnalytics.scoreTrend.startsWith('-') ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>Trend: {analytics.sectionDAnalytics.scoreTrend}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Grammar Categories Accuracy Across Attempts
                    </h3>
                  </div>

                  <span className="text-xs text-slate-500">
                    {analytics.sectionDAnalytics.attemptsCount} Section D Attempt(s) Logged
                  </span>
                </div>

                {/* Categories progress bars */}
                {Object.keys(analytics.sectionDAnalytics.categoryBreakdown).length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(analytics.sectionDAnalytics.categoryBreakdown).map(([cat, stat]) => (
                        <div key={cat} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{cat}</span>
                            <span className="font-extrabold font-mono text-slate-900">
                              {stat.accuracy}% ({stat.correct}/{stat.total})
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                stat.accuracy >= practiceTarget
                                  ? 'bg-emerald-500'
                                  : stat.accuracy >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${stat.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Weak Categories Callout */}
                    {analytics.sectionDAnalytics.weakCategories.length > 0 && (
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 mt-4">
                        <div className="flex items-center gap-2 font-bold">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Identified Areas for Practice (Accuracy &lt; 65%):</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          Focus on: {analytics.sectionDAnalytics.weakCategories.map((c) => `${c.category} (${c.accuracy}%)`).join(', ')}. Review your past answers for detailed grammar explanations.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    No Section D attempts recorded yet. Take Section D to generate grammar category diagnostics.
                  </p>
                )}
              </div>

              {/* Section E Listening Comprehension Diagnostic */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        Section E Auditory Diagnostic
                      </span>
                      {analytics.sectionEAnalytics.scoreTrend && (
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          analytics.sectionEAnalytics.scoreTrend.startsWith('+')
                            ? 'bg-emerald-100 text-emerald-800'
                            : analytics.sectionEAnalytics.scoreTrend.startsWith('-')
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {analytics.sectionEAnalytics.scoreTrend.startsWith('+') ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : analytics.sectionEAnalytics.scoreTrend.startsWith('-') ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          <span>Trend: {analytics.sectionEAnalytics.scoreTrend}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Listening Recall & Story Comprehension Summary
                    </h3>
                  </div>

                  <span className="text-xs text-slate-500">
                    {analytics.sectionEAnalytics.attemptsCount} Section E Attempt(s) Logged
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                    <span className="block text-2xl font-bold text-purple-800">
                      {analytics.sectionEAnalytics.storiesPlayedTotal}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 uppercase">
                      Total Stories Heard
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-2xl font-bold text-slate-800">
                      {analytics.sectionEAnalytics.mcqsAnsweredTotal}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">
                      Comprehension MCQs
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="block text-2xl font-bold text-emerald-800">
                      {analytics.sectionEAnalytics.mcqsCorrectTotal}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">
                      Correct Answers
                    </span>
                  </div>
                </div>
              </div>

              {/* Recording Sections Transparency Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Mic className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Spoken Recording Sections (Sections A, B & C)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Section A (Audio Quality)</span>
                    <span className="text-slate-600 block">
                      {analytics.recordingAnalytics.sectionA.totalCompleted} recordings across {analytics.recordingAnalytics.sectionA.attempts} attempt(s)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Section B (Reading & Listening)</span>
                    <span className="text-slate-600 block">
                      {analytics.recordingAnalytics.sectionB.totalCompleted} recordings across {analytics.recordingAnalytics.sectionB.attempts} attempt(s)
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Section C (1-Minute Speaking)</span>
                    <span className="text-slate-600 block">
                      {analytics.recordingAnalytics.sectionC.totalCompleted} recordings across {analytics.recordingAnalytics.sectionC.attempts} attempt(s)
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                  <strong>Assessment Transparency Notice:</strong> Spoken recording sections reflect recording task completion and candidate self-reviews. As this is an offline personal mock practice portal, no artificial speech pronunciation scores are claimed or fabricated.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: ATTEMPT HISTORY LOGS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Historical Attempt Log
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All saved attempts are persisted locally in your browser session. Sorted newest-first.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500 mr-1">Filter:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'section-a', label: 'Sec A' },
                { id: 'section-b', label: 'Sec B' },
                { id: 'section-c', label: 'Sec C' },
                { id: 'section-d', label: 'Sec D' },
                { id: 'section-e', label: 'Sec E' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedSectionFilter(f.id)}
                  id={`filter-${f.id}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedSectionFilter === f.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="text-center py-12 px-4 max-w-sm mx-auto space-y-2">
              <Clock className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No attempts found</h4>
              <p className="text-xs text-slate-500">
                {selectedSectionFilter === 'all'
                  ? 'You have not submitted any test attempts yet. Complete a section to begin tracking your history.'
                  : `No completed attempts recorded for ${selectedSectionFilter.toUpperCase()}.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-3">Date & Time</th>
                    <th className="py-3 px-3">Section</th>
                    <th className="py-3 px-3">Result / Score</th>
                    <th className="py-3 px-3">Questions</th>
                    <th className="py-3 px-3">Time Used</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAttempts.map((att, idx) => {
                    const isObj = att.isObjective;
                    const attemptNumber = attempts.length - idx;

                    return (
                      <tr key={att.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-medium text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDate(att.submittedAt)}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-slate-100 font-bold text-[10px] text-slate-700 flex items-center justify-center">
                              {att.sectionId ? att.sectionId.replace('section-', '').toUpperCase() : 'M'}
                            </span>
                            <span className="font-bold text-slate-800 truncate max-w-[200px]">
                              {att.sectionName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">#{attemptNumber}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {isObj ? (
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-slate-900 font-mono text-sm">
                                {att.scorePercent}%
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                att.scorePercent >= (att.practiceTarget || practiceTarget)
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {att.scorePercent >= (att.practiceTarget || practiceTarget) ? 'Met Target' : 'Below'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-blue-700 font-bold">
                              {att.attemptedCount}/{att.totalQuestions} Recorded
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span>{att.attemptedCount} of {att.totalQuestions} Attempted</span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap font-mono">
                          {formatTime(att.timeUsedSeconds)}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setViewingAttempt(att)}
                            id={`btn-history-view-${att.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* ATTEMPT DETAIL MODAL */}
      {/* --------------------------------------------------------------------- */}
      {viewingAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                  Historical Attempt Record
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {viewingAttempt.sectionName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>Completed: {formatDate(viewingAttempt.submittedAt)}</span>
                  <span>•</span>
                  <span>Duration: {formatTime(viewingAttempt.timeUsedSeconds)}</span>
                  <span>•</span>
                  <span>Target: {viewingAttempt.practiceTarget || practiceTarget}%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingAttempt(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score & Key Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-xl font-bold text-slate-900">
                  {viewingAttempt.totalQuestions}
                </span>
                <span className="text-slate-500 font-medium">Total Items</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="block text-xl font-bold text-blue-700">
                  {viewingAttempt.attemptedCount}
                </span>
                <span className="text-slate-500 font-medium">Attempted</span>
              </div>

              {viewingAttempt.isObjective ? (
                <>
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="block text-xl font-bold text-emerald-800">
                      {viewingAttempt.correctCount}
                    </span>
                    <span className="text-emerald-700 font-medium">Correct</span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200">
                    <span className="block text-xl font-black text-purple-800">
                      {viewingAttempt.scorePercent}%
                    </span>
                    <span className="text-purple-700 font-medium">Accuracy</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-xl font-bold text-amber-700">
                      {viewingAttempt.revisitCount || 0}
                    </span>
                    <span className="text-slate-500 font-medium">Revisit Flagged</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-xl font-bold text-slate-700">
                      {viewingAttempt.unansweredCount || 0}
                    </span>
                    <span className="text-slate-500 font-medium">Unattempted</span>
                  </div>
                </>
              )}
            </div>

            {/* Section-Specific Breakdown */}
            {/* Section D Categories */}
            {viewingAttempt.sectionId === 'section-d' && viewingAttempt.categoryPerformance && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Category Breakdown in This Attempt:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(viewingAttempt.categoryPerformance).map(([cat, stat]) => (
                    <div key={cat} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{cat}</span>
                      <span className="font-mono font-bold text-slate-900">
                        {stat.accuracy}% ({stat.correct}/{stat.total})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section E Stories Breakdown */}
            {viewingAttempt.sectionId === 'section-e' && viewingAttempt.storyPerformance && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Listening Stories Performance:
                </h4>
                <div className="space-y-2">
                  {viewingAttempt.storyPerformance.map((st, i) => (
                    <div key={i} className="p-3 rounded-xl bg-purple-50/40 border border-purple-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-purple-950 font-bold">
                          Story {st.storyNumber}: {st.storyTitle}
                        </strong>
                        <span className="font-bold text-slate-700">
                          {st.mcqsCorrect} of {st.mcqsTotal} MCQs Correct
                        </span>
                      </div>
                      <p className="text-slate-700 italic">"{st.script}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question by Question Review List */}
            {viewingAttempt.questionsReview && viewingAttempt.questionsReview.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Question Review ({viewingAttempt.questionsReview.length} items):
                </h4>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {viewingAttempt.questionsReview.map((qr, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-slate-900">
                          Question {qr.questionNumber}: {qr.prompt}
                        </span>
                        {qr.isCorrect !== undefined ? (
                          qr.isCorrect ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                              Correct
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 shrink-0">
                              Incorrect
                            </span>
                          )
                        ) : qr.isAttempted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                            Recorded
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-600 shrink-0">
                            Skipped
                          </span>
                        )}
                      </div>

                      {qr.userAnswer !== undefined && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className={`p-1.5 rounded ${qr.isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                            <span className="text-slate-500 font-bold">Your answer: </span>
                            <span>{qr.userAnswer || 'None'}</span>
                          </div>
                          <div className="p-1.5 rounded bg-emerald-50 text-emerald-900">
                            <span className="text-slate-500 font-bold">Correct answer: </span>
                            <span>{qr.correctAnswer}</span>
                          </div>
                        </div>
                      )}

                      {qr.explanation && (
                        <p className="text-[11px] text-slate-600 pt-0.5">
                          <strong>Rationale:</strong> {qr.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setViewingAttempt(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewingAttempt(null);
                  navigate(`/${viewingAttempt.sectionId}/intro`);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake This Section</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* CLEAR HISTORY CONFIRMATION MODAL */}
      {/* --------------------------------------------------------------------- */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Clear All Attempt History?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  This will permanently delete all saved assessment attempts and diagnostic records from your browser's local storage. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                id="btn-confirm-delete-history"
                onClick={handleConfirmClear}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Yes, Clear All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
