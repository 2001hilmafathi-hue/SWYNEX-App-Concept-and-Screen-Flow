export type FrequencyType = 'daily' | 'weekdays';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequencyType: FrequencyType;
  selectedDays: number[]; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  reminderTime: string; // e.g. "20:00" or "08:00"
  createdAt: string;
}

export type HabitCompletionMap = Record<string, Record<string, boolean>>; // habitId -> { 'YYYY-MM-DD': true }

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export type TextSize = 'normal' | 'large' | 'xlarge' | 'accessible';

export interface AppSettings {
  dailyReminderTime: string;
  notificationsEnabled: boolean;
  textSize: TextSize;
  theme: ThemeMode;
  hasCompletedWelcome: boolean;
  phoneFrameMode: boolean;
  oneHandedGuide: boolean;
}

export type ActiveScreen = 'welcome' | 'today' | 'add-habit' | 'edit-habit' | 'detail' | 'progress' | 'settings';

export type MainTab = 'today' | 'progress' | 'settings';
