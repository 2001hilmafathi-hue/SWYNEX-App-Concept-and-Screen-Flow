import React, { useState } from 'react';
import { ArrowLeft, Trash2, Check, Clock, Calendar } from 'lucide-react';
import { Habit, FrequencyType, ThemeMode } from '../types';
import { HabitIcon } from './HabitIcon';
import { AVAILABLE_ICONS, WEEKDAY_LABELS } from '../utils/habitUtils';

interface AddEditHabitScreenProps {
  habitToEdit?: Habit | null;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt'>, habitId?: string) => void;
  onCancel: () => void;
  onDelete?: (habitId: string) => void;
  theme: ThemeMode;
}

export const AddEditHabitScreen: React.FC<AddEditHabitScreenProps> = ({
  habitToEdit,
  onSave,
  onCancel,
  onDelete,
  theme,
}) => {
  const isEditing = Boolean(habitToEdit);
  const isHighContrast = theme === 'high-contrast';
  const isDark = theme === 'dark' || isHighContrast;

  const [name, setName] = useState(habitToEdit?.name || '');
  const [icon, setIcon] = useState(habitToEdit?.icon || 'Droplet');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    habitToEdit?.frequencyType || 'daily'
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    habitToEdit?.selectedDays || [1, 2, 3, 4, 5]
  );
  const [reminderTime, setReminderTime] = useState(
    habitToEdit?.reminderTime || '09:00'
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleDay = (dayNum: number) => {
    if (selectedDays.includes(dayNum)) {
      if (selectedDays.length === 1) {
        setError('At least one day must be selected');
        return;
      }
      setSelectedDays(selectedDays.filter((d) => d !== dayNum));
    } else {
      setSelectedDays([...selectedDays, dayNum].sort());
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }

    onSave(
      {
        name: name.trim(),
        icon,
        frequencyType,
        selectedDays: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : selectedDays,
        reminderTime,
      },
      habitToEdit?.id
    );
  };

  return (
    <div className="flex flex-col min-h-full pb-20 select-none">
      {/* Top Navigation Bar */}
      <header className="px-5 py-4 border-b flex items-center justify-between gap-3 sticky top-0 z-10 backdrop-blur-md bg-inherit">
        <button
          type="button"
          onClick={onCancel}
          className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition ${
            isHighContrast
              ? 'border-2 border-white hover:bg-zinc-800 text-white'
              : isDark
              ? 'hover:bg-zinc-800 text-zinc-300'
              : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          aria-label="Cancel and return to Today"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <h1 className="text-xl font-bold tracking-tight">
          {isEditing ? 'Edit Habit' : 'New Habit'}
        </h1>

        <div className="w-10">
          {/* Spacer to center title */}
        </div>
      </header>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="px-5 py-5 space-y-6 flex-1 max-w-lg mx-auto w-full">
        {error && (
          <div
            role="alert"
            className={`p-3.5 rounded-xl text-sm font-semibold border ${
              isHighContrast
                ? 'border-2 border-yellow-300 text-yellow-300 bg-black'
                : 'border-red-300 bg-red-50 text-red-900'
            }`}
          >
            {error}
          </div>
        )}

        {/* Habit Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="habit-name-input"
            className="block text-sm font-bold tracking-wide"
          >
            Habit Name
          </label>
          <input
            id="habit-name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. Drink water, Read 15 mins..."
            maxLength={50}
            className={`w-full min-h-[48px] px-4 py-3 rounded-xl font-medium text-base outline-none transition border ${
              isHighContrast
                ? 'bg-black border-2 border-white text-white focus:ring-2 focus:ring-yellow-300'
                : isDark
                ? 'bg-zinc-900 border-zinc-700 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                : 'bg-white border-zinc-300 text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
            }`}
            required
            aria-required="true"
          />
        </div>

        {/* Icon Picker */}
        <div className="space-y-2.5">
          <label className="block text-sm font-bold tracking-wide">
            Choose Icon
          </label>
          <div
            role="radiogroup"
            aria-label="Habit icon selection"
            className="grid grid-cols-4 sm:grid-cols-6 gap-2.5"
          >
            {AVAILABLE_ICONS.map((item) => {
              const isSelected = icon === item.name;
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setIcon(item.name)}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`${item.label} icon`}
                  className={`min-h-[48px] min-w-[48px] p-3 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition border ${
                    isSelected
                      ? isHighContrast
                        ? 'border-4 border-white bg-white text-black'
                        : isDark
                        ? 'border-2 border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow'
                        : 'border-2 border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                      : isHighContrast
                      ? 'border-2 border-zinc-700 bg-black text-white hover:border-white'
                      : isDark
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <HabitIcon name={item.name} className="w-5 h-5" />
                  <span className="text-[10px] font-semibold truncate max-w-full">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Frequency Choice */}
        <div className="space-y-3">
          <label className="block text-sm font-bold tracking-wide">
            Frequency
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Frequency selection">
            <button
              type="button"
              onClick={() => setFrequencyType('daily')}
              role="radio"
              aria-checked={frequencyType === 'daily'}
              className={`min-h-[48px] p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border transition ${
                frequencyType === 'daily'
                  ? isHighContrast
                    ? 'border-4 border-white bg-white text-black font-extrabold'
                    : isDark
                    ? 'border-2 border-emerald-400 bg-emerald-950/80 text-emerald-300'
                    : 'border-2 border-emerald-600 bg-emerald-50 text-emerald-900'
                  : isHighContrast
                  ? 'border-2 border-zinc-700 bg-black text-white'
                  : isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              }`}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Daily (Every day)</span>
            </button>

            <button
              type="button"
              onClick={() => setFrequencyType('weekdays')}
              role="radio"
              aria-checked={frequencyType === 'weekdays'}
              className={`min-h-[48px] p-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer border transition ${
                frequencyType === 'weekdays'
                  ? isHighContrast
                    ? 'border-4 border-white bg-white text-black font-extrabold'
                    : isDark
                    ? 'border-2 border-emerald-400 bg-emerald-950/80 text-emerald-300'
                    : 'border-2 border-emerald-600 bg-emerald-50 text-emerald-900'
                  : isHighContrast
                  ? 'border-2 border-zinc-700 bg-black text-white'
                  : isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-400'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-700'
              }`}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>Selected Days</span>
            </button>
          </div>

          {/* Weekday Selector (shown when selected weekdays is chosen) */}
          {frequencyType === 'weekdays' && (
            <div className="pt-2">
              <p className={`text-xs font-semibold mb-2 ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Select active days of the week:
              </p>
              <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="Select days of the week">
                {WEEKDAY_LABELS.map((w) => {
                  const isChecked = selectedDays.includes(w.day);
                  return (
                    <button
                      type="button"
                      key={w.day}
                      onClick={() => toggleDay(w.day)}
                      aria-pressed={isChecked}
                      aria-label={`${w.full}`}
                      className={`min-h-[44px] min-w-[40px] rounded-lg font-bold text-xs flex flex-col items-center justify-center cursor-pointer transition border ${
                        isChecked
                          ? isHighContrast
                            ? 'border-2 border-white bg-white text-black'
                            : isDark
                            ? 'border border-emerald-400 bg-emerald-600 text-white'
                            : 'border border-emerald-600 bg-emerald-600 text-white'
                          : isHighContrast
                          ? 'border border-zinc-700 bg-black text-zinc-400'
                          : isDark
                          ? 'border border-zinc-800 bg-zinc-900 text-zinc-500'
                          : 'border border-zinc-200 bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      <span>{w.short}</span>
                      <span className="text-[10px] opacity-75">{isChecked ? '✓' : '—'}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reminder Time Picker */}
        <div className="space-y-2">
          <label
            htmlFor="reminder-time-input"
            className="flex items-center gap-2 text-sm font-bold tracking-wide"
          >
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Reminder Time</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              id="reminder-time-input"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className={`min-h-[48px] px-4 py-2.5 rounded-xl font-mono text-base border outline-none ${
                isHighContrast
                  ? 'bg-black border-2 border-white text-white'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-700 text-white'
                  : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            />
            <span className={`text-xs ${isHighContrast ? 'text-zinc-300' : isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Daily reminder alert
            </span>
          </div>
        </div>

        {/* Action Buttons: Save & Cancel */}
        <div className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm cursor-pointer border transition text-center ${
                isHighContrast
                  ? 'border-2 border-white bg-black text-white hover:bg-zinc-900'
                  : isDark
                  ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm cursor-pointer transition text-center shadow-md flex items-center justify-center gap-2 ${
                isHighContrast
                  ? 'border-2 border-white bg-white text-black hover:bg-zinc-200'
                  : isDark
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold'
                  : 'bg-zinc-900 hover:bg-black text-white'
              }`}
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Save</span>
            </button>
          </div>

          {/* Delete Habit (Edit mode only, with confirmation!) */}
          {isEditing && habitToEdit && onDelete && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition border ${
                    isHighContrast
                      ? 'border-2 border-yellow-300 text-yellow-300 hover:bg-zinc-900'
                      : 'border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                  }`}
                  aria-label="Delete this habit"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Delete Habit</span>
                </button>
              ) : (
                <div
                  className={`p-4 rounded-xl border space-y-3 ${
                    isHighContrast
                      ? 'border-2 border-yellow-300 bg-black text-white'
                      : 'border-red-300 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200'
                  }`}
                  role="alertdialog"
                  aria-label="Confirm habit deletion"
                >
                  <p className="font-bold text-sm">
                    Delete "{habitToEdit.name}"?
                  </p>
                  <p className="text-xs">
                    This will delete this habit and all its recorded streaks.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold border cursor-pointer border-current"
                    >
                      Keep Habit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(habitToEdit.id)}
                      className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                        isHighContrast
                          ? 'bg-yellow-300 text-black font-extrabold'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
