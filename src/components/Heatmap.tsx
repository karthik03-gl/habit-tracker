import { subDays, format, eachDayOfInterval, startOfDay } from 'date-fns';
import { Habit, HabitRecord } from '@/store/useHabitStore';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  habit: Habit;
  records: HabitRecord;
}

export function Heatmap({ habit, records }: HeatmapProps) {
  const today = startOfDay(new Date());
  const startDate = subDays(today, 89); // Last 90 days

  const days = eachDayOfInterval({ start: startDate, end: today });

  const getIntensityClass = (count: number, target: number) => {
    if (count === 0) return "bg-neutral-100 dark:bg-neutral-800";
    const ratio = count / target;
    if (ratio >= 1) return "opacity-100";
    if (ratio >= 0.75) return "opacity-80";
    if (ratio >= 0.5) return "opacity-60";
    if (ratio >= 0.25) return "opacity-40";
    return "opacity-20";
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{habit.icon}</span>
        <h4 className="font-medium">{habit.name}</h4>
      </div>
      
      <div className="flex flex-wrap gap-1 md:gap-1.5">
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const count = records[habit.id]?.[dateStr] || 0;
          const isCompleted = count > 0;
          
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${count}/${habit.targetCount}`}
              className={cn(
                "w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all hover:scale-125 cursor-help",
                getIntensityClass(count, habit.targetCount)
              )}
              style={isCompleted ? { backgroundColor: habit.color } : {}}
            />
          );
        })}
      </div>
    </div>
  );
}
