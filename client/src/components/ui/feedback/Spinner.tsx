import clsx from 'clsx';

interface SpinnerProps {
  title?: string;
  subtitle?: string;
}

export default function Spinner({ title, subtitle }: SpinnerProps) {
  return (
    <div
      className={clsx(
        'row-span-full flex h-full w-full flex-col items-center justify-center',
        'absolute top-0 left-0 gap-4 rounded-2xl select-none',
        'bg-slate-100/80 dark:bg-slate-900/80',
      )}
    >
      <div
        className="animate-spin rounded-full"
        style={{
          width: 52,
          height: 52,
          background: 'conic-gradient(from 0deg, transparent 0%, #3b82f6 100%)',
          WebkitMask:
            'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
          mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))',
        }}
      />
      {title && (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </span>
          {subtitle && (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
