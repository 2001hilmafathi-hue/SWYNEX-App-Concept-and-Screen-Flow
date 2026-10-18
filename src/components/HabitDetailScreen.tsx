import React, { useState } from 'react';
import { ArrowLeft, Edit3, Flame, Trophy, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Habit, HabitCompletionMap, ThemeMode } from '../types';
import { HabitIcon } from './HabitIcon';
import { calculateStreaks, formatDateKey, isHabitScheduledForDate } from '../utils/habitUtils';

interface HabitDetailScreenProps {
  habit: Habit;
  completions: HabitCompletionMap;
  onBack: () => void;
  onEdit: (habit: Habit) => void;
  onToggleDateCompletion: (habitId: string, dateKey: string) => void;
  theme: ThemeMode;
  referenceDate?: Date;
}

export const HabitDetailScreen: React.FC<HabitDetailScreenProps> = ({
  habit,
  completions,
  onBack,
  onEdit,
  onToggleDateCompletion,
  theme,
  referenceDate = new Date(),
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  // Streak numbers
  const streaks = calculateStreaks(habit, completions[habit.id] || {}, referenceDate);

  // Month navigation state
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  );

  const prevMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  // Build calendar matrix for currentMonthDate
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of day items
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ type: 'empty', key: `empty-${i}` });
  }

  const todayKey = formatDateKey(referenceDate);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = formatDateKey(dateObj);
    const isScheduled = isHabitScheduledForDate(habit, dateObj);
    const isCompleted = !!completions[habit.id]?.[key];
    const isFuture = dateObj > referenceDate;
    const isToday = key === todayKey;

    calendarDays.push({
      type: 'day',
      dayNumber: d,
      key,
      dateObj,
      isScheduled,
      isCompleted,
      isFuture,
      isToday,
    });
  }

  return (
    <div className="flex flex-col min-h-full pb-20 select-none">
      {/* Top Header Bar */}
      <header className="px-5 py-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-inherit">
        <button
          type="button"
          onClick={onBack}
          className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition ${
            isHighContrast
              ? 'border-2 border-white hover:bg-zinc-800 text-white'
              : isDark
              ? 'hover:bg-zinc-800 text-zinc-300'
              : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          aria-label="Back to Today"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <h1 className="text-lg font-bold truncate max-w-[200px]">
          {habit.name}
        </h1>

        <button
          type="button"
          onClick={() => onEdit(habit)}
          className={`min-h-[44px] px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-semibold text-sm cursor-pointer transition border ${
            isHighContrast
              ? 'border-2 border-white bg-white text-black hover:bg-zinc-200'
              : isDark
              ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
              : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
          }`}
          aria-label={`Edit ${habit.name}`}
        >
          <Edit3 className="w-4 h-4" aria-hidden="true" />
          <span>Edit</span>
        </button>
      </header>

      <div className="px-5 py-5 space-y-6 flex-1 max-w-lg mx-auto w-full">
        {/* Habit Summary Hero Card */}
        <div
          className={`p-5 rounded-2xl border flex items-center gap-4 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              isHighContrast
                ? 'border-2 border-white bg-black text-white'
                : isDark
                ? 'bg-zinc-800 border-zinc-700 text-emerald-400'
                : 'bg-emerald-100 border-emerald-200 text-emerald-800'
            }`}
            aria-hidden="true"
          >
            <HabitIcon name={habit.icon} className="w-7 h-7" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{habit.name}</h2>
            <p className={`text-xs mt-1 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {habit.frequencyType === 'daily'
                ? 'Scheduled every day'
                : 'Scheduled on selected weekdays'}
              {habit.reminderTime ? ` • Reminder at ${habit.reminderTime}` : ''}
            </p>
          </div>
        </div>

        {/* Streaks Stats Cards: Current Streak & Best Streak */}
        <div className="grid grid-cols-2 gap-3.5">
          <div
            className={`p-4 rounded-2xl border ${
              isHighContrast
                ? 'border-2 border-white bg-black'
                : isDark
                ? 'border-zinc-800 bg-zinc-900'
                : 'border-zinc-200 bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Flame
                className={`w-5 h-5 ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-amber-400' : 'text-amber-600'}`}
                aria-hidden="true"
              />
              <span className={`text-xs uppercase font-bold tracking-wider ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Current Streak
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {streaks.currentStreak} {streaks.currentStreak === 1 ? 'day' : 'days'}
            </div>
            <p className={`text-xs mt-1 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Keep it going!
            </p>
          </div>

          <div
            className={`p-4 rounded-2xl border ${
              isHighContrast
                ? 'border-2 border-white bg-black'
                : isDark
                ? 'border-zinc-800 bg-zinc-900'
                : 'border-zinc-200 bg-white shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Trophy
                className={`w-5 h-5 ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-amber-400' : 'text-amber-600'}`}
                aria-hidden="true"
              />
              <span className={`text-xs uppercase font-bold tracking-wider ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Best Streak
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {streaks.bestStreak} {streaks.bestStreak === 1 ? 'day' : 'days'}
            </div>
            <p className={`text-xs mt-1 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Personal record
            </p>
          </div>
        </div>

        {/* Monthly Calendar Section */}
        <div
          className={`p-5 rounded-2xl border ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <h3 className="font-bold text-base sm:text-lg">{monthName}</h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className={`min-h-[44px] min-w-[44px] p-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
                  isHighContrast
                    ? 'border border-white hover:bg-zinc-800'
                    : isDark
                    ? 'hover:bg-zinc-800 text-zinc-300'
                    : 'hover:bg-zinc-100 text-zinc-700'
                }`}
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className={`min-h-[44px] min-w-[44px] p-2 rounded-lg flex items-center justify-center cursor-pointer transition ${
                  isHighContrast
                    ? 'border border-white hover:bg-zinc-800'
                    : isDark
                    ? 'hover:bg-zinc-800 text-zinc-300'
                    : 'hover:bg-zinc-100 text-zinc-700'
                }`}
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Accessibility Guide Note as specified in PDF:
              "completed days show a checkmark and missed days show a dash, not just a red or gray fill" */}
          <div className={`flex items-center justify-between text-xs font-semibold pb-3 mb-3 border-b ${
            isHighContrast ? 'border-zinc-700 text-zinc-200' : isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-100 text-zinc-500'
          }`}>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-sm">✓</span> Completed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-sm">—</span> Missed
            </span>
            <span className="flex items-center gap-1.5 opacity-60">
              <span>○</span> Future / Off
            </span>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <div key={idx} className={`py-1 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 gap-1.5" role="grid" aria-label={`Habit status calendar for ${monthName}`}>
            {calendarDays.map((item) => {
              if (item.type === 'empty') {
                return <div key={item.key} className="h-10 sm:h-12" aria-hidden="true" />;
              }

              const { dayNumber, key, isScheduled, isCompleted, isFuture, isToday } = item;

              // Accessible description
              let statusLabel = 'Not scheduled';
              if (isFuture) {
                statusLabel = 'Upcoming';
              } else if (isScheduled) {
                statusLabel = isCompleted ? 'Completed' : 'Missed';
              }

              return (
                <button
                  type="button"
                  key={key}
                  disabled={isFuture}
                  onClick={() => {
                    if (!isFuture && key) {
                      onToggleDateCompletion(habit.id, key);
                    }
                  }}
                  aria-label={`${monthName} ${dayNumber}: ${statusLabel}. Click to toggle.`}
                  className={`h-11 sm:h-12 rounded-xl flex flex-col items-center justify-center p-1 relative transition touch-manipulation cursor-pointer ${
                    isFuture
                      ? 'opacity-30 cursor-not-allowed border border-transparent'
                      : isHighContrast
                      ? isCompleted
                        ? 'border-2 border-white bg-white text-black font-extrabold'
                        : isScheduled
                        ? 'border-2 border-white bg-black text-white hover:bg-zinc-900'
                        : 'border border-zinc-700 bg-black text-zinc-500'
                      : isCompleted
                      ? 'bg-emerald-600 text-white font-bold shadow-sm hover:bg-emerald-700'
                      : isScheduled
                      ? isDark
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-750 border border-zinc-700'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                      : isDark
                      ? 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                      : 'bg-zinc-50 text-zinc-400 border border-zinc-100'
                  } ${isToday ? (isHighContrast ? 'ring-2 ring-yellow-300' : 'ring-2 ring-offset-1 ring-emerald-500') : ''}`}
                >
                  <span className="text-[11px] font-bold leading-none">{dayNumber}</span>
                  <div className="mt-0.5 text-xs font-bold leading-none">
                    {isFuture ? (
                      <span className="opacity-40 text-[9px]">•</span>
                    ) : isCompleted ? (
                      <span aria-hidden="true">✓</span>
                    ) : isScheduled ? (
                      <span aria-hidden="true">—</span>
                    ) : (
                      <span className="text-[10px] opacity-40">·</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
