import dayjs from 'dayjs';

export function useSchedule(
  scheduleRef: React.RefObject<HTMLDivElement | null>
) {
  function scrollToDate(
    date: Date,
    scrollIntoViewOptions?: ScrollIntoViewOptions
  ) {
    const schedule = scheduleRef.current;
    if (!schedule) return;
    const scrollToDate = dayjs(date).format('YYYYMMDD');
    const itemToScroll = schedule.querySelector(
      `[data-date="${scrollToDate}"]`
    );

    if (itemToScroll) {
      itemToScroll.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'center',
        ...scrollIntoViewOptions,
      });
    }
  }

  return {
    scrollToDate,
  };
}
