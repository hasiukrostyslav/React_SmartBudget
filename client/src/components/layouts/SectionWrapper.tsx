import { clsx } from 'clsx';

interface SectionWrapperProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}

export default function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={clsx(
        'rounded-md p-3',
        'border border-slate-300 bg-slate-100',
        'dark:border-slate-600 dark:bg-slate-800',
        className,
      )}
    >
      {children}
    </section>
  );
}
