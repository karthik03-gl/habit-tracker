"use client";

import { useHabitStore } from "@/store/useHabitStore";
import { HabitCard } from "@/components/HabitCard";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { habits, records, incrementHabit, toggleHabit } = useHabitStore();
  const [mounted, setMounted] = useState(false);
  const todayDate = new Date();
  const todayStr = format(todayDate, "yyyy-MM-dd");
  const currentDayOfWeek = todayDate.getDay(); // 0 is Sunday, 1 is Monday

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const todayHabits = habits.filter(habit => {
    if (habit.frequency === 'daily') return true;
    if (Array.isArray(habit.frequency)) {
      return habit.frequency.includes(currentDayOfWeek);
    }
    return false;
  });

  const completedCount = todayHabits.filter(h => {
    const count = records[h.id]?.[todayStr] || 0;
    return count >= h.targetCount;
  }).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Today</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
            {format(todayDate, "EEEE, MMMM do")}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-500">
            {completedCount} <span className="text-xl text-neutral-400">/ {todayHabits.length}</span>
          </div>
          <p className="text-sm font-medium text-neutral-500">Completed</p>
        </div>
      </header>

      {todayHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <PlusCircle className="text-neutral-400" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No habits for today</h3>
          <p className="text-neutral-500 mb-6 max-w-sm">
            You don't have any habits scheduled for today. Add a new one to get started!
          </p>
          <Link 
            href="/habits/new" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Add Habit
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {todayHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completedCount={records[habit.id]?.[todayStr] || 0}
              onIncrement={() => {
                incrementHabit(habit.id, todayStr);
                const current = records[habit.id]?.[todayStr] || 0;
                if (current + 1 === habit.targetCount) {
                  import("canvas-confetti").then((confetti) => {
                    confetti.default({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                      colors: [habit.color, '#ffffff']
                    });
                  });
                }
              }}
              onToggle={() => toggleHabit(habit.id, todayStr)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
