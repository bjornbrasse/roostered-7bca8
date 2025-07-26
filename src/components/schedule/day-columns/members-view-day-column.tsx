import dayjs from 'dayjs';
import type { Absence } from '~/components/schedule/day-cells/absence-day-cell.js';
import {
  MemberDayCell,
  type MemberDayCellAssignment,
} from '~/components/schedule/day-cells/members-view-day-cell.js';
import { DayHeader } from '~/components/schedule/day-columns/day-column-headers/day-header.js';
import { LockHeader } from '~/components/schedule/day-columns/day-column-headers/lock-header.js';
import { MonthHeader } from '~/components/schedule/day-columns/day-column-headers/month-header.js';
import { WeekHeader } from '~/components/schedule/day-columns/day-column-headers/week-header.js';
import {
  dayContext,
  type DayContext,
} from '~/components/schedule/day-columns/day-context.js';
import { useScheduleContext } from '~/components/schedule/schedule.js';

export function MembersViewDayColumn({
  absences,
  assignments,
  columnIndex,
  ...dayContextValue
}: {
  absences: Array<Absence>;
  assignments: Array<MemberDayCellAssignment>;
  columnIndex: number;
} & DayContext) {
  const { date } = dayContextValue;

  const scheduleContext = useScheduleContext();
  if (!scheduleContext) throw new Error('Set Schedule Context');
  const { activeHeaderState, dates, schedule } = scheduleContext;
  if (!schedule) return;

  return (
    <dayContext.Provider
      // value={{
      //   columnIndex,
      //   date,
      //   unplannedTasks: tasksToPlan.filter(
      //     (taskToPlan) =>
      //       !assignments.some(
      //         (assignment) => assignment.task._id === taskToPlan._id
      //       )
      //   ),
      // }}
      value={{
        ...dayContextValue,
      }}
    >
      <LockHeader
        date={date}
        scheduleLocks={schedule.locks.filter(
          (l) =>
            dayjs(l.start).isSameOrAfter(date.startOf('day')) &&
            dayjs(l.end).isSameOrBefore(date.endOf('day'))
        )}
        key={`${date.toString()}-lock`}
      />
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
      {schedule.scheduleMembers.map((scheduleMember) => {
        return (
          <MemberDayCell
            absences={absences.filter(
              (absence) => absence.userId === scheduleMember.userId
            )}
            assignments={assignments.filter(
              (assignment) => assignment.userId === scheduleMember.userId
            )}
            date={date}
            scheduleMember={scheduleMember}
            key={`${scheduleMember.userId}-${date.toISOString()}-member-day-cell`}
          />
        );
      })}
    </dayContext.Provider>
  );
}
