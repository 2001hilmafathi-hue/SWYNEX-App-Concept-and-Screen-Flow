import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Type,
  Sun,
  Moon,
  Contrast,
  Info,
  RotateCcw,
  Smartphone,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { AppSettings, TextSize, ThemeMode } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenAbout: () => void;
  onOpenWelcome: () => void;
  onResetToDefaults: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onOpenAbout,
  onOpenWelcome,
  onResetToDefaults,
}) => {
  const isHighContrast = settings.theme === 'high-contrast';
  const isDark = settings.theme === 'dark' || isHighContrast;

  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Map slider index (0 to 3) to TextSize
  const textSizeOptions: { key: TextSize; label: string; px: string; desc: string }[] = [
    { key: 'normal', label: 'Default', px: '16px', desc: 'Standard readable body font' },
    { key: 'large', label: 'Large', px: '18px', desc: 'Easier reading in dim light' },
    { key: 'xlarge', label: 'X-Large', px: '20px', desc: 'High visibility' },
    { key: 'accessible', label: 'Max', px: '22px', desc: 'Maximum accessibility' },
  ];

  const currentSliderIndex = textSizeOptions.findIndex((opt) => opt.key === settings.textSize);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    const chosen = textSizeOptions[idx]?.key || 'normal';
    onUpdateSettings({ textSize: chosen });
  };

  const handleNotificationToggle = () => {
    const nextState = !settings.notificationsEnabled;
    onUpdateSettings({ notificationsEnabled: nextState });

    if (nextState) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
      setNotificationToast(`Daily notifications active for ${settings.dailyReminderTime}`);
    } else {
      setNotificationToast('Notifications disabled');
    }
    setTimeout(() => setNotificationToast(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full pb-24 select-none">
      {/* Top Header */}
      <header className="px-5 pt-4 pb-2">
        <p className={`text-xs uppercase tracking-widest font-bold ${
          isHighContrast ? 'text-yellow-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Preferences
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight mt-0.5">
          Settings
        </h1>
      </header>

      {/* Main Settings List */}
      <main className="px-5 py-4 space-y-5 flex-1 max-w-lg mx-auto w-full">
        {notificationToast && (
          <div
            role="status"
            className={`p-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
              isHighContrast
                ? 'border-2 border-white bg-black text-white'
                : 'border-emerald-300 bg-emerald-50 text-emerald-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notificationToast}</span>
          </div>
        )}

        {/* 1. Daily Reminder Time & Notifications Toggle */}
        <section
          className={`p-5 rounded-2xl border space-y-4 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
          aria-labelledby="heading-notifications"
        >
          <h2 id="heading-notifications" className="font-bold text-base flex items-center gap-2">
            <Bell className="w-5 h-5" aria-hidden="true" />
            <span>Daily Reminders</span>
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-semibold text-sm block">Push Notifications</span>
              <span className={`text-xs ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Gentle check-in alert before bedtime
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.notificationsEnabled}
              onClick={handleNotificationToggle}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center border ${
                settings.notificationsEnabled
                  ? isHighContrast
                    ? 'bg-white border-2 border-white justify-end'
                    : isDark
                    ? 'bg-emerald-500 border-emerald-400 justify-end'
                    : 'bg-emerald-600 border-emerald-600 justify-end'
                  : isHighContrast
                  ? 'bg-black border-2 border-white justify-start'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 justify-start'
                  : 'bg-zinc-200 border-zinc-300 justify-start'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full transition-transform ${
                  settings.notificationsEnabled
                    ? isHighContrast
                      ? 'bg-black'
                      : 'bg-white'
                    : isHighContrast
                    ? 'bg-white'
                    : isDark
                    ? 'bg-zinc-400'
                    : 'bg-white shadow-sm'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <label htmlFor="daily-time-input" className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>Reminder Time</span>
            </label>
            <input
              id="daily-time-input"
              type="time"
              value={settings.dailyReminderTime}
              onChange={(e) => onUpdateSettings({ dailyReminderTime: e.target.value })}
              className={`min-h-[44px] px-3 py-1.5 rounded-xl font-mono text-sm border outline-none ${
                isHighContrast
                  ? 'bg-black border-2 border-white text-white'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-900'
              }`}
            />
          </div>
        </section>

        {/* 2. Text Size Slider */}
        <section
          className={`p-5 rounded-2xl border space-y-4 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
          aria-labelledby="heading-textsize"
        >
          <div className="flex items-center justify-between">
            <h2 id="heading-textsize" className="font-bold text-base flex items-center gap-2">
              <Type className="w-5 h-5" aria-hidden="true" />
              <span>Text Size Slider</span>
            </h2>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isHighContrast ? 'border-white text-yellow-300' : isDark ? 'border-zinc-700 text-zinc-300' : 'border-zinc-300 text-zinc-700'
            }`}>
              {textSizeOptions[currentSliderIndex]?.label} ({textSizeOptions[currentSliderIndex]?.px})
            </span>
          </div>

          <p className={`text-xs ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Body text starts at 16 px and scales up to assist reading in low light and for color blindness / low vision.
          </p>

          <div className="pt-2">
            <input
              type="range"
              min={0}
              max={3}
              step={1}
              value={currentSliderIndex >= 0 ? currentSliderIndex : 0}
              onChange={handleSliderChange}
              className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
              aria-label="Text size scale"
              aria-valuetext={textSizeOptions[currentSliderIndex]?.label}
            />

            <div className="flex justify-between text-xs font-semibold mt-2">
              {textSizeOptions.map((opt, i) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => onUpdateSettings({ textSize: opt.key })}
                  className={`cursor-pointer transition ${
                    opt.key === settings.textSize
                      ? isHighContrast
                        ? 'text-yellow-300 font-extrabold underline'
                        : 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : isHighContrast
                      ? 'text-zinc-400'
                      : isDark
                      ? 'text-zinc-500 hover:text-zinc-300'
                      : 'text-zinc-400 hover:text-zinc-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Theme Choice (Light, Dark, High Contrast) */}
        <section
          className={`p-5 rounded-2xl border space-y-4 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
          aria-labelledby="heading-theme"
        >
          <div>
            <h2 id="heading-theme" className="font-bold text-base flex items-center gap-2">
              <Contrast className="w-5 h-5" aria-hidden="true" />
              <span>Theme Choice</span>
            </h2>
            <p className={`text-xs mt-1 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              High-contrast mode guarantees minimum 4.5:1 text/icon contrast for red-green color blindness.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5" role="radiogroup" aria-label="Theme options">
            <button
              type="button"
              role="radio"
              aria-checked={settings.theme === 'light'}
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`min-h-[48px] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer border transition ${
                settings.theme === 'light'
                  ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              <Sun className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-semibold">Light</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={settings.theme === 'dark'}
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`min-h-[48px] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer border transition ${
                settings.theme === 'dark'
                  ? 'border-2 border-emerald-400 bg-zinc-800 text-white font-bold shadow-sm'
                  : isDark
                  ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              <Moon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-semibold">Dark</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={settings.theme === 'high-contrast'}
              onClick={() => onUpdateSettings({ theme: 'high-contrast' })}
              className={`min-h-[48px] p-3 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer border transition ${
                settings.theme === 'high-contrast'
                  ? 'border-4 border-white bg-white text-black font-extrabold shadow-sm'
                  : isHighContrast
                  ? 'border-2 border-zinc-600 bg-black text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400'
              }`}
            >
              <Contrast className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs font-semibold">High Contrast</span>
            </button>
          </div>
        </section>

        {/* 4. One-Handed Ergonomics / Phone Guide Toggle */}
        <section
          className={`p-5 rounded-2xl border space-y-3 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-sm block flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" aria-hidden="true" />
                <span>One-Handed Thumb Reach Indicator</span>
              </span>
              <span className={`text-xs ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Visualizes the natural thumb radius zone for Dilini's Android one-handed use
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.oneHandedGuide}
              onClick={() => onUpdateSettings({ oneHandedGuide: !settings.oneHandedGuide })}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center border ${
                settings.oneHandedGuide
                  ? isHighContrast
                    ? 'bg-white border-2 border-white justify-end'
                    : isDark
                    ? 'bg-emerald-500 border-emerald-400 justify-end'
                    : 'bg-emerald-600 border-emerald-600 justify-end'
                  : isHighContrast
                  ? 'bg-black border-2 border-white justify-start'
                  : isDark
                  ? 'bg-zinc-800 border-zinc-700 justify-start'
                  : 'bg-zinc-200 border-zinc-300 justify-start'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full ${
                  settings.oneHandedGuide
                    ? isHighContrast
                      ? 'bg-black'
                      : 'bg-white'
                    : isHighContrast
                    ? 'bg-white'
                    : isDark
                    ? 'bg-zinc-400'
                    : 'bg-white shadow-sm'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 5. About Link & App Info */}
        <section
          className={`p-5 rounded-2xl border space-y-3 ${
            isHighContrast
              ? 'border-2 border-white bg-black'
              : isDark
              ? 'border-zinc-800 bg-zinc-900'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <button
            type="button"
            onClick={onOpenAbout}
            className={`w-full min-h-[44px] flex items-center justify-between py-2 text-left cursor-pointer group`}
            aria-label="View About StreakUp and Design Specification"
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div>
                <span className="font-bold text-sm block group-hover:underline">About StreakUp</span>
                <span className={`text-xs ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Design doc specification, persona Dilini & accessibility review
                </span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition" />
          </button>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenWelcome}
              className="text-xs font-semibold hover:underline cursor-pointer py-1"
            >
              Replay Welcome Screen
            </button>

            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className={`text-xs font-semibold hover:underline cursor-pointer py-1 flex items-center gap-1 ${
                  isHighContrast ? 'text-yellow-300' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Habits</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-red-500 font-bold">Reset all?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetToDefaults();
                    setShowResetConfirm(false);
                  }}
                  className="px-2 py-1 text-xs font-bold rounded bg-red-600 text-white cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 text-xs rounded border border-current cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
