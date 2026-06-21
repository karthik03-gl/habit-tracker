import { Habit, HabitRecord } from "@/store/useHabitStore";
import { subDays, format, isBefore, startOfDay } from "date-fns";

export function calculateStreaks(habit: Habit, records: HabitRecord) {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = startOfDay(new Date());
  const createdAt = startOfDay(new Date(habit.createdAt));
  
  // Start checking from today and go backwards
  let checkDate = today;
  let isCurrentStreakActive = true;

  // Hard limit to avoid infinite loops, e.g. 1000 days
  for (let i = 0; i < 1000; i++) {
    if (isBefore(checkDate, createdAt)) {
      break; // Stop if we reach before the habit was created
    }

    const dateStr = format(checkDate, "yyyy-MM-dd");
    const dayOfWeek = checkDate.getDay();

    // Check if habit is due on this day
    const isDue = habit.frequency === 'daily' || 
                 (Array.isArray(habit.frequency) && habit.frequency.includes(dayOfWeek));

    if (isDue) {
      const count = records[habit.id]?.[dateStr] || 0;
      const isCompleted = count >= habit.targetCount;

      if (isCompleted) {
        tempStreak++;
        if (isCurrentStreakActive) {
          currentStreak++;
        }
      } else {
        // If today is not completed, it doesn't break the current streak if we are checking today
        // But if yesterday wasn't completed, streak is 0.
        if (i !== 0) {
          isCurrentStreakActive = false;
        }
        
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }

    checkDate = subDays(checkDate, 1);
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
}
