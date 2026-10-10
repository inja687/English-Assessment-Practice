import React from 'react';
import { Link } from 'react-router-dom';
import { History, Calendar, ArrowRight, Award } from 'lucide-react';

export default function RecentAttempts({ attempts = [], onClear }) {
  if (!attempts || attempts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            <h2 className="text-base font-bold text-slate-800">Recent Practice Attempts</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Auto-saved locally</span>
        </div>

        {/* Honest Empty State */}
        <div className="text-center py-8 px-4 max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <History className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No practice attempts yet
          </h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            You haven't completed any full mock tests or individual section sessions yet. Your test results, speech pacing records, and section scores will appear here.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/setup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
            >
              <span>Take Full Mock Test</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sections"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              <span>Practice by Section</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-600" />
          <h2 className="text-base font-bold text-slate-800">Recent Practice Attempts</h2>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline transition"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/75 transition">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {attempt.title || 'Full Mock Assessment'}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>Duration: {attempt.timeSpent || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">
                {attempt.score !== undefined ? `${attempt.score}%` : 'Recorded'}
              </span>
              <p className="text-xs text-slate-400">Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
