import { clsx } from 'clsx';
import { Link } from 'react-router';

import { AUTH_TEXT } from '@/lib/constants/messages';

import Copyright from '../ui/atomic/Copyright';
import Button from '../ui/buttons/ButtonNew';
import ThemeButton from '../ui/buttons/ThemeButton';
import Icon from '../ui/icons/Icon';

interface AuthFormProps {
  children: React.ReactNode;
  type: 'login' | 'register' | 'reset';
}

export default function AuthFormContainer({ children, type }: AuthFormProps) {
  const { header, description, cta } = AUTH_TEXT[type];

  return (
    <section
      className={clsx(
        'relative flex w-full flex-col items-center justify-between sm:w-1/2',
        'bg-card dark:bg-dark-page px-10 py-7 xl:px-12 xl:py-9',
      )}
    >
      <div className="flex items-center gap-2 self-end">
        <span className="text-placeholder dark:text-dark-placeholder text-sm">
          {cta.prompt}
        </span>
        <Button disabled variant="secondary" size="md" href={cta.href}>
          {cta.label}
        </Button>
      </div>

      <div className="flex w-2/3 flex-col gap-6">
        {type === 'reset' && (
          <div className="flex flex-col items-start gap-3">
            <Link
              className={clsx(
                'hover:text-placeholder text-dark-placeholder text-sm font-semibold',
                'flex items-center gap-2',
              )}
              to="/auth/login"
            >
              <Icon name="chevron-left" size={20} />
              Back to sign in
            </Link>
            <span className="bg-primary-light dark:bg-dark-selected rounded-xl p-3">
              <Icon name="key" className="text-primary" />
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <h2 className="text-heading dark:text-dark-heading text-3xl font-extrabold">
            {header}
          </h2>
          <p className="text-muted dark:text-dark-muted text-base">
            {description}
          </p>
        </div>
        {children}
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Copyright />
        <div className="flex gap-6">
          <button className="text-muted hover:text-dark-muted outline-round-sm text-xs underline xl:text-sm">
            Privacy Policy
          </button>
          <button className="text-muted hover:text-dark-muted outline-round-sm text-xs underline xl:text-sm">
            Terms and Conditions
          </button>
        </div>
        <ThemeButton />
      </div>
    </section>
  );
}
