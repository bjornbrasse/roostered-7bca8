import { type Dayjs } from 'dayjs';
import { cn } from '~/lib/utils.js';

export function MonthHeader({
  daysLeft,
  date,
}: {
  daysLeft: number;
  date: Dayjs;
}) {
  const daysInMonth = Math.min(date.daysInMonth() - date.date() + 1, daysLeft);
  const monthStyle: React.CSSProperties = {
    gridColumn: `span ${daysInMonth}`,
  };

  return (
    <div
      className={cn(
        `sticky left-48 top-[10px] z-10 overflow-y-hidden text-nowrap border-l border-gray-400 bg-white py-1 pl-2 text-left text-xl leading-tight dark:bg-gray-700`,
        { 'bg-gray-200 dark:bg-gray-900': date.month() % 2 === 1 }
      )}
      style={monthStyle}
      key={`month-${date.toISOString()}`}
    >
      {date.format('MMMM YYYY')}
    </div>
  );
}
