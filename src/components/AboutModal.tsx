import React from 'react';
import { X, CheckCircle, Shield, User, Smartphone, Layout, ArrowRight } from 'lucide-react';
import { ThemeMode } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div
        className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 ${
          isHighContrast
            ? 'border-4 border-white bg-black text-white'
            : isDark
            ? 'border-zinc-800 bg-zinc-900 text-white'
            : 'border-zinc-200 bg-white text-zinc-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
              Design Specification
            </span>
            <h2 id="about-dialog-title" className="text-2xl font-extrabold">
              StreakUp: Habit Tracker
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Oct 18, 2026 · @Malaficent design documentation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-full flex items-center justify-center cursor-pointer border ${
              isHighContrast
                ? 'border-2 border-white bg-white text-black'
                : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            aria-label="Close about dialog"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-6 text-sm">
          {/* Overview */}
          <section className="space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Layout className="w-4 h-4" />
              <span>Overview & Problem Statement</span>
            </h3>
            <p className="leading-relaxed">
              <strong>StreakUp</strong> is a mobile habit tracker that lets people check off a few daily habits in under 10 seconds and see their streaks grow.
            </p>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <strong>Problem:</strong> People who want to build routines give up because most habit apps are crowded with features, so a quick daily check-in feels like a chore.
            </p>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
              <strong>Design goals:</strong> Keep every daily action to one or two taps, show progress clearly without relying on color alone, and make the app usable with large text and a screen reader.
            </p>
          </section>

          {/* Target User Persona: Dilini */}
          <section className="space-y-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Target Persona: Dilini, 22</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <span className="font-bold block text-zinc-700 dark:text-zinc-300">Goal:</span>
                <span>Build 3 to 5 small daily habits (drink water, read 15 minutes, exercise, sleep by 11 pm) without spending time managing an app.</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <span className="font-bold block text-zinc-700 dark:text-zinc-300">Pain points:</span>
                <span>Apps with too many features; losing motivation after missing one day; forgetting to log habits until night.</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <span className="font-bold block text-zinc-700 dark:text-zinc-300">Context:</span>
                <span>Uses an Android phone, mostly one-handed, in short breaks between lectures, on the bus, and before bed.</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900">
                <span className="font-bold block text-zinc-700 dark:text-zinc-300">Accessibility:</span>
                <span>Mild red-green color blindness; status must never depend on color alone; prefers larger text in low light.</span>
              </div>
            </div>
          </section>

          {/* 6 Screens Architecture */}
          <section className="space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>6 Screen Architecture (Max 2 Taps)</span>
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li><strong>Welcome:</strong> App logo, tagline ("Small habits, every day"), 3 one-line benefits, Get Started, Skip link.</li>
              <li><strong>Today (Home):</strong> Date, progress line ("2 of 4 done"), habit cards with large checkboxes & streak counts, floating Add habit.</li>
              <li><strong>Add / Edit Habit:</strong> Name field, icon picker, frequency (daily or selected weekdays), reminder time, Save/Cancel, and Delete confirmation.</li>
              <li><strong>Habit Detail:</strong> Name, current streak and best streak, monthly calendar (✓ for done, — for missed), Edit button, back arrow.</li>
              <li><strong>Progress:</strong> Weekly completion percentage, 7-day bar chart with text label on each bar ("Mon: 3 of 4"), motivational message ("Best week yet.").</li>
              <li><strong>Settings:</strong> Daily reminder time, notifications switch, text size slider (16px+), light/dark/high-contrast themes, About info.</li>
            </ol>
          </section>

          {/* Accessibility Checklist */}
          <section className="space-y-2">
            <h3 className="font-bold text-base flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-4 h-4" />
              <span>Accessibility Compliance Matrix</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Color Contrast:</strong> Meets 4.5:1+ contrast against background verified with WebAIM standards.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Not Color Alone:</strong> Completed habits display a checkmark and the word "Done"; missed days show a dash ("—").</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Text Size:</strong> Starts at 16px and adjustable up to 22px via the Settings slider.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Touch Targets:</strong> Checkboxes and interactive elements are at least 44x44px.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Screen Reader:</strong> Every control has an explicit aria-label (e.g. "Drink water, not done, 5 day streak, double tap to mark done").</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Reachability:</strong> Main actions placed in lower half for one-handed thumb ergonomics.</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer ${
              isHighContrast
                ? 'bg-white text-black border-2 border-white'
                : 'bg-zinc-900 text-white dark:bg-emerald-500 dark:text-zinc-950'
            }`}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
