import React from 'react';

import { getHours, getMinutes, setHours, setMinutes } from 'date-fns';

import Icon from '../icons/Icon';
import Input from '../inputs/Input';

interface TimeSelectProps {
  selectedValue?: Date;
  children: React.ReactNode;
  onChange: (date: Date) => void;
}

// wrap a number into the 0..max-1 range in both directions (e.g. -1 → max-1)
const wrap = (value: number, max: number) => ((value % max) + max) % max;

export default function TimeSelect({
  selectedValue,
  children,
  onChange,
}: TimeSelectProps) {
  const date = selectedValue ?? new Date();
  const hour = String(getHours(date)).padStart(2, '0');
  const minute = String(getMinutes(date)).padStart(2, '0');

  const changeHour = (value: number) =>
    onChange(setHours(date, wrap(value, 24)));
  const changeMinute = (value: number) =>
    onChange(setMinutes(date, wrap(value, 60)));

  return (
    <div className="flex gap-3 border-t border-slate-300 p-3 dark:border-slate-500">
      <div className="flex items-center gap-2 font-semibold text-slate-400">
        <Icon name="clock" size={14} />
        <h4>Time</h4>
      </div>
      <div className="flex items-center gap-1">
        <Input
          name="hour"
          type="number"
          padding="sm"
          value={hour}
          onChange={(e) => changeHour(Math.min(Number(e.target.value), 23))}
          rangeButtons={{
            onIncrease: () => changeHour(getHours(date) + 1),
            onDecrease: () => changeHour(getHours(date) - 1),
          }}
        />
        <span className="font-bold">:</span>
        <Input
          name="minute"
          type="number"
          padding="sm"
          value={minute}
          onChange={(e) => changeMinute(Math.min(Number(e.target.value), 59))}
          rangeButtons={{
            onIncrease: () => changeMinute(getMinutes(date) + 1),
            onDecrease: () => changeMinute(getMinutes(date) - 1),
          }}
        />
      </div>
      {children}
    </div>
  );
}
