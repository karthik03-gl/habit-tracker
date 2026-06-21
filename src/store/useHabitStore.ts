import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, subDays } from 'date-fns';

export type HabitFrequency = 'daily' | number[];

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetCount: number; // default 1
  categoryId?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type HabitRecord = {
  [habitId: string]: {
    [dateStr: string]: number; // count of completions
  };
};

export interface HabitState {
  habits: Habit[];
  categories: Category[];
  records: HabitRecord;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  incrementHabit: (habitId: string, dateStr: string) => void;
  toggleHabit: (habitId: string, dateStr: string) => void;
  importData: (data: Partial<HabitState>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const todayStr = format(new Date(), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const twoDaysAgoStr = format(subDays(new Date(), 2), 'yyyy-MM-dd');

const defaultCategories: Category[] = [
  { id: '1', name: 'Health', color: '#10b981' },
  { id: '2', name: 'Productivity', color: '#3b82f6' },
  { id: '3', name: 'Mindfulness', color: '#8b5cf6' },
];

const defaultHabits: Habit[] = [
  {
    id: 'h1',
    name: 'Drink Water',
    icon: '💧',
    color: '#3b82f6',
    frequency: 'daily',
    targetCount: 8,
    categoryId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h2',
    name: 'Read 10 Pages',
    icon: '📚',
    color: '#8b5cf6',
    frequency: 'daily',
    targetCount: 1,
    categoryId: '2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'h3',
    name: 'Workout',
    icon: '🏋️‍♂️',
    color: '#10b981',
    frequency: [1, 3, 5], // Mon, Wed, Fri
    targetCount: 1,
    categoryId: '1',
    createdAt: new Date().toISOString(),
  }
];

const defaultRecords: HabitRecord = {
  h1: {
    [todayStr]: 4,
    [yesterdayStr]: 8,
    [twoDaysAgoStr]: 8,
  },
  h2: {
    [yesterdayStr]: 1,
    [twoDaysAgoStr]: 1,
  }
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: defaultHabits,
      categories: defaultCategories,
      records: defaultRecords,

      addHabit: (habitData) => set((state) => ({
        habits: [...state.habits, { ...habitData, id: generateId(), createdAt: new Date().toISOString() }],
      })),

      updateHabit: (id, habitData) => set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? { ...h, ...habitData } : h)),
      })),

      deleteHabit: (id) => set((state) => {
        const newRecords = { ...state.records };
        delete newRecords[id];
        return {
          habits: state.habits.filter((h) => h.id !== id),
          records: newRecords,
        };
      }),

      addCategory: (catData) => set((state) => ({
        categories: [...state.categories, { ...catData, id: generateId() }],
      })),

      updateCategory: (id, catData) => set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? { ...c, ...catData } : c)),
      })),

      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        habits: state.habits.map((h) => h.categoryId === id ? { ...h, categoryId: undefined } : h),
      })),

      incrementHabit: (habitId, dateStr) => set((state) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return state;

        const currentCount = state.records[habitId]?.[dateStr] || 0;
        const newCount = currentCount >= habit.targetCount ? 0 : currentCount + 1;

        return {
          records: {
            ...state.records,
            [habitId]: {
              ...(state.records[habitId] || {}),
              [dateStr]: newCount,
            },
          },
        };
      }),

      toggleHabit: (habitId, dateStr) => set((state) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return state;

        const currentCount = state.records[habitId]?.[dateStr] || 0;
        const newCount = currentCount >= habit.targetCount ? 0 : habit.targetCount;

        return {
          records: {
            ...state.records,
            [habitId]: {
              ...(state.records[habitId] || {}),
              [dateStr]: newCount,
            },
          },
        };
      }),

      importData: (data) => set((state) => ({
        habits: data.habits || state.habits,
        categories: data.categories || state.categories,
        records: data.records || state.records,
      })),
    }),
    {
      name: 'habit-tracker-data-v1',
    }
  )
);
