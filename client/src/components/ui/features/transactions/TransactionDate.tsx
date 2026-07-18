import { clsx } from 'clsx';

interface TransactionDateProps {
  date: string | Date;
  withTime: boolean;
}

export default function TransactionDate({
  date,
  withTime,
}: TransactionDateProps) {
  const d = date instanceof Date ? date : new Date(date);
  const formattedDate = new Intl.DateTimeFormat('uk').format(d);
  const time = new Intl.DateTimeFormat('uk', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);

  return (
    <div className={clsx('flex flex-col', withTime ? 'px-1.5' : '')}>
      <span className="font-medium">{formattedDate}</span>
      {withTime && (
        <span className="text-slate-500 dark:text-slate-500">{time}</span>
      )}
    </div>
  );
}
