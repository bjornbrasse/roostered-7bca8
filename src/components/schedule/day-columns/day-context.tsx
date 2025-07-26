import type { Doc } from 'convex/_generated/dataModel.js';
import type { Dayjs } from 'dayjs';
import { createContext, useContext } from 'react';

export type DayContext = {
  date: Dayjs;
  isActive: boolean;
  isWeekend: boolean;
  // scheduleLocks: Array<
  //   Pick<Doc<'scheduleLocks'>, '_id' | 'start' | 'end' | 'status'>
  // >;
  specialDates: Array<
    Pick<Doc<'specialDates'>, '_id' | 'name' | 'start' | 'end' | 'styles'>
  >;
  tasksToPlan: Array<{ _id: string; name: string }>;
  unplannedTasks: Array<Pick<Doc<'tasks'>, '_id' | 'name'>>;
};

export const dayContext = createContext<DayContext | undefined>(undefined);

export const useDayContext = () => useContext(dayContext);
