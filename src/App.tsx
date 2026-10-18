import React, { useState, useEffect } from 'react';
import {
  ActiveScreen,
  MainTab,
  Habit,
  HabitCompletionMap,
  AppSettings,
  TextSize,
  ThemeMode,
} from './types';
import {
  loadHabits,
  saveHabits,
  loadCompletions,
  saveCompletions,
  loadSettings,
  saveSettings,
  defaultSettings,
} from './utils/storage';
import { getInitialHabits, getInitialCompletions, formatDateKey } from './utils/habitUtils';

import { WelcomeScreen } from './components/WelcomeScreen';
import { TodayScreen } from './components/TodayScreen';
import { AddEditHabitScreen } from './components/AddEditHabitScreen';
import { HabitDetailScreen } from './components/HabitDetailScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomTabBar } from './components/BottomTabBar';
import { AboutModal } from './components/AboutModal';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  Calendar,
  Sparkles,
  Info,
  Contrast,
  Sun,
  Moon,
  Hand,
} from 'lucide-react';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [completions, setCompletions] = useState<HabitCompletionMap>(loadCompletions);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Reference date (default to current date, with simulation support)
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());

  // Active Screen and Tab state
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>(() => {
    return settings.hasCompletedWelcome ? 'today' : 'welcome';
  });
  const [activeTab, setActiveTab] = useState<MainTab>('today');

  // Currently viewed / edited habit ID
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // About modal open state
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveCompletions(completions);
  }, [completions]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateSettings = (newPartial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newPartial }));
  };

  // Toggle habit completion for a specific date (defaults to today)
  const toggleHabitCompletion = (habitId: string, targetDateKey?: string) => {
    const key = targetDateKey || formatDateKey(referenceDate);
    setCompletions((prev) => {
      const habitLogs = { ...(prev[habitId] || {}) };
      if (habitLogs[key]) {
        delete habitLogs[key];
      } else {
        habitLogs[key] = true;
      }
      return {
        ...prev,
        [habitId]: habitLogs,
      };
    });
  };

  // Habit CRUD
  const handleSaveHabit = (
    habitData: Omit<Habit, 'id' | 'createdAt'>,
    habitId?: string
  ) => {
    if (habitId) {
      // Edit existing
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, ...habitData } : h))
      );
    } else {
      // Create new
      const newHabit: Habit = {
        ...habitData,
        id: `habit-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setHabits((prev) => [...prev, newHabit]);
    }
    setActiveScreen('today');
    setActiveTab('today');
  };

  const handleDeleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setCompletions((prev) => {
      const copy = { ...prev };
      delete copy[habitId];
      return copy;
    });
    setSelectedHabitId(null);
    setActiveScreen('today');
  };

  const handleResetToDefaults = () => {
    const resetH = getInitialHabits();
    const resetC = getInitialCompletions(referenceDate);
    setHabits(resetH);
    setCompletions(resetC);
    setSelectedHabitId(null);
    setActiveScreen('today');
    setActiveTab('today');
  };

  // Navigation handlers
  const handleGetStarted = () => {
    updateSettings({ hasCompletedWelcome: true });
    setActiveScreen('today');
    setActiveTab('today');
  };

  const handleSkip = () => {
    updateSettings({ hasCompletedWelcome: true });
    setActiveScreen('today');
    setActiveTab('today');
  };

  const handleTabSelect = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveScreen(tab);
    setSelectedHabitId(null);
  };

  const handleSelectHabit = (habitId: string) => {
    setSelectedHabitId(habitId);
    setActiveScreen('detail');
  };

  const handleAddHabitClick = () => {
    setSelectedHabitId(null);
    setActiveScreen('add-habit');
  };

  const handleEditHabitClick = (habit: Habit) => {
    setSelectedHabitId(habit.id);
    setActiveScreen('edit-habit');
  };

  const handleBackToToday = () => {
    setActiveScreen('today');
    setActiveTab('today');
    setSelectedHabitId(null);
  };

  // Theme styling definitions
  const isHighContrast = settings.theme === 'high-contrast';
  const isDark = settings.theme === 'dark' || isHighContrast;

  // Font size classes based on Settings slider
  const getTextSizeClass = (size: TextSize) => {
    switch (size) {
      case 'accessible':
        return 'text-[19px] [&_p]:text-[18px] [&_.text-xs]:text-[14px] [&_.text-sm]:text-[16px]';
      case 'xlarge':
        return 'text-[18px] [&_p]:text-[17px] [&_.text-xs]:text-[13px] [&_.text-sm]:text-[15px]';
      case 'large':
        return 'text-[17px] [&_p]:text-[16px] [&_.text-xs]:text-[12px] [&_.text-sm]:text-[14.5px]';
      case 'normal':
      default:
        return 'text-[16px] [&_p]:text-[15px] [&_.text-xs]:text-[11.5px] [&_.text-sm]:text-[13.5px]';
    }
  };

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  // Render the current screen
  const renderScreen = () => {
    switch (activeScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onSkip={handleSkip}
            theme={settings.theme}
          />
        );
      case 'today':
        return (
          <TodayScreen
            habits={habits}
            completions={completions}
            theme={settings.theme}
            onToggleHabit={toggleHabitCompletion}
            onSelectHabit={handleSelectHabit}
            onAddHabit={handleAddHabitClick}
            referenceDate={referenceDate}
          />
        );
      case 'add-habit':
        return (
          <AddEditHabitScreen
            onSave={handleSaveHabit}
            onCancel={handleBackToToday}
            theme={settings.theme}
          />
        );
      case 'edit-habit':
        return (
          <AddEditHabitScreen
            habitToEdit={selectedHabit}
            onSave={handleSaveHabit}
            onCancel={handleBackToToday}
            onDelete={handleDeleteHabit}
            theme={settings.theme}
          />
        );
      case 'detail':
        return selectedHabit ? (
          <HabitDetailScreen
            habit={selectedHabit}
            completions={completions}
            onBack={handleBackToToday}
            onEdit={handleEditHabitClick}
            onToggleDateCompletion={toggleHabitCompletion}
            theme={settings.theme}
            referenceDate={referenceDate}
          />
        ) : (
          <TodayScreen
            habits={habits}
            completions={completions}
            theme={settings.theme}
            onToggleHabit={toggleHabitCompletion}
            onSelectHabit={handleSelectHabit}
            onAddHabit={handleAddHabitClick}
            referenceDate={referenceDate}
          />
        );
      case 'progress':
        return (
          <ProgressScreen
            habits={habits}
            completions={completions}
            theme={settings.theme}
            referenceDate={referenceDate}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={updateSettings}
            onOpenAbout={() => setIsAboutOpen(true)}
            onOpenWelcome={() => setActiveScreen('welcome')}
            onResetToDefaults={handleResetToDefaults}
          />
        );
      default:
        return null;
    }
  };

  const showBottomTabs =
    activeScreen === 'today' ||
    activeScreen === 'progress' ||
    activeScreen === 'settings';

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        isHighContrast
          ? 'bg-black text-white selection:bg-yellow-300 selection:text-black'
          : isDark
          ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950'
          : 'bg-zinc-100 text-zinc-900 selection:bg-emerald-200'
      } ${getTextSizeClass(settings.textSize)}`}
    >
      {/* Top Companion Bar for Prototype Controls (Framing, Accessibility, Persona Test) */}
      <div
        className={`w-full border-b px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-40 ${
          isHighContrast
            ? 'border-white bg-black text-white'
            : isDark
            ? 'border-zinc-800 bg-zinc-900 text-zinc-300'
            : 'border-zinc-200 bg-white text-zinc-700 shadow-xs'
        }`}
      >
        {/* Left: Branding & Persona Note */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold tracking-tight text-sm text-emerald-600 dark:text-emerald-400">
            StreakUp
          </span>
          <span className="opacity-40">|</span>
          <span className="hidden sm:inline font-medium">
            Oct 18, 2026 Spec · Persona: Dilini (Android)
          </span>
        </div>

        {/* Center / Right: Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* One-handed thumb reach visualizer toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ oneHandedGuide: !settings.oneHandedGuide })}
            className={`min-h-[36px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer border font-semibold transition ${
              settings.oneHandedGuide
                ? isHighContrast
                  ? 'border-2 border-white bg-white text-black'
                  : 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title="Toggle one-handed thumb reach visualizer"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Thumb Reach</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ phoneFrameMode: !settings.phoneFrameMode })}
            className={`min-h-[36px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer border font-semibold transition ${
              settings.phoneFrameMode
                ? 'border-zinc-400 bg-zinc-200/60 dark:bg-zinc-800'
                : 'border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={settings.phoneFrameMode ? 'Switch to Full Width' : 'Switch to Phone Frame'}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {settings.phoneFrameMode ? 'Phone Frame' : 'Full Width'}
            </span>
          </button>

          {/* Quick Theme Switcher */}
          <div className="flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 overflow-hidden">
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'light' })}
              className={`p-1.5 cursor-pointer ${settings.theme === 'light' ? 'bg-zinc-200 text-zinc-900' : 'text-zinc-500'}`}
              title="Light Theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`p-1.5 cursor-pointer ${settings.theme === 'dark' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}
              title="Dark Theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => updateSettings({ theme: 'high-contrast' })}
              className={`p-1.5 cursor-pointer ${settings.theme === 'high-contrast' ? 'bg-white text-black font-bold' : 'text-zinc-500'}`}
              title="High Contrast (WebAIM AAA)"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* About / Spec Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="min-h-[36px] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
          >
            <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Design Specs</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div className="flex justify-center items-start p-0 sm:p-4 md:p-6 min-h-[calc(100vh-45px)]">
        <div
          className={`w-full transition-all duration-300 relative flex flex-col ${
            settings.phoneFrameMode
              ? 'max-w-[420px] min-h-[840px] sm:my-3 rounded-none sm:rounded-[40px] shadow-2xl border-0 sm:border-[8px] overflow-hidden'
              : 'max-w-2xl min-h-screen sm:rounded-2xl border-0 sm:border overflow-hidden'
          } ${
            isHighContrast
              ? 'bg-black border-white text-white'
              : isDark
              ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
              : 'bg-zinc-50 border-zinc-300 text-zinc-900 shadow-lg'
          }`}
        >
          {/* Simulated Mobile Status Bar (Android style for Dilini) */}
          {settings.phoneFrameMode && (
            <div
              className={`px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-mono tracking-tight shrink-0 select-none ${
                isHighContrast
                  ? 'bg-black text-white border-b border-zinc-800'
                  : isDark
                  ? 'bg-zinc-950 text-zinc-400'
                  : 'bg-zinc-50 text-zinc-600'
              }`}
            >
              <span className="font-bold">09:41</span>
              {/* Camera punch hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-700" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Screen Content Wrapper */}
          <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden">
            {renderScreen()}

            {/* One-Handed Ergonomics Thumb Reach Arc Overlay */}
            {settings.oneHandedGuide && (
              <div
                className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end"
                aria-hidden="true"
              >
                <div className="h-[55%] border-t-2 border-dashed border-emerald-500/60 bg-emerald-500/5 rounded-t-[100px] p-4 flex flex-col justify-start items-center">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow">
                    ✓ Dilini's One-Handed Natural Thumb Reach Zone
                  </span>
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-300 mt-1">
                    Checkboxes, bottom tabs & add button reside here
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Tab Bar (Shown on Today, Progress, Settings) */}
          {showBottomTabs && (
            <BottomTabBar
              currentTab={activeTab}
              onSelectTab={handleTabSelect}
              theme={settings.theme}
            />
          )}
        </div>
      </div>

      {/* About & Design Doc Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={settings.theme}
      />
    </div>
  );
}
