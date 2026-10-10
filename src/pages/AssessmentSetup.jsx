import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import SetupChecklist from '../components/setup/SetupChecklist';
import CompatibilityCheck from '../components/setup/CompatibilityCheck';
import MediaPermissionsCheck from '../components/setup/MediaPermissionsCheck';
import TextInputCheck from '../components/setup/TextInputCheck';
import { ASSESSMENT_SUMMARY } from '../data/sections';

export default function AssessmentSetup() {
  const navigate = useNavigate();

  // State for the 3 checklist items
  const [systemStatus, setSystemStatus] = useState('not_checked');
  const [micStatus, setMicStatus] = useState('not_checked');
  const [cameraStatus, setCameraStatus] = useState('not_checked');
  const [inputStatus, setInputStatus] = useState('not_checked');

  // Handle media state changes
  const handleMediaStateChange = (type, status) => {
    if (type === 'mic') {
      setMicStatus(status);
    } else if (type === 'camera') {
      setCameraStatus(status);
    }
  };

  const handleSkipMic = () => {
    setMicStatus('skipped');
  };

  const handleSkipCamera = () => {
    setCameraStatus('skipped');
  };

  // Derive media overall status for the top checklist
  const getOverallMediaStatus = () => {
    if (micStatus === 'passed' || micStatus === 'skipped') {
      return 'passed';
    }
    if (micStatus === 'denied' || micStatus === 'not_found' || micStatus === 'error') {
      return 'needs_attention';
    }
    if (micStatus === 'checking') {
      return 'checking';
    }
    return 'not_checked';
  };

  // Verification requirements for Continue button:
  // 1. System Compatibility passed
  // 2. Textbox Input Verification passed
  // 3. Microphone check passed OR explicitly selected text-only (skipped)
  // 4. Camera is optional
  const isSystemPassed = systemStatus === 'passed';
  const isInputPassed = inputStatus === 'passed';
  const isMicSatisfied = micStatus === 'passed' || micStatus === 'skipped';
  const canContinue = isSystemPassed && isInputPassed && isMicSatisfied;

  const handleContinue = () => {
    if (canContinue) {
      navigate('/audio-check', {
        state: {
          isTextOnly: micStatus === 'skipped',
          cameraEnabled: cameraStatus === 'passed',
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
          Pre-Assessment Setup
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Step 1 of 2: Pre-Flight Verification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Voice Assessment
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Before you begin, complete the following system checks.
            </p>
          </div>

          {/* Assessment Specifications Banner */}
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0">
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-blue-600">
                {ASSESSMENT_SUMMARY.totalQuestions}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Questions
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-slate-900">
                {ASSESSMENT_SUMMARY.totalSections}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Sections
              </span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="text-center px-2">
              <span className="block text-2xl font-black text-amber-600">
                {ASSESSMENT_SUMMARY.totalMinutes}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Minutes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Overview Component */}
      <SetupChecklist
        systemStatus={systemStatus}
        mediaStatus={getOverallMediaStatus()}
        inputStatus={inputStatus}
      />

      {/* Interactive Verification Cards */}
      <div className="space-y-6">
        {/* Check 1: System Compatibility */}
        <CompatibilityCheck
          currentStatus={systemStatus}
          onStatusChange={setSystemStatus}
        />

        {/* Check 2: Microphone & Webcam Permissions */}
        <MediaPermissionsCheck
          micStatus={micStatus}
          cameraStatus={cameraStatus}
          onMediaStateChange={handleMediaStateChange}
          onSkipMic={handleSkipMic}
          onSkipCamera={handleSkipCamera}
        />

        {/* Check 3: Textbox Input Verification */}
        <TextInputCheck
          currentStatus={inputStatus}
          onStatusChange={setInputStatus}
        />
      </div>

      {/* Bottom Action Footer with Continue Button */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {!canContinue ? (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Complete the three required checks above to unlock the Continue button.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                All verification criteria satisfied. You are ready to proceed.
                {micStatus === 'skipped' && ' (Proceeding in Text-Only Practice mode)'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
          >
            Cancel
          </Link>

          <button
            type="button"
            id="btn-continue-setup"
            onClick={handleContinue}
            disabled={!canContinue}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-md shadow-blue-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
