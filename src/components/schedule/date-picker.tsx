import dayjs, { type Dayjs } from 'dayjs';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Button } from '~/components/ui/button.js';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '~/components/ui/hover-card.js';

export function DatePicker({
  date,
  onSelect,
}: {
  date: Dayjs;
  onSelect: (date: Dayjs | null) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          {date.format('dd D MMM YYYY')}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={12}
        className="h-[600px] w-96 overflow-y-auto"
      >
        <div className="flex flex-col gap-8 px-2 py-4">
          {Array.from({ length: 5 }, (_, i) => (
            <MonthGrid date={date.add(i, 'months')} key={i} />
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function MonthGrid({ date }: { date: Dayjs }) {
  const numberOfDaysPreviousMonth = (date.startOf('month').day() + 13) % 7;

  function DayHeader({ children }: { children: ReactNode }) {
    return (
      <div className="border-b-2 border-gray-400 text-center">{children}</div>
    );
  }

  return (
    <div className="grid grid-cols-8">
      <div></div>
      <DayHeader>M</DayHeader>
      <DayHeader>D</DayHeader>
      <DayHeader>W</DayHeader>
      <DayHeader>D</DayHeader>
      <DayHeader>V</DayHeader>
      <DayHeader>Z</DayHeader>
      <DayHeader>Z</DayHeader>
      {Array.from({
        length: date.daysInMonth() + numberOfDaysPreviousMonth,
      }).map((_, i) => (
        <>
          {i % 7 === 0 && (
            <div className="pt-1.5 text-left text-primary">
              {date.startOf('month').add(i, 'day').week()}
            </div>
          )}
          {date
            .startOf('month')
            .add(i - numberOfDaysPreviousMonth, 'day')
            .isSameOrAfter(date.startOf('month'), 'day') ? (
            <div
              className="flex size-10 cursor-pointer items-center justify-center rounded-sm text-lg text-gray-600 hover:bg-secondary"
              key={i}
            >
              {dayjs()
                .startOf('month')
                .add(i - numberOfDaysPreviousMonth, 'day')
                .format('D')}
            </div>
          ) : (
            <div />
          )}
        </>
      ))}
    </div>
  );
}
