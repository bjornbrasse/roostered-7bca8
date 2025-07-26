import { type ReactNode, useRef, useState } from 'react';
import { cn } from '~/lib/utils.js';
import dayjs, { type Dayjs } from 'dayjs';
import { useScheduleContext } from '~/components/schedule/schedule.js';
import { Button } from '~/components/ui/button.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card.js';
// import { SpecialDateForm } from '~/routes/resources+/forms+/special-date-form.js';
import {
  GiftIcon,
  MessageCircleMoreIcon,
  TriangleAlertIcon,
  XIcon,
} from 'lucide-react';
import { useDayContext } from '~/components/schedule/day-columns/day-context.js';

export type DayHeaderProps = {
  date: Dayjs;
};

export function DayHeader({ date }: DayHeaderProps) {
  const [showSpecialDateForm, setShowSpecialDateForm] = useState(false);

  const membersDayContext = useDayContext();
  const scheduleContext = useScheduleContext();
  if (!membersDayContext || !scheduleContext)
    throw new Error('Context not set');
  const { unplannedTasks } = membersDayContext;
  const { activeHeaderState, schedule, specialDates } = scheduleContext;
  if (!schedule) return;

  const dateSpecialDates = specialDates.filter(
    (specialDate) =>
      dayjs(specialDate.start).isSameOrBefore(date, 'day') &&
      dayjs(specialDate.end).isSameOrAfter(date, 'day')
  );

  const isActiveDay =
    activeHeaderState &&
    activeHeaderState[0]?.type === 'day' &&
    activeHeaderState[0].date.isSame(date, 'day');

  const isWeekend = dayjs(date).day() === 6 || dayjs(date).day() === 0;

  // const dateAssignments = assignments.filter((assignment) =>
  //   dayjs(assignment.date).isSame(date)
  // );

  // const tasksToPlan = schedule.scheduleTasks
  //   .filter(
  //     (st) => st.task?.daysOfTheWeek?.split('')[dayjs(date).day()] === '1'
  //   )
  //   .map((st) => st.task);

  // const unplannedTasks = tasksToPlan.filter(
  //   (taskToPlan) =>
  //     !dateAssignments.some(
  //       (assignment) => assignment.task.id === taskToPlan.id
  //     )
  // );
  // const hasUnplannedTasks = unplannedTasks.length > 0;

  return (
    <HoverCard
      open={showSpecialDateForm}
      onOpenChange={(open) => !open || false}
    >
      <ContextMenu>
        <ContextMenuTrigger
          className="data-[state=open]:bg-background-selected"
          asChild
        >
          <HoverCardTrigger
            className="data-[state=open]:bg-background-selected"
            asChild
          >
            <div
              // onClick={() =>
              // setActiveHeader((value) =>
              //   value?.type === 'day' && value.date.isSame(date, 'day')
              //     ? null
              //     : { type: 'day', date }
              // )
              // }
              data-date={`${dayjs(date).format('YYYYMMDD')}`}
              className={cn(
                'sticky top-[76px] z-10 flex min-h-10 min-w-16 cursor-pointer flex-col items-center border-l border-gray-400 bg-white dark:bg-gray-700',
                {
                  'bg-gray-200 dark:bg-gray-900': isWeekend,
                  'bg-background-active dark:bg-background-active': isActiveDay,
                  'bg-red-600': dateSpecialDates.length > 0,
                }
              )}
              style={
                dateSpecialDates.length > 0
                  ? {
                      backgroundColor:
                        specialDates[0]?.styles?.backgroundColor ??
                        // schedule?.specialDateDefaultBackgroundColor,
                        '#000',
                    }
                  : {}
              }
            >
              <div className="flex h-6 gap-0.5 place-self-end px-0.5 pt-0.5 text-cyan-700">
                {unplannedTasks.length > 0 && (
                  <TriangleAlertIcon size={20} color="#dc2626" />
                )}
                {false && (
                  <>
                    <GiftIcon size={18} />
                    <MessageCircleMoreIcon size={18} />
                  </>
                )}
                {/* <GiftIcon size={18} color="#ea00ff" /> */}
              </div>
              {dayjs(date).isToday() ? (
                <Today>
                  <p className="text-sm">{date.format('dd')}</p>
                  <p className="text-[18px] font-bold">{date.format('DD')}</p>
                </Today>
              ) : (
                <Day>
                  <p className="text-sm">{date.format('dd')}</p>
                  <p className="text-[18px] font-bold">{date.format('DD')}</p>
                </Day>
              )}
              {/* <div className="absolute right-0 top-0 h-0 w-0 border-l-[16px] border-t-[16px] border-transparent border-t-red-500"></div> */}
            </div>
          </HoverCardTrigger>
        </ContextMenuTrigger>
        <HoverCardContent
          sideOffset={8}
          className="w-96 border border-gray-400 bg-gray-300 shadow-2xl"
        >
          <h1>Maak een Speciale Datum</h1>
          <Button onClick={() => setShowSpecialDateForm(false)} variant="ghost">
            <XIcon />
          </Button>
          {/* <SpecialDateForm start={date} /> */}
        </HoverCardContent>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowSpecialDateForm(true)}>
            Maak Speciale datum
          </ContextMenuItem>
          {specialDates.length > 0 && (
            <>
              <ContextMenuSeparator />
              <ContextMenuLabel className="p-1 text-xs text-primary">
                Speciale Datums:
              </ContextMenuLabel>
              {specialDates.map((specialDate) => (
                <ContextMenuItem
                  onClick={() => setShowSpecialDateForm(true)}
                  key={specialDate._id}
                >
                  {specialDate.name}
                </ContextMenuItem>
              ))}
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </HoverCard>
  );
}

function Day({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center">{children}</div>;
}

function Today({ children }: { children: ReactNode }) {
  const ref = useRef(null);
  // const { setTodayIsVisible } = useScheduleContext();

  // useEffect(() => {
  //   if (!ref.current) return;
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       setTodayIsVisible(() => entries[0]?.isIntersecting ?? false);
  //     },
  //     {
  //       root: document.querySelector('#schedule-frame'),
  //       rootMargin: '0px 0px 0px -192px',
  //       threshold: 0.5,
  //     }
  //   );
  //   observer.observe(ref.current);
  // }, [ref]);

  return (
    <div
      ref={ref}
      className="flex size-12 flex-col items-center rounded-full bg-primary text-primary-foreground"
    >
      {children}
    </div>
  );
}
