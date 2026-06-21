"use client";

import { Habit } from "@/store/useHabitStore";
import { cn } from "@/lib/utils";
import { Check, Plus, Minus } from "lucide-react";
import confetti from "canvas-confetti";
import Link from "next/link";

interface HabitCardProps {
  habit: Habit;
  completedCount: number;
  onIncrement: () => void;
  onToggle: () => void;
}

export function HabitCard({ habit, completedCount, onIncrement, onToggle }: HabitCardProps) {
  const isCompleted = completedCount >= habit.targetCount;
  const progress = Math.min((completedCount / habit.targetCount) * 100, 100);

  const handleComplete = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [habit.color, '#ffffff']
      });
    }
    onToggle();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 transition-all hover:shadow-md">
      {/* Progress Background */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-20 transition-all duration-500 ease-in-out"
        style={{ 
          backgroundColor: habit.color,
          width: `${progress}%` 
        }}
      />
      
      <div className="relative flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <Link href={`/habits/edit?id=${habit.id}`} className="w-12 h-12 flex items-center justify-center rounded-xl text-2xl shadow-sm hover:scale-105 transition-transform" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
            {habit.icon}
          </Link>
          <div>
            <Link href={`/habits/edit?id=${habit.id}`} className="hover:underline decoration-2 underline-offset-2" style={{ textDecorationColor: habit.color }}>
              <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-100">{habit.name}</h3>
            </Link>
            {habit.targetCount > 1 && (
              <p className="text-sm text-neutral-500 font-medium">
                {completedCount} / {habit.targetCount}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {habit.targetCount > 1 ? (
            <button
              onClick={onIncrement}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                isCompleted 
                  ? "bg-emerald-500 text-white" 
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
            >
              {isCompleted ? <Check size={24} /> : <Plus size={24} />}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm",
                isCompleted 
                  ? "text-white" 
                  : "bg-neutral-100 dark:bg-neutral-800 text-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700"
              )}
              style={isCompleted ? { backgroundColor: habit.color } : {}}
            >
              <Check size={24} className={isCompleted ? "opacity-100" : "opacity-20 text-neutral-400"} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
