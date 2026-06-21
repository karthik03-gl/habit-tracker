"use client";

import { useHabitStore } from "@/store/useHabitStore";
import { Heatmap } from "@/components/Heatmap";
import { calculateStreaks } from "@/lib/streaks";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { subDays, format, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { Trophy, Target, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { habits, records } = useHabitStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate Overall Completion %
  // Total due habits in the last 30 days vs completed
  const today = startOfDay(new Date());
  let totalDue = 0;
  let totalCompleted = 0;

  for (let i = 0; i < 30; i++) {
    const d = subDays(today, i);
    const dateStr = format(d, "yyyy-MM-dd");
    const dayOfWeek = d.getDay();

    habits.forEach(habit => {
      if (d < startOfDay(new Date(habit.createdAt))) return;

      const isDue = habit.frequency === 'daily' || 
                   (Array.isArray(habit.frequency) && habit.frequency.includes(dayOfWeek));
      if (isDue) {
        totalDue++;
        const count = records[habit.id]?.[dateStr] || 0;
        if (count >= habit.targetCount) {
          totalCompleted++;
        }
      }
    });
  }

  const completionRate = totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : 0;

  // Calculate Best Streaks overall
  let overallBestStreak = 0;
  let bestStreakHabitName = "None";
  
  habits.forEach(habit => {
    const { longestStreak } = calculateStreaks(habit, records);
    if (longestStreak > overallBestStreak) {
      overallBestStreak = longestStreak;
      bestStreakHabitName = habit.name;
    }
  });

  // Prepare Chart Data (Last 7 Days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    const dateStr = format(d, "yyyy-MM-dd");
    let completed = 0;
    
    habits.forEach(habit => {
      const count = records[habit.id]?.[dateStr] || 0;
      if (count >= habit.targetCount) {
        completed++;
      }
    });

    return {
      name: format(d, "EEE"),
      completed
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">
          Your progress at a glance
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <Target size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">30-Day Completion</p>
            <p className="text-3xl font-bold">{completionRate}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Best Streak</p>
            <p className="text-3xl font-bold">{overallBestStreak} <span className="text-base font-normal text-neutral-400">days</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">Top Habit</p>
            <p className="text-xl font-bold truncate max-w-[120px]">{bestStreakHabitName}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-lg font-bold mb-6">Weekly Completion</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#525252" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#888888' }} />
              <Tooltip 
                cursor={{ fill: '#888888', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Consistency Heatmap</h3>
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-6 overflow-x-auto">
          {habits.length === 0 ? (
            <p className="text-neutral-500">No habits added yet.</p>
          ) : (
            habits.map(habit => (
              <Heatmap key={habit.id} habit={habit} records={records} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
