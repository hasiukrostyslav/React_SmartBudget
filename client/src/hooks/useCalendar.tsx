import { useState } from 'react';

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';

export function useCalendar(selected: Date) {
  const [cursor, setCursor] = useState(selected ?? new Date());

  const formattedDate = format(selected, 'dd.MM.yyyy, HH:mm');

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
  });

  const toPrevMonth = () => setCursor((c) => subMonths(c, 1));
  const toNextMonth = () => setCursor((c) => addMonths(c, 1));
  const goToMonth = (date: Date) => setCursor(date);

  return { formattedDate, days, cursor, toPrevMonth, toNextMonth, goToMonth };
}
