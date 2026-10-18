import React from 'react';
import { Sparkles, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { Habit, HabitCompletionMap, ThemeMode } from '../types';
import { HabitIcon } from './HabitIcon';
import { formatDateKey, getWeekDays, isHabitScheduledForDate, calculateStreaks } from '../utils/habitUtils';

interface ProgressScreenProps {
  habits: Habit[];
  completions: HabitCompletionMap;
  theme: ThemeMode;
  referenceDate?: Date;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  habits,
  completions,
  theme,
  referenceDate = new Date(),
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  const weekDays = getWeekDays(referenceDate);

  // Compute daily metrics for the 7-day bar chart
  let totalScheduledInWeek = 0;
  let totalCompletedInWeek = 0;

  const dayStats = weekDays.map((date) => {
    const dateKey = formatDateKey(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const isFuture = date > referenceDate;

    const scheduledToday = habits.filter((h) => isHabitScheduledForDate(h, date));
    const completedToday = scheduledToday.filter((h) => completions[h.id]?.[dateKey]);

    const scheduledCount = scheduledToday.length;
    const completedCount = completedToday.length;

    if (!isFuture) {
      totalScheduledInWeek += scheduledCount;
      totalCompletedInWeek += completedCount;
    }

    const pct = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;

    return {
      date,
      dateKey,
      dayName,
      isFuture,
      scheduledCount,
      completedCount,
      pct,
      // Text label as specified in PDF: e.g. "Mon: 3 of 4"
      textLabel: `${dayName}: ${completedCount} of ${scheduledCount}`,
    };
  });

  const weeklyPercentage =
    totalScheduledInWeek > 0
      ? Math.round((totalCompletedInWeek / totalScheduledInWeek) * 100)
      : 0;

  // Short encouraging message (e.g. "Best week yet.")
  let motivationalMessage = 'Best week yet.';
  if (weeklyPercentage === 100) {
    motivationalMessage = 'Flawless consistency!';
  } else if (weeklyPercentage >= 80) {
    motivationalMessage = 'Best week yet.';
  } else if (weeklyPercentage >= 60) {
    motivationalMessage = 'Solid momentum building!';
  } else {
    motivationalMessage = 'Every day is a fresh restart.';
  }

  // Week range label e.g. "Oct 12 – Oct 18, 2026"
  const startStr = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex flex-col min-h-full pb-24 select-none">
      {/* Top Header */}
      <header className="px-5 pt-4 pb-2">
        <p className={`text-xs uppercase tracking-widest font-bold ${
          isHighContrast ? 'text-yellow-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Weekly Overview
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
          Progress & Streaks
        </h1>
        <p className={`text-xs mt-1 font-medium ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          {startStr} – {endStr}
        </p>
      </header>

      <main className="px-5 py-4 space-y-6 flex-1 max-w-lg mx-auto w-full">
        {/* Weekly Completion Percentage & Motivational Message Card */}
        <div
          className={`p-5 rounded-2xl border ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900 shadow-sm'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs uppercase font-bold tracking-wider ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Weekly Completion
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className={`w-4 h-4 ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-emerald-400' : 'text-emerald-600'}`} aria-hidden="true" />
              <span className={`text-xs font-bold ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {motivationalMessage}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {weeklyPercentage}%
            </span>
            <span className={`text-sm font-medium ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              ({totalCompletedInWeek} of {totalScheduledInWeek} habits completed)
            </span>
          </div>

          <p className={`text-xs mt-3 italic ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
            "{motivationalMessage}"
          </p>
        </div>

        {/* Seven-Day Bar Chart with Text Label on Each Bar (Strictly Non-Visual Only!) */}
        <div
          className={`p-5 rounded-2xl border ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900 shadow-sm'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
              <span>7-Day Activity Chart</span>
            </h2>
            <span className={`text-xs font-semibold ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              With accessible text labels
            </span>
          </div>

          {/* Bar Chart Container */}
          <div 
            className="flex items-end justify-between gap-1.5 h-44 pt-4 pb-1 px-1"
            role="region"
            aria-label="Seven-day habit completion bar chart"
          >
            {dayStats.map((item) => {
              const heightPct = item.isFuture ? 8 : Math.max(item.pct, 12);
              return (
                <div
                  key={item.dateKey}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  {/* Percentage / Count pill above bar */}
                  <span
                    className={`text-[10px] font-bold mb-1 leading-none ${
                      isHighContrast
                        ? 'text-white'
                        : isDark
                        ? 'text-zinc-300'
                        : 'text-zinc-700'
                    }`}
                  >
                    {item.isFuture ? '—' : `${item.completedCount}/${item.scheduledCount}`}
                  </span>

                  {/* Accessible Vertical Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 relative border ${
                      item.isFuture
                        ? 'border-dashed border-zinc-600 opacity-25'
                        : isHighContrast
                        ? item.pct === 100
                          ? 'bg-white border-2 border-white'
                          : 'bg-zinc-800 border-2 border-white'
                        : item.pct === 100
                        ? 'bg-emerald-600 border border-emerald-700 shadow-sm'
                        : item.pct > 0
                        ? 'bg-emerald-400/80 border border-emerald-500'
                        : isDark
                        ? 'bg-zinc-800 border border-zinc-700'
                        : 'bg-zinc-200 border border-zinc-300'
                    }`}
                    style={{ height: `${heightPct}%` }}
                    role="graphics-symbol"
                    aria-label={item.textLabel}
                  />

                  {/* Day label */}
                  <span
                    className={`mt-2 text-xs font-bold uppercase ${
                      isHighContrast
                        ? 'text-white'
                        : isDark
                        ? 'text-zinc-400'
                        : 'text-zinc-600'
                    }`}
                  >
                    {item.dayName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Text labels list for full screen reader & non-visual clarity */}
          <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <p className={`text-xs font-bold uppercase mb-2 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Daily Check-in Summary:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs" role="list">
              {dayStats.map((item) => (
                <div
                  key={item.dateKey}
                  role="listitem"
                  className={`p-1.5 rounded-lg border font-mono flex items-center justify-between ${
                    isHighContrast
                      ? 'border-zinc-700 text-white'
                      : isDark
                      ? 'border-zinc-800 bg-zinc-950/40 text-zinc-300'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className="font-semibold">{item.dayName}</span>
                  <span className="font-bold">
                    {item.isFuture ? 'Upcoming' : `${item.completedCount} of ${item.scheduledCount} done`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Habit-by-Habit Streaks Breakdown */}
        <div
          className={`p-5 rounded-2xl border ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900 shadow-sm'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5" aria-hidden="true" />
            <h2 className="font-bold text-base">Individual Habit Streaks</h2>
          </div>

          <div className="space-y-2.5">
            {habits.map((h) => {
              const streaks = calculateStreaks(h, completions[h.id] || {}, referenceDate);
              return (
                <div
                  key={h.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isHighContrast
                      ? 'border-zinc-700 bg-black text-white'
                      : isDark
                      ? 'border-zinc-800 bg-zinc-950/40'
                      : 'border-zinc-100 bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg border border-current">
                      <HabitIcon name={h.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">{h.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className={`px-2 py-0.5 rounded ${
                      isHighContrast ? 'border border-white text-yellow-300' : isDark ? 'text-amber-400 bg-zinc-800' : 'text-amber-800 bg-amber-50'
                    }`}>
                      Current: {streaks.currentStreak}d
                    </span>
                    <span className={`px-2 py-0.5 rounded ${
                      isHighContrast ? 'border border-zinc-500 text-white' : isDark ? 'text-zinc-400 bg-zinc-800' : 'text-zinc-600 bg-zinc-200'
                    }`}>
                      Best: {streaks.bestStreak}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
