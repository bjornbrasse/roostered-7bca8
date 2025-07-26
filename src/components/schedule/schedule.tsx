import type { api } from "convex/_generated/api.js";
import type { Doc } from "convex/_generated/dataModel.js";
import dayjs, { type Dayjs } from "dayjs";
import React, { createContext, Fragment, useContext, useState } from "react";
import { MembersViewDayColumn } from "~/components/schedule/day-columns/members-view-day-column.js";
import { TasksViewDayColumn } from "~/components/schedule/day-columns/tasks-view-day-column.js";
import { MemberRow } from "~/components/schedule/rows/member-row.js";
import { TaskRow } from "~/components/schedule/rows/task-row.js";
import { TopLeftCell } from "~/components/schedule/top-left-cell.js";

export type UserDay = {
  date: Date;
  userId: string;
};

// type TaskDay = {
//   date: Date;
//   task: { id: string };
// };

export type ActiveHeader =
  | { type: "day"; date: Dayjs }
  | { type: "week"; weekNumber: number };

type ScheduleContext = {
  absenceTypes: Array<{ _id: string; name: string; nameShort: string }>;
  activeHeaderState:
    | [
        ActiveHeader | null,
        React.Dispatch<React.SetStateAction<ActiveHeader | null>>,
      ]
    | null;
  dates: Array<Dayjs>;
  schedule: typeof api.schedule.findFirst._returnType;
  selectedUserDays: Array<UserDay>;
  setSelectedUserDays: React.Dispatch<React.SetStateAction<Array<UserDay>>>;
  specialDates: Array<
    Pick<Doc<"specialDates">, "_id" | "name" | "start" | "end" | "styles">
  >;
  view: "members" | "tasks";
};

export const scheduleContext = createContext<ScheduleContext | undefined>(
  undefined,
);

export const useScheduleContext = () => {
  return useContext(scheduleContext);
};

export const Schedule = React.forwardRef<
  HTMLDivElement,
  {
    assignments: Array<{
      _id: string;
      date: Date;
      task: { _id: string };
      user: { _id: string; firstName: string; lastName: string };
    }>;
    dates: Array<Dayjs>;
  } & Omit<
    ScheduleContext,
    "activeHeaderState" | "selectedUserDays" | "setSelectedUserDays"
  >
