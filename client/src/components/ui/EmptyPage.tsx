import clsx from 'clsx';

export default function EmptyPage({
  children,
  message,
}: {
  children?: React.ReactNode;
  message?: string;
}) {
  return (
    <section
      className={clsx(
        'row-span-full flex h-full flex-col items-center justify-center',
      )}
    >
      <div className="flex flex-col items-center justify-center gap-8">
        <img
          className="h-[220] w-[220]"
          alt="Error"
          src="/error-404.png"
          width={220}
          height={220}
        />
        <h2
          className={clsx(
            'mt-4 text-2xl leading-snug font-bold tracking-wider',
          )}
        >
          Nothing here yet
        </h2>
      </div>
      <div className="mt-2 flex flex-col items-center justify-center gap-6">
        <p className="text-slate-500">{message}</p>
        {children}
      </div>
    </section>
  );
}
