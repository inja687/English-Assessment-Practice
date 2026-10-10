import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Lock, 
  Volume2, 
  Mic, 
  FileText, 
  Headphones, 
  CheckCircle2
} from 'lucide-react';
import { isSectionUnlocked, getPrecedingSection } from '../utils/storage';

export default function SectionCard({ section, showSkills = true }) {
  const { id, code, name, title, questionCount, durationMinutes, description, skills } = section;

  const unlocked = isSectionUnlocked(id);
  const preceding = getPrecedingSection(id);

  // Distinctive aesthetic styling per section
  const sectionThemes = {
    A: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      accent: 'border-l-blue-600',
      iconBg: 'bg-blue-500/10 text-blue-600 border-blue-200',
      icon: FileText,
      gradient: 'from-blue-600 to-sky-600',
      btnBg: 'bg-blue-600 hover:bg-blue-700',
    },
    B: {
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accent: 'border-l-indigo-600',
      iconBg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
      icon: Volume2,
      gradient: 'from-indigo-600 to-violet-600',
      btnBg: 'bg-indigo-600 hover:bg-indigo-700',
    },
    C: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accent: 'border-l-emerald-600',
      iconBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
      icon: Mic,
      gradient: 'from-emerald-600 to-teal-600',
      btnBg: 'bg-emerald-600 hover:bg-emerald-700',
    },
    D: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      accent: 'border-l-amber-600',
      iconBg: 'bg-amber-500/10 text-amber-600 border-amber-200',
      icon: HelpCircle,
      gradient: 'from-amber-600 to-orange-600',
      btnBg: 'bg-amber-600 hover:bg-amber-700',
    },
    E: {
      badge: 'bg-purple-50 text-purple-700 border-purple-200',
      accent: 'border-l-purple-600',
      iconBg: 'bg-purple-500/10 text-purple-600 border-purple-200',
      icon: Headphones,
      gradient: 'from-purple-600 to-fuchsia-600',
      btnBg: 'bg-purple-600 hover:bg-purple-700',
    },
  };

  const theme = sectionThemes[code] || sectionThemes.A;
  const SectionIcon = theme.icon;

  const targetUrl = 
    id === 'section-a' ? '/section-a/intro' : 
    id === 'section-b' ? '/section-b/intro' : 
    id === 'section-c' ? '/section-c/intro' : 
    id === 'section-d' ? '/section-d/intro' : 
    id === 'section-e' ? '/section-e/intro' : 
    `/practice/${id}`;

  return (
    <div 
      className={`group relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 ${
        unlocked 
          ? `border-slate-200/90 border-l-4 ${theme.accent}` 
          : 'border-slate-200/80 border-l-4 border-l-slate-300 opacity-90'
      }`}
    >
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${unlocked ? theme.iconBg : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <SectionIcon className="w-4 h-4" />
            </div>

            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border tracking-wide uppercase ${unlocked ? theme.badge : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {name}
              </span>
              {!unlocked && (
                <span className="inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span>Locked</span>
                </span>
              )}
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-slate-600 shrink-0">
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg shadow-2xs">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{questionCount} Qs</span>
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{durationMinutes}m</span>
            </span>
          </div>
        </div>

        {/* Section Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 flex-1">
          {description}
        </p>

        {/* Assessed Skills Pills */}
        {showSkills && skills && (
          <div className="pt-2 border-t border-slate-100 mt-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Assessed Competencies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-200/90 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 hidden sm:block truncate pr-2">
          {unlocked ? (
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Module Unlocked</span>
            </span>
          ) : (
            <span className="text-amber-700 font-medium flex items-center gap-1">
              <Lock className="w-3 h-3 inline shrink-0" />
              <span className="truncate">Requires {preceding?.name || 'previous section'}</span>
            </span>
          )}
        </div>
        
        {unlocked ? (
          <Link
            to={targetUrl}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xs hover:shadow-md transition-all group ${theme.btnBg}`}
            id={`btn-practice-${id}`}
          >
            <span>Launch Module</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            id={`btn-locked-${id}`}
            title={`Complete ${preceding?.name || 'previous section'} to unlock`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Locked</span>
          </button>
        )}
      </div>
    </div>
  );
}
