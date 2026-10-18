import { Habit, HabitCompletionMap, AppSettings } from '../types';
import { getInitialHabits, getInitialCompletions } from './habitUtils';

const STORAGE_KEYS = {
  HABITS: 'streakup_habits_v1',
  COMPLETIONS: 'streakup_completions_v1',
  SETTINGS: 'streakup_settings_v1',
};

export const defaultSettings: AppSettings = {
  dailyReminderTime: '21:00',
  notificationsEnabled: true,
  textSize: 'normal',
  theme: 'light',
  hasCompletedWelcome: false,
  phoneFrameMode: true,
  oneHandedGuide: false,
};

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return getInitialHabits();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getInitialHabits();
  } catch {
    return getInitialHabits();
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Failed to save habits to localStorage', err);
  }
}

export function loadCompletions(): HabitCompletionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    if (!raw) return getInitialCompletions();
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : getInitialCompletions();
  } catch {
    return getInitialCompletions();
  }
}

export function saveCompletions(completions: HabitCompletionMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  } catch (err) {
    console.error('Failed to save completions to localStorage', err);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to localStorage', err);
  }
}
