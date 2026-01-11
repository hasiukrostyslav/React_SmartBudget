import { useEffect, useState } from 'react';

export default function Time() {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const formatTime = new Intl.DateTimeFormat('uk', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date);

  return (
    <div className="flex gap-2">
      <span className="text-sm text-slate-400">{formatDate}</span>
      <span className="text-sm text-slate-400">{formatTime}</span>
    </div>
  );
}
