"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Habit, useHabitStore, HabitFrequency } from "@/store/useHabitStore";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6",
  "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HabitFormProps {
  initialData?: Habit;
}

export function HabitForm({ initialData }: HabitFormProps) {
  const router = useRouter();
  const { addHabit, updateHabit, deleteHabit } = useHabitStore();

  const [name, setName] = useState(initialData?.name || "");
  const [icon, setIcon] = useState(initialData?.icon || "✨");
  const [color, setColor] = useState(initialData?.color || COLORS[9]);
  const [frequencyType, setFrequencyType] = useState<'daily' | 'specific'>(
    initialData?.frequency === 'daily' || !initialData ? 'daily' : 'specific'
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    Array.isArray(initialData?.frequency) ? initialData.frequency : []
  );
  const [targetCount, setTargetCount] = useState(initialData?.targetCount || 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const frequency: HabitFrequency = frequencyType === 'daily' ? 'daily' : selectedDays;
    
    const habitData = {
      name,
      icon,
      color,
      frequency,
      targetCount,
    };

    if (initialData) {
      updateHabit(initialData.id, habitData);
    } else {
      addHabit(habitData);
    }

    router.push("/");
  };

  const handleDelete = () => {
    if (initialData && confirm("Are you sure you want to delete this habit?")) {
      deleteHabit(initialData.id);
      router.push("/");
    }
  };

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter(d => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-3xl font-bold">{initialData ? "Edit Habit" : "New Habit"}</h1>
        </div>
        {initialData && (
          <button 
            onClick={handleDelete}
            type="button"
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <Trash2 size={24} />
          </button>
        )}
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-neutral-500">Icon</label>
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-neutral-100 dark:border-neutral-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all"
                style={{ backgroundColor: `${color}20` }}
              >
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full h-full bg-transparent text-center focus:outline-none"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium text-neutral-500">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Drink Water, Read 10 pages..."
                className="w-full text-2xl font-bold bg-transparent border-b-2 border-neutral-200 dark:border-neutral-800 focus:border-emerald-500 pb-2 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-neutral-500">Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-10 h-10 rounded-full transition-all flex items-center justify-center",
                    color === c ? "scale-110 ring-4 ring-offset-2 ring-emerald-500 dark:ring-offset-neutral-900" : "hover:scale-110"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <label className="text-sm font-medium text-neutral-500">Frequency</label>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFrequencyType('daily')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  frequencyType === 'daily' ? "bg-white dark:bg-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                Every day
              </button>
              <button
                type="button"
                onClick={() => setFrequencyType('specific')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-colors",
                  frequencyType === 'specific' ? "bg-white dark:bg-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                Specific days
              </button>
            </div>

            {frequencyType === 'specific' && (
              <div className="flex justify-between gap-1 mt-4">
                {WEEKDAYS.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={cn(
                      "flex-1 py-3 rounded-xl font-medium text-sm transition-all",
                      selectedDays.includes(index)
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    )}
                  >
                    {day[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-500 block">Daily Target</label>
                <p className="text-xs text-neutral-400 mt-1">How many times per day?</p>
              </div>
              <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm hover:text-emerald-500 transition-colors"
                >
                  -
                </button>
                <span className="font-bold w-4 text-center">{targetCount}</span>
                <button
                  type="button"
                  onClick={() => setTargetCount(targetCount + 1)}
                  className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm hover:text-emerald-500 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <Save size={24} />
          {initialData ? "Save Changes" : "Create Habit"}
        </button>
      </form>
    </div>
  );
}
