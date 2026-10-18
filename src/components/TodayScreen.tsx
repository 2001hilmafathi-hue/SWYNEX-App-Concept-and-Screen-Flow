import React from 'react';
import { Plus, Flame, Check, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Habit, HabitCompletionMap, ThemeMode } from '../types';
import { HabitIcon } from './HabitIcon';
import { formatDateKey, calculateStreaks, isHabitScheduledForDate } from '../utils/habitUtils';
import confetti from 'canvas-confetti';

interface TodayScreenProps {
  habits: Habit[];
  completions: HabitCompletionMap;
  theme: ThemeMode;
  onToggleHabit: (habitId: string) => void;
  onSelectHabit: (habitId: string) => void;
  onAddHabit: () => void;
  referenceDate?: Date;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({
  habits,
  completions,
  theme,
  onToggleHabit,
  onSelectHabit,
  onAddHabit,
  referenceDate = new Date(),
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  const todayKey = formatDateKey(referenceDate);

  // Filter habits scheduled for today
  const scheduledHabits = habits.filter((h) => isHabitScheduledForDate(h, referenceDate));
  const doneHabits = scheduledHabits.filter((h) => completions[h.id]?.[todayKey]);
  const doneCount = doneHabits.length;
  const totalCount = scheduledHabits.length;
  const isAllDone = totalCount > 0 && doneCount === totalCount;

  // Format today's date cleanly e.g. "Sunday, October 18, 2026"
  const formattedDate = referenceDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCheckboxClick = (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    const willBeDone = !completions[habitId]?.[todayKey];
    onToggleHabit(habitId);

    // If this completes the last habit, trigger confetti celebration
    if (willBeDone && doneCount + 1 === totalCount) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-24 relative select-none">
      {/* Top Header Section */}
      <header className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-xs uppercase tracking-widest font-bold ${
              isHighContrast ? 'text-yellow-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              Today
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
              {formattedDate}
            </h1>
          </div>
          {isAllDone && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                isHighContrast
                  ? 'border-2 border-white bg-black text-white'
                  : isDark
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
              role="status"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>All Done!</span>
            </span>
          )}
        </div>

        {/* Progress Line: ("2 of 4 done") */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className={`font-semibold ${isHighContrast ? 'text-white' : isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>
              Daily Progress
            </span>
            <span 
              className={`font-bold ${isHighContrast ? 'text-yellow-300' : isDark ? 'text-emerald-400' : 'text-emerald-700'}`}
              aria-live="polite"
            >
              {totalCount === 0 ? '0 of 0 done' : `${doneCount} of ${totalCount} done`}
            </span>
          </div>

          {/* Accessible visual bar with high contrast border */}
          <div 
            className={`w-full h-3 rounded-full overflow-hidden ${
              isHighContrast ? 'bg-zinc-900 border-2 border-white' : isDark ? 'bg-zinc-800' : 'bg-zinc-200'
            }`}
            role="progressbar"
            aria-valuenow={totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${doneCount} of ${totalCount} habits done`}
          >
            <div
              className={`h-full transition-all duration-300 ease-out ${
                isHighContrast
                  ? 'bg-white'
                  : isDark
                  ? 'bg-emerald-500'
                  : 'bg-emerald-600'
              }`}
              style={{
                width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Habit List */}
      <main className="px-5 mt-2 space-y-3" role="list" aria-label="Today's habits">
        {scheduledHabits.length === 0 ? (
          <div className={`p-8 text-center rounded-2xl border ${
            isHighContrast ? 'border-2 border-white bg-black' : isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-zinc-50'
          }`}>
            <p className="font-semibold text-lg">No habits scheduled for today</p>
            <p className={`text-sm mt-1 mb-4 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Add a new daily habit to get started!
            </p>
            <button
              onClick={onAddHabit}
              className={`min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer ${
                isHighContrast
                  ? 'bg-white text-black border-2 border-white'
                  : isDark
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-900 text-white'
              }`}
            >
              Add First Habit
            </button>
          </div>
        ) : (
          scheduledHabits.map((habit) => {
            const isDone = !!completions[habit.id]?.[todayKey];
            const streaks = calculateStreaks(habit, completions[habit.id] || {}, referenceDate);

            // Screen reader accessible label as required by design doc:
            // "Drink water, not done, 5 day streak, double tap to mark done"
            const srStatus = isDone ? 'Done' : 'Not done';
            const actionText = isDone ? 'double tap to mark not done' : 'double tap to mark done';
            const screenReaderLabel = `${habit.name}, ${srStatus}, ${streaks.currentStreak} day streak, ${actionText}`;

            return (
              <div
                key={habit.id}
                role="listitem"
                onClick={() => onSelectHabit(habit.id)}
                className={`group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition border ${
                  isHighContrast
                    ? isDone
                      ? 'border-4 border-white bg-black text-white'
                      : 'border-2 border-white bg-black text-white hover:bg-zinc-900'
                    : isDark
                    ? isDone
                      ? 'bg-zinc-900 border-zinc-700/80 shadow-sm'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-sm'
                    : isDone
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-sm'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                }`}
              >
                {/* Left side: Icon, Name, and Streak */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                      isHighContrast
                        ? 'border-2 border-white bg-black text-white'
                        : isDark
                        ? isDone
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-400'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                        : isDone
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                    }`}
                    aria-hidden="true"
                  >
                    <HabitIcon name={habit.icon} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-base sm:text-lg truncate ${
                        isDone && !isHighContrast ? 'line-through text-zinc-500' : ''
                      }`}>
                        {habit.name}
                      </span>
                    </div>

                    {/* Streak Count & Text Status Badge (Ensures NOT color alone!) */}
                    <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                      {/* Streak badge */}
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isHighContrast
                            ? 'border border-white text-white'
                            : isDark
                            ? 'bg-zinc-800 text-amber-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                        title={`${streaks.currentStreak} days streak`}
                      >
                        <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{streaks.currentStreak} {streaks.currentStreak === 1 ? 'day' : 'days'}</span>
                      </span>

                      {/* Explicit Text Status Badge: 'Done' or 'Not done' */}
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          isDone
                            ? isHighContrast
                              ? 'bg-white text-black font-extrabold'
                              : isDark
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                              : 'bg-emerald-100 text-emerald-900 font-bold'
                            : isHighContrast
                            ? 'border border-zinc-500 text-zinc-300'
                            : isDark
                            ? 'text-zinc-400 bg-zinc-800/80'
                            : 'text-zinc-600 bg-zinc-100'
                        }`}
                      >
                        {isDone ? '✓ Done' : '— Not done'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: Large 44x44px accessible Checkbox */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleCheckboxClick(e, habit.id)}
                    aria-label={screenReaderLabel}
                    aria-checked={isDone}
                    role="checkbox"
                    className={`w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer transition active:scale-90 touch-manipulation focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isHighContrast
                        ? isDone
                          ? 'bg-white text-black border-4 border-white'
                          : 'bg-black text-transparent border-4 border-white hover:bg-zinc-800'
                        : isDark
                        ? isDone
                          ? 'bg-emerald-500 text-zinc-950 border-2 border-emerald-400 shadow'
                          : 'bg-zinc-800 text-transparent border-2 border-zinc-600 hover:border-zinc-400'
                        : isDone
                        ? 'bg-emerald-600 text-white border-2 border-emerald-700 shadow-sm'
                        : 'bg-zinc-100 text-transparent border-2 border-zinc-300 hover:border-zinc-400'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-7 h-7 stroke-[3.5]" aria-hidden="true" />
                    ) : (
                      <span className="sr-only">Not completed</span>
                    )}
                  </button>

                  <ChevronRight
                    className={`w-5 h-5 opacity-40 group-hover:opacity-100 transition ${
                      isHighContrast ? 'text-white' : isDark ? 'text-zinc-400' : 'text-zinc-400'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Floating "Add Habit" Button positioned in thumb reach zone */}
      <div className="fixed sm:absolute bottom-20 right-5 z-20">
        <button
          onClick={onAddHabit}
          className={`min-w-[56px] min-h-[56px] p-4 rounded-full flex items-center justify-center shadow-xl cursor-pointer transition active:scale-95 touch-manipulation focus:outline-none focus:ring-4 ${
            isHighContrast
              ? 'bg-white text-black border-4 border-white hover:bg-zinc-200'
              : isDark
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-emerald-950/50'
              : 'bg-zinc-900 hover:bg-black text-white shadow-zinc-400'
          }`}
          aria-label="Add new habit"
          title="Add habit"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
