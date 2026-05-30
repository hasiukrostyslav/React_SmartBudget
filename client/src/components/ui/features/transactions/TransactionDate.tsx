export default function TransactionDate({ date }: { date: Date | string }) {
  const d = date instanceof Date ? date : new Date(date);
  const formattedDate = new Intl.DateTimeFormat('uk').format(d);
  const time = new Intl.DateTimeFormat('uk', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(d);

  return (
    <div className="flex flex-col px-1.5">
      <span className="font-medium">{formattedDate}</span>
      <span className="text-slate-500 dark:text-slate-500">{time}</span>
    </div>
  );
}
