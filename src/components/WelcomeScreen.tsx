import React from 'react';
import { Flame, CheckCircle, Zap, Eye, ArrowRight } from 'lucide-react';
import { ThemeMode } from '../types';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
  theme: ThemeMode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onSkip,
  theme,
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  return (
    <div className="flex flex-col justify-between min-h-full px-6 py-8 select-none" role="region" aria-label="Welcome to StreakUp">
      {/* Top Header / Branding */}
      <div className="flex flex-col items-center text-center mt-6">
        <div 
          className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-md ${
            isHighContrast
              ? 'bg-black border-4 border-white text-yellow-300'
              : isDark
              ? 'bg-zinc-800 border border-zinc-700 text-amber-400'
              : 'bg-emerald-600 text-white shadow-emerald-200'
          }`}
          aria-hidden="true"
        >
          <Flame className="w-12 h-12" strokeWidth={2.5} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          StreakUp
        </h1>
        
        <p className={`mt-2 text-lg sm:text-xl font-medium ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
          Small habits, every day
        </p>

        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isHighContrast
            ? 'border-2 border-white text-white'
            : isDark
            ? 'bg-zinc-800 text-zinc-300'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <span>Built for Dilini & busy routines</span>
        </div>
      </div>

      {/* 3 One-line Benefits */}
      <div className="my-8 space-y-4 max-w-sm mx-auto w-full">
        <div className={`flex items-start gap-3.5 p-3.5 rounded-xl border ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : isDark
            ? 'border-zinc-800 bg-zinc-900/80'
            : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            isHighContrast ? 'text-white' : isDark ? 'text-amber-400' : 'text-emerald-700'
          }`}>
            <Zap className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-base">Check off in under 10 seconds</h2>
            <p className={`text-sm mt-0.5 ${isHighContrast ? 'text-zinc-200' : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              One tap daily logging with zero bloat or cluttered chores.
            </p>
          </div>
        </div>

        <div className={`flex items-start gap-3.5 p-3.5 rounded-xl border ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : isDark
            ? 'border-zinc-800 bg-zinc-900/80'
            : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            isHighContrast ? 'text-white' : isDark ? 'text-amber-400' : 'text-emerald-700'
          }`}>
            <CheckCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-base">Clear streaks & progress</h2>
            <p className={`text-sm mt-0.5 ${isHighContrast ? 'text-zinc-200' : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              See your momentum grow without feeling down after a miss.
            </p>
          </div>
        </div>

        <div className={`flex items-start gap-3.5 p-3.5 rounded-xl border ${
          isHighContrast
            ? 'border-2 border-white bg-black'
            : isDark
            ? 'border-zinc-800 bg-zinc-900/80'
            : 'border-zinc-200 bg-zinc-50'
        }`}>
          <div className={`p-2 rounded-lg shrink-0 ${
            isHighContrast ? 'text-white' : isDark ? 'text-amber-400' : 'text-emerald-700'
          }`}>
            <Eye className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-bold text-base">Accessible & one-handed reach</h2>
            <p className={`text-sm mt-0.5 ${isHighContrast ? 'text-zinc-200' : isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Never relies on color alone; works comfortably with large text.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions - Ergonomically in bottom half */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto mb-2">
        <button
          onClick={onGetStarted}
          className={`w-full min-h-[48px] py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 cursor-pointer transition active:scale-[0.98] ${
            isHighContrast
              ? 'bg-white text-black border-2 border-white hover:bg-zinc-200'
              : isDark
              ? 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-lg'
              : 'bg-zinc-900 hover:bg-black text-white shadow-md'
          }`}
          aria-label="Get Started with StreakUp"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>

        <button
          onClick={onSkip}
          className={`py-2.5 px-4 text-sm font-semibold rounded-lg cursor-pointer transition hover:underline ${
            isHighContrast
              ? 'text-yellow-300 underline'
              : isDark
              ? 'text-zinc-400 hover:text-zinc-200'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
          aria-label="Skip onboarding and go directly to Today"
        >
          Skip to Habits
        </button>
      </div>
    </div>
  );
};
