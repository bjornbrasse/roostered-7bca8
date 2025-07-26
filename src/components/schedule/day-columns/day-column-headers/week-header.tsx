import { useScheduleContext } from '~/components/schedule/schedule.js';
import { cn } from '~/lib/utils.js';

export function WeekHeader({ weekNumber }: { weekNumber: number }) {
  // const [_, setSearchParams] = useSearchParams()
  const scheduleContext = useScheduleContext();
  if (!scheduleContext) throw new Error('Set Schedule Context');
  const { activeHeaderState } = scheduleContext;

  const isActiveWeek =
    activeHeaderState?.[0]?.type === 'week' &&
    activeHeaderState[0].weekNumber === weekNumber;

  return (
    <div
      onClick={() => {
        activeHeaderState?.[1]({ type: 'week', weekNumber });
      }}
      className={cn(
        `sticky left-48 top-[46px] z-10 col-span-7 cursor-pointer bg-white py-0.5 pl-2 text-left dark:bg-gray-700`,
        {
          'bg-gray-200 dark:bg-gray-900': weekNumber % 2 === 0,
          'bg-background-active dark:bg-background-selected': isActiveWeek,
        }
      )}
      style={{
        borderBottom: '1px solid grey',
        borderLeft: '1px solid grey',
        borderTop: '1px solid grey',
      }}
      key={`week-${weekNumber}`}
    >
      week {weekNumber}
    </div>
  );
}
