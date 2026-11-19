import { clsx } from 'clsx';

import ThemeButton from '../ui/buttons/ThemeButton';

interface AuthFormProps {
  children: React.ReactNode;
  heading: string;
}

export default function AuthFormContainer({
  children,
  heading,
}: AuthFormProps) {
  return (
    <section
      className={clsx(
        'relative flex w-1/2 flex-col items-center justify-between',
        'px-12 py-9 xl:px-14 xl:py-11',
      )}
    >
      <div className="flex w-1/2 flex-col items-center justify-center gap-2">
        <h2 className="text-lg font-medium tracking-wide">{heading}</h2>
        {children}
      </div>
      <div className="flex w-full items-center justify-between">
        <div></div>
        <ThemeButton />
      </div>
    </section>
  );
}
