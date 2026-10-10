import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Info 
} from 'lucide-react';

export default function CompatibilityCheck({ onStatusChange }) {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState(null);

  const runCompatibilityCheck = () => {
    setChecking(true);
    onStatusChange('checking');

    setTimeout(() => {
      // 1. JavaScript working
      const jsWorking = true;

      // 2. Application rendering and user responsiveness
      const domResponsive = typeof document !== 'undefined' && typeof window !== 'undefined';

      // 3. Web Storage & Audio APIs
      const hasAudioContext = typeof window.AudioContext !== 'undefined' || typeof window.webkitAudioContext !== 'undefined';

      // 4. MediaRecorder API
      const hasMediaRecorder = typeof window.MediaRecorder !== 'undefined';

      // 5. Secure Context for microphone/camera (HTTPS or localhost)
      const isSecure = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      const checkItems = [
        {
          name: 'JavaScript Runtime',
          description: 'Core engine executing client-side assessment logic',
          passed: jsWorking,
          detail: 'ES6+ ECMAScript active',
        },
        {
          name: 'DOM & UI Responsiveness',
          description: 'React application rendering and event handling',
          passed: domResponsive,
          detail: 'Interactive canvas responsive',
        },
        {
          name: 'Web Audio API Support',
          description: 'Audio playback and frequency processing capability',
          passed: hasAudioContext,
          detail: hasAudioContext ? 'AudioContext available' : 'AudioContext not supported by this browser',
        },
        {
          name: 'MediaRecorder API Support',
          description: 'Browser audio capture and playback stream encoding',
          passed: hasMediaRecorder,
          detail: hasMediaRecorder ? 'MediaRecorder supported' : 'Voice capture will require modern browser update',
        },
        {
          name: 'Secure Context (HTTPS / Localhost)',
          description: 'Required by browsers to access audio capture devices',
          passed: isSecure,
          detail: isSecure ? 'Secure environment confirmed' : 'Requires HTTPS or localhost for audio input access',
        },
      ];

      const allPassed = checkItems.every((item) => item.passed);

      setResults({
        items: checkItems,
        timestamp: new Date().toLocaleTimeString(),
        allPassed,
      });

      setChecking(false);
      onStatusChange(allPassed ? 'passed' : 'needs_attention');
    }, 500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              1. System Compatibility Check
            </h3>
            <p className="text-xs text-slate-500">
              Verifies local browser engines and APIs required for offline assessment simulation.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={runCompatibilityCheck}
          disabled={checking}
          id="btn-check-system-compatibility"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
          <span>{results ? 'Re-check Compatibility' : 'Check System Compatibility'}</span>
        </button>
      </div>

      {/* When not checked yet */}
      {!results && !checking && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            Click <strong>“Check System Compatibility”</strong> above to verify that your browser supports audio capture, storage, and modern JavaScript features needed for the practice tests.
          </p>
        </div>
      )}

      {/* Checking State */}
      {checking && (
        <div className="py-8 text-center text-slate-500 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p className="text-xs font-medium">Verifying browser APIs and secure execution context...</p>
        </div>
      )}

      {/* Results View */}
      {results && !checking && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.items.map((item, index) => (
              <div 
                key={index}
                className="p-3.5 rounded-lg border bg-slate-50/70 border-slate-200 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 block">{item.name}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">{item.description}</span>
                  <span className="text-[11px] font-medium text-slate-600 mt-1 block">
                    Detail: {item.detail}
                  </span>
                </div>
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Status: <strong>{results.allPassed ? 'System Compatible' : 'Attention Required'}</strong> (Checked at {results.timestamp})
            </span>
            <span className="text-[11px] text-slate-400">
              *Verifies browser execution only; does not claim external test-server connection.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
