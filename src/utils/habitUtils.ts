import { Habit, HabitCompletionMap } from '../types';

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isHabitScheduledForDate(habit: Habit, date: Date): boolean {
  if (habit.frequencyType === 'daily') return true;
  const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ...
  return habit.selectedDays.includes(dayOfWeek);
}

/**
 * Calculates current streak and best streak.
 * For daily habits:
 * - If today is completed, streak includes today and counts backward.
 * - If today is not completed yet, streak starts from yesterday (if completed) and counts backward.
 * - If yesterday was also missed, streak is 0.
 * For scheduled weekday habits:
 * - Only counts scheduled days in the streak chain.
 */
export function calculateStreaks(habit: Habit, completions: Record<string, boolean> = {}, referenceDate: Date = new Date()): { currentStreak: number; bestStreak: number } {
  const todayKey = formatDateKey(referenceDate);
  const isTodayScheduled = isHabitScheduledForDate(habit, referenceDate);
  const isTodayDone = !!completions[todayKey];

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(referenceDate);

  if (isTodayScheduled && isTodayDone) {
    currentStreak++;
    // Move to previous day
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (!isTodayScheduled) {
    // If today is not scheduled, start looking backwards from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Today was scheduled but not yet marked done:
    // If user hasn't checked off today yet, their streak from yesterday is still alive!
    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Count backwards continuously
  let maxLookback = 365;
  while (maxLookback > 0) {
    if (isHabitScheduledForDate(habit, checkDate)) {
      const key = formatDateKey(checkDate);
      if (completions[key]) {
        currentStreak++;
      } else {
        break; // Streak broken
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);
    maxLookback--;
  }

  // Calculate best streak across all recorded completions (within 365 days window)
  let bestStreak = currentStreak;
  let runningStreak = 0;
  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - 180); // past 6 months

  const endDate = new Date(referenceDate);
  let iterDate = new Date(startDate);

  while (iterDate <= endDate) {
    if (isHabitScheduledForDate(habit, iterDate)) {
      const key = formatDateKey(iterDate);
      if (completions[key]) {
        runningStreak++;
        if (runningStreak > bestStreak) {
          bestStreak = runningStreak;
        }
      } else {
        runningStreak = 0;
      }
    }
    iterDate.setDate(iterDate.getDate() + 1);
  }

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
  };
}

/**
 * Generates initial seed data for Dilini (Persona in PDF):
 * 1. Drink water (daily, 5 day streak)
 * 2. Read 15 minutes (daily, 4 day streak)
 * 3. Exercise (weekdays, 3 day streak)
 * 4. Sleep by 11 pm (daily, 6 day streak)
 */
export function getInitialHabits(): Habit[] {
  return [
    {
      id: 'habit-1',
      name: 'Drink water',
      icon: 'Droplet',
      frequencyType: 'daily',
      selectedDays: [0, 1, 2, 3, 4, 5, 6],
      reminderTime: '09:00',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'habit-2',
      name: 'Read 15 minutes',
      icon: 'BookOpen',
      frequencyType: 'daily',
      selectedDays: [0, 1, 2, 3, 4, 5, 6],
      reminderTime: '21:30',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'habit-3',
      name: 'Exercise',
      icon: 'Dumbbell',
      frequencyType: 'weekdays',
      selectedDays: [1, 2, 3, 4, 5], // Mon - Fri
      reminderTime: '07:30',
      createdAt: '2026-09-01T08:00:00Z',
    },
    {
      id: 'habit-4',
      name: 'Sleep by 11 pm',
      icon: 'Moon',
      frequencyType: 'daily',
      selectedDays: [0, 1, 2, 3, 4, 5, 6],
      reminderTime: '22:45',
      createdAt: '2026-09-01T08:00:00Z',
    },
  ];
}

export function getInitialCompletions(referenceDate: Date = new Date()): HabitCompletionMap {
  const result: HabitCompletionMap = {
    'habit-1': {},
    'habit-2': {},
    'habit-3': {},
    'habit-4': {},
  };

  // Seed completions for the past 30 days to reflect Dilini's streaks & realistic progress
  // Today:
  const todayKey = formatDateKey(referenceDate);
  // Habit 1 (Drink water) done today (starts today's 2 of 4 done example!)
  result['habit-1'][todayKey] = true;
  // Habit 2 (Read 15 min) done today
  result['habit-2'][todayKey] = true;
  // Habit 3 (Exercise) not done yet today
  // Habit 4 (Sleep by 11pm) not done yet today (happens at night)

  // Seed history for past 28 days
  for (let i = 1; i <= 35; i++) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    const key = formatDateKey(d);
    const dayOfWeek = d.getDay();

    // Habit 1: Drink water (has 5-day current streak, with some days in past)
    if (i <= 4) {
      result['habit-1'][key] = true;
    } else if (i !== 5 && i !== 12 && i !== 19 && i !== 26) {
      result['habit-1'][key] = true;
    }

    // Habit 2: Read 15 minutes (has 4-day current streak)
    if (i <= 3) {
      result['habit-2'][key] = true;
    } else if (i !== 4 && i !== 11 && i !== 18 && i !== 23) {
      result['habit-2'][key] = true;
    }

    // Habit 3: Exercise (3-day streak on scheduled days)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      if (i <= 4) {
        result['habit-3'][key] = true;
      } else if (i % 3 !== 0) {
        result['habit-3'][key] = true;
      }
    }

    // Habit 4: Sleep by 11 pm (6-day current streak)
    if (i <= 5) {
      result['habit-4'][key] = true;
    } else if (i !== 6 && i !== 14 && i !== 21) {
      result['habit-4'][key] = true;
    }
  }

  return result;
}

export function getWeekDays(referenceDate: Date = new Date()): Date[] {
  const current = new Date(referenceDate);
  const day = current.getDay();
  // We want Monday to Sunday or Sun to Sat. In the PDF: "Mon: 3 of 4" is specifically referenced.
  // Let's create Monday through Sunday of the current week:
  const diffToMonday = (day + 6) % 7; // 0 for Mon, 1 for Tue, ..., 6 for Sun
  const monday = new Date(current);
  monday.setDate(current.getDate() - diffToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export const AVAILABLE_ICONS = [
  { name: 'Droplet', label: 'Water' },
  { name: 'BookOpen', label: 'Reading' },
  { name: 'Dumbbell', label: 'Exercise' },
  { name: 'Moon', label: 'Sleep' },
  { name: 'Apple', label: 'Nutrition' },
  { name: 'Footprints', label: 'Walk / Steps' },
  { name: 'Brain', label: 'Mindfulness' },
  { name: 'Heart', label: 'Health' },
  { name: 'Flame', label: 'Streak' },
  { name: 'CheckCircle2', label: 'Checklist' },
  { name: 'Coffee', label: 'Routine' },
  { name: 'Sparkles', label: 'Habit' },
];

export const WEEKDAY_LABELS = [
  { day: 1, short: 'M', full: 'Mon' },
  { day: 2, short: 'T', full: 'Tue' },
  { day: 3, short: 'W', full: 'Wed' },
  { day: 4, short: 'T', full: 'Thu' },
  { day: 5, short: 'F', full: 'Fri' },
  { day: 6, short: 'S', full: 'Sat' },
  { day: 0, short: 'S', full: 'Sun' },
];