>(({ ...scheduleContextValue }, scheduleRef) => {
  const { dates, schedule, view } = scheduleContextValue;

  const [activeHeader, setActiveHeader] = useState<ActiveHeader | null>(null);
  const [selectedUserDays, setSelectedUserDays] = useState<Array<UserDay>>([]);

  const numberOfRows =
    view === "tasks"
      ? schedule.scheduleTasks.length
      : schedule.scheduleMembers.length;

  const gridStyle: React.CSSProperties = {
    gridTemplateRows: `10px 36px 30px 76px 2px repeat(${numberOfRows}, 40px)`, // Correct usage with string
  };

  // TYPEGUARD
  function hasTask(
    scheduleTask: (typeof schedule.scheduleTasks)[0],
  ): scheduleTask is (typeof schedule.scheduleTasks)[0] & {
    task: NonNullable<(typeof schedule.scheduleTasks)[0]["task"]>;
  } {
    return Boolean(scheduleTask.task);
  }
  function hasUser(
    scheduleMember: (typeof schedule.scheduleMembers)[0],
  ): scheduleMember is (typeof schedule.scheduleMembers)[0] & {
    user: NonNullable<(typeof schedule.scheduleMembers)[0]["user"]>;
  } {
    return Boolean(scheduleMember.user);
  }

  // useEffect(() => {
  //   const schedule = scheduleRef?.current;
  //   if (!scheduleRef?.current) return;
  //   const scrollToDate = dayjs().format('YYYYMMDD');
  //   const itemToScroll = schedule.querySelector(
  //     `[data-date="${scrollToDate}"]`
  //   );

  //   if (itemToScroll) {
  //     itemToScroll.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'end',
  //       inline: 'center',
  //     });
  //   }
  // }, []);

  if (view === "members") {
    return (
      <scheduleContext.Provider
        value={{
          ...scheduleContextValue,
          activeHeaderState: [activeHeader, setActiveHeader],
          selectedUserDays,
          setSelectedUserDays,
        }}
      >
        <div
          id="schedule-frame"
          className="relative grid w-full flex-1 select-none grid-flow-col overflow-auto overscroll-contain rounded-md border-2 border-gray-400 pr-3 pb-3"
          ref={scheduleRef}
          style={gridStyle}
        >
          <TopLeftCell view={view} />
          <div
            className="sticky top-[152px] z-10 border-2 border-cyan-800"
            // style={{ borderBottom: '2px solid #4338ca' }}
          />
          {schedule.scheduleMembers.map((scheduleMember) => {
            return hasUser(scheduleMember) ? (
              <MemberRow
                scheduleMember={scheduleMember}
                key={scheduleMember.user?._id}
              />
            ) : null;
          })}
          {dates.map((date, index) => (
            <MembersViewDayColumn
              absences={[]}
              assignments={[]}
              columnIndex={index}
              date={date}
              isActive={
                activeHeader?.type === "day"
                  ? activeHeader.date.isSame(date, "day")
                  : activeHeader?.type === "week"
                    ? activeHeader.weekNumber === date.week()
                    : false
              }
              isWeekend={date.day() === 6 || date.day() === 0}
              specialDates={[]}
              tasksToPlan={[]}
              unplannedTasks={[]}
              key={`members-view-day-column-${date.toISOString()}`}
            />
          ))}
          {/* <div className="w-12 border border-black bg-red-400"></div>
        <div className="sticky left-0 w-[2000px] border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div> */}
        </div>
      </scheduleContext.Provider>
    );
  }

  if (view === "tasks") {
    return (
      <scheduleContext.Provider
        value={{
          ...scheduleContextValue,
          activeHeaderState: [activeHeader, setActiveHeader],
          selectedUserDays,
          setSelectedUserDays,
        }}
      >
        <div
          id="schedule-frame"
          className="relative grid w-full flex-1 select-none grid-flow-col overflow-auto overscroll-contain rounded-md border-2 border-gray-400 pr-3 pb-3"
          ref={scheduleRef}
          style={gridStyle}
        >
          <TopLeftCell view={view} />
          <div
            className="sticky top-[152px] z-10 border-2 border-cyan-800"
            // style={{ borderBottom: '2px solid #4338ca' }}
          />
          {schedule.scheduleTasks.map((scheduleTask) => {
            return hasTask(scheduleTask) ? (
              <TaskRow
                onEdit={() => console.log("hoi")}
                scheduleTask={scheduleTask}
                key={`${scheduleTask._id}-task-row`}
              />
            ) : null;
          })}
          {dates.map((date, index) => (
            <Fragment>
              <TasksViewDayColumn
                absences={[]}
                assignments={[]}
                columnIndex={index}
                date={dayjs(date)}
                isActive={
                  activeHeader?.type === "day"
                    ? activeHeader.date.isSame(date, "day")
                    : activeHeader?.type === "week"
                      ? activeHeader.weekNumber === date.week()
                      : false
                }
                isWeekend={dayjs(date).day() === 6 || dayjs(date).day() === 0}
                specialDates={[]}
                tasksToPlan={[]}
                unplannedTasks={[]}
                key={`members-view-day-column-${date.toISOString()}`}
              />
            </Fragment>
          ))}
          {/* <div className="w-12 border border-black bg-red-400"></div>
        <div className="sticky left-0 w-[2000px] border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div>
        <div className="w-12 border border-black bg-red-400"></div> */}
        </div>
      </scheduleContext.Provider>
    );
  }

  return (
    <div
      id="schedule-frame"
      className="relative grid w-full flex-1 select-none grid-flow-col overflow-auto overscroll-contain rounded-md border-2 border-gray-400 pr-3 pb-3"
      ref={scheduleRef}
      style={gridStyle}
    >
      <h1>Nothing here!</h1>
    </div>
  );
});
