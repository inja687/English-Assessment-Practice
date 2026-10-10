import React, { useState } from 'react';
import { 
  Keyboard, 
  CheckCircle2, 
  XCircle, 
  ArrowRight
} from 'lucide-react';

export default function TextInputCheck({ onStatusChange }) {
  const [inputText, setInputText] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleVerify = (e) => {
    if (e) e.preventDefault();

    const trimmed = inputText.trim();

    if (!trimmed) {
      setFeedback({
        type: 'error',
        message: 'Input cannot be empty. Please type “Hello World” in the box below.',
      });
      onStatusChange('needs_attention');
      return;
    }

    if (trimmed === 'Hello World') {
      setFeedback({
        type: 'success',
        message: 'Input verified successfully! Keyboard response and text rendering are operational.',
      });
      onStatusChange('passed');
    } else {
      setFeedback({
        type: 'error',
        message: `Input does not match “Hello World”. Please verify exact spelling and capitalization (Expected: “Hello World”, Received: “${trimmed}”).`,
      });
      onStatusChange('needs_attention');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerify(e);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-5">
        <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
          <Keyboard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            3. Textbox Input Verification
          </h3>
          <p className="text-xs text-slate-500">
            Validates keyboard latency and browser text field event processing.
          </p>
        </div>
      </div>

      <div className="space-y-4 max-w-2xl">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-0.5">Instruction:</span>
          <span>Please type <code className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono font-bold text-blue-700">Hello World</code> in the textbox below.</span>
        </div>

        <form onSubmit={handleVerify} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              id="input-hello-world"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                // Reset feedback on typing so user can correct
                if (feedback?.type === 'error') {
                  setFeedback(null);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type “Hello World” here..."
              className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 transition ${
                feedback?.type === 'success'
                  ? 'border-emerald-400 bg-emerald-50/20 focus:ring-emerald-500 text-emerald-900'
                  : feedback?.type === 'error'
                  ? 'border-rose-300 bg-rose-50/20 focus:ring-rose-500 text-rose-900'
                  : 'border-slate-300 bg-white focus:border-blue-500 focus:ring-blue-500 text-slate-800'
              }`}
            />

            <button
              type="submit"
              id="btn-verify-input"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition shrink-0"
            >
              <span>Verify</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback status message */}
          {feedback && (
            <div
              className={`p-3.5 rounded-lg text-xs font-medium flex items-start gap-2.5 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{feedback.message}</span>
            </div>
          )}

          {!feedback && (
            <p className="text-[11px] text-slate-400">
              *Press Enter or click "Verify" after typing. The check will pass only after exact text confirmation.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
