import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Trash2, 
  Check, 
  Target, 
  Bell, 
  Volume2,
  AlertTriangle
} from 'lucide-react';
import { 
  getSettings, 
  saveSettings, 
  resetSettings, 
  clearAttempts, 
  getPracticeTarget, 
  savePracticeTarget 
} from '../utils/storage';

export default function Settings() {
  const [formSettings, setFormSettings] = useState(() => getSettings());
  const [practiceTarget, setPracticeTarget] = useState(() => getPracticeTarget());
  const [savedNotification, setSavedNotification] = useState(false);
  const [resetNotification, setResetNotification] = useState(false);
  const [clearedNotification, setClearedNotification] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);

  const handleChange = (field, value) => {
    setFormSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    savePracticeTarget(practiceTarget);
    saveSettings({ ...formSettings, targetScore: practiceTarget });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Reset all practice preferences to defaults?')) {
      const defaults = resetSettings();
      setFormSettings(defaults);
      setPracticeTarget(60);
      setResetNotification(true);
      setTimeout(() => setResetNotification(false), 3000);
    }
  };

  const handleConfirmClearProgress = () => {
    clearAttempts();
    setShowClearModal(false);
    setClearedNotification(true);
    setTimeout(() => setClearedNotification(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200 text-slate-700">
          Preferences
        </span>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Portal Settings & Preferences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Configure target thresholds, simulated timer alerts, and manage local practice storage.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {savedNotification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings and practice target saved successfully in localStorage.</span>
          </div>
        )}

        {resetNotification && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-blue-600" />
            <span>Settings reset to default values.</span>
          </div>
        )}

        {clearedNotification && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-amber-600" />
            <span>All local practice attempt history has been cleared safely.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Practice Target Score */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <label htmlFor="targetScore" className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span>Personal Practice Target</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Your personal proficiency benchmark (default: 60%). Used across objective modules (Sections D & E) to gauge readiness.
                </p>
              </div>
              <span className="text-base font-extrabold text-purple-700 bg-white px-3 py-1 rounded-lg border border-slate-200 font-mono" id="label-practice-target">
                {practiceTarget}%
              </span>
            </div>
            <input
              id="targetScore"
              type="range"
              min="40"
              max="90"
              step="5"
              value={practiceTarget}
              onChange={(e) => setPracticeTarget(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
              <span>40% (Foundation)</span>
              <span>60% (Default Benchmark)</span>
              <span>75% (Proficient)</span>
              <span>90% (Advanced)</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2 italic">
              Notice: This is a personal practice target, not an official Genpact passing score.
            </span>
          </div>

          {/* Timer Warning Alert */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <label htmlFor="timerAlert" className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>Timer Expiry Warning</span>
                </label>
                <p className="text-xs text-slate-500 mt-1">
                  Trigger an on-screen warning color change before a timed section ends.
                </p>
              </div>
            </div>
            <select
              id="timerAlert"
              value={formSettings.timerAlertMinutes || 2}
              onChange={(e) => handleChange('timerAlertMinutes', parseInt(e.target.value, 10))}
              className="mt-2 block w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="1">1 Minute Remaining</option>
              <option value="2">2 Minutes Remaining (Default)</option>
              <option value="3">3 Minutes Remaining</option>
            </select>
          </div>

          {/* Sound & Navigation Toggles */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Audio & Assessment Flow</span>
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Sound Effects & Prompt Chimes</span>
                <span className="text-[11px] text-slate-500">Play an audible chime before recording questions begin</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.enableSoundEffects ?? true}
                onChange={(e) => handleChange('enableSoundEffects', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Auto-Advance Questions</span>
                <span className="text-[11px] text-slate-500">Automatically move to the next item when recording timer expires</span>
              </div>
              <input
                type="checkbox"
                checked={formSettings.autoAdvance ?? false}
                onChange={(e) => handleChange('autoAdvance', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="submit"
                id="btn-save-settings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Defaults</span>
              </button>
            </div>

            <button
              type="button"
              id="btn-open-clear-progress-modal"
              onClick={() => setShowClearModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Progress & Clear History</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reset Progress Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Reset Progress & Clear History?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Resetting progress permanently deletes all browser-local attempt history and diagnostic records from localStorage.
                </p>
                <p className="text-xs text-rose-700 font-semibold mt-1">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                id="btn-confirm-reset-progress"
                onClick={handleConfirmClearProgress}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition"
              >
                Confirm Reset Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
