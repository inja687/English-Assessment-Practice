import React from 'react';
import { 
  Cpu, 
  Mic, 
  Keyboard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Circle
} from 'lucide-react';

/**
 * Status types: 'not_checked' | 'checking' | 'passed' | 'needs_attention'
 */
export default function SetupChecklist({ 
  systemStatus, 
  mediaStatus, 
  inputStatus 
}) {
  const items = [
    {
      id: 1,
      title: '1. System Compatibility',
      description: 'Browser API availability, Web Audio, and secure execution environment',
      status: systemStatus,
      icon: Cpu,
    },
    {
      id: 2,
      title: '2. Webcam & Audio Permissions',
      description: 'Microphone access for voice evaluation (Camera is optional)',
      status: mediaStatus,
      icon: Mic,
    },
    {
      id: 3,
      title: '3. Textbox Input Verification',
      description: 'Keyboard responsiveness and input validation check',
      status: inputStatus,
      icon: Keyboard,
    },
  ];

  const renderBadge = (status) => {
    switch (status) {
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passed</span>
          </span>
        );
      case 'checking':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>Checking...</span>
          </span>
        );
      case 'needs_attention':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Needs attention</span>
          </span>
        );
      case 'not_checked':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            <Circle className="w-3 h-3 text-slate-400" />
            <span>Not checked</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
        <span>Verification Checklist</span>
        <span className="text-xs font-normal text-slate-500">
          3 Items Required for Certification
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                item.status === 'passed' 
                  ? 'bg-emerald-50/30 border-emerald-200/80' 
                  : item.status === 'needs_attention'
                  ? 'bg-amber-50/30 border-amber-200/80'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  {renderBadge(item.status)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
