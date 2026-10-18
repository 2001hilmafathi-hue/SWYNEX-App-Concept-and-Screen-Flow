import React from 'react';
import { CheckSquare, BarChart2, Settings as SettingsIcon } from 'lucide-react';
import { MainTab, ThemeMode } from '../types';

interface BottomTabBarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  theme: ThemeMode;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
  theme,
}) => {
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  const tabs: { key: MainTab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'today',
      label: 'Today',
      icon: <CheckSquare className="w-5 h-5" aria-hidden="true" />,
    },
    {
      key: 'progress',
      label: 'Progress',
      icon: <BarChart2 className="w-5 h-5" aria-hidden="true" />,
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingsIcon className="w-5 h-5" aria-hidden="true" />,
    },
  ];

  return (
    <nav
      className={`fixed sm:absolute bottom-0 left-0 right-0 z-30 border-t select-none ${
        isHighContrast
          ? 'bg-black border-t-2 border-white'
          : isDark
          ? 'bg-zinc-950/95 backdrop-blur-md border-zinc-800'
          : 'bg-white/95 backdrop-blur-md border-zinc-200'
      }`}
      role="navigation"
      aria-label="Bottom Navigation Tabs"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-4">
        {tabs.map((t) => {
          const isActive = currentTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onSelectTab(t.key)}
              role="tab"
              aria-selected={isActive}
              aria-label={`${t.label} tab`}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center gap-1 cursor-pointer transition touch-manipulation relative rounded-xl ${
                isActive
                  ? isHighContrast
                    ? 'text-white font-black'
                    : isDark
                    ? 'text-emerald-400 font-bold'
                    : 'text-zinc-900 font-bold'
                  : isHighContrast
                  ? 'text-zinc-400 hover:text-white'
                  : isDark
                  ? 'text-zinc-500 hover:text-zinc-300'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
            >
              <div className="relative">
                {t.icon}
                {isActive && (
                  <span
                    className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                      isHighContrast
                        ? 'bg-yellow-300'
                        : isDark
                        ? 'bg-emerald-400'
                        : 'bg-emerald-600'
                    }`}
                  />
                )}
              </div>
              <span className="text-[11px] tracking-wide">{t.label}</span>
              {isActive && isHighContrast && (
                <div className="absolute bottom-1 w-8 h-1 bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
