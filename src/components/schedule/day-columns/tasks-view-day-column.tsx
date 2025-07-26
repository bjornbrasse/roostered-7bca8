import type { Doc } from 'convex/_generated/dataModel.js';
import type { Absence } from '~/components/schedule/day-cells/absence-day-cell.js';
import { TaskDayCell } from '~/components/schedule/day-cells/tasks-view-day-cell.js';
import { DayHeader } from '~/components/schedule/day-columns/day-column-headers/day-header.js';
import { LockHeader } from '~/components/schedule/day-columns/day-column-headers/lock-header.js';
import { MonthHeader } from '~/components/schedule/day-columns/day-column-headers/month-header.js';
import { WeekHeader } from '~/components/schedule/day-columns/day-column-headers/week-header.js';
import {
  dayContext,
  type DayContext,
} from '~/components/schedule/day-columns/day-context.js';
import { useScheduleContext } from '~/components/schedule/schedule.js';

export function TasksViewDayColumn({
  absences,
  assignments,
  columnIndex,
  ...dayContextValue
}: {
  absences: Array<Absence>;
  assignments: Array<
    Pick<Doc<'assignments'>, '_id'> & {
      task: Pick<Doc<'tasks'>, '_id' | 'nameShort'>;
      user: Pick<Doc<'users'>, 'firstName' | 'lastName'>;
    }
  >;
  columnIndex: number;
} & DayContext) {
  const { date } = dayContextValue;

  const scheduleContext = useScheduleContext();
  if (!scheduleContext) throw new Error('Set Schedule Context');
  const { dates, schedule } = scheduleContext;
  if (!schedule) return;

  return (
    <dayContext.Provider
      value={{
        ...dayContextValue,
      }}
    >
      <LockHeader date={date} key={`${date.toString()}-lock`} />
      {(columnIndex === 0 || date.date() === 1) && (
        <MonthHeader
          daysLeft={dates.length - columnIndex}
          date={date}
          key={`${date.toDate()}-month`}
        />
      )}
      {(columnIndex === 0 || date.day() === 1) && (
        <WeekHeader weekNumber={date.week()} key={`${date.toString()}-week`} />
      )}
      <DayHeader date={date} key={`${date.toString()}-day`} />
      <div
        className="sticky top-[152px] z-10 border-2 border-cyan-800"
        // style={{ borderBottom: '2px solid #4338ca' }}
      />
      {schedule.scheduleTasks.map((scheduleTask) => {
        return (
          <TaskDayCell
            assignments={assignments
              .filter(
                (assignment) => assignment.task._id === scheduleTask.task._id
              )
              .map((assignment) => ({
                _id: assignment._id,
                caption: `${assignment.user.firstName.charAt(0)}${assignment.user.lastName.charAt(0)}`,
              }))}
            scheduleTask={scheduleTask}
            key={`${scheduleTask._id}-${date}-member-day-cell`}
          />
        );
      })}
    </dayContext.Provider>
  );
}
