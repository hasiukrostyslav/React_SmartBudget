import { clsx } from 'clsx';

import Copyright from '../ui/atomic/Copyright';
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
        'relative flex w-full flex-col items-center justify-between sm:w-1/2',
        'bg-card dark:bg-dark-page px-10 py-7 xl:px-12 xl:py-9',
      )}
    >
      <div className="flex w-1/2 flex-col items-center justify-center gap-2">
        <h2 className="text-lg font-medium tracking-wide">{heading}</h2>
        {children}
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Copyright />
        <div className="flex gap-6">
          <button className="text-muted text-xs underline xl:text-sm">
            Privacy Policy
          </button>
          <button className="text-muted text-xs underline xl:text-sm">
            Terms and Conditions
          </button>
        </div>
        <ThemeButton />
      </div>
    </section>
  );
}
