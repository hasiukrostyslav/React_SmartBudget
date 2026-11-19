import clsx from 'clsx';

import { useTheme } from '@/hooks/useTheme';

import Icon from '../icons/Icon';

export default function ThemeButton({ className }: { className?: string }) {
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  return (
    <div
      className={clsx(
        'bg-line dark:bg-dark-hover flex gap-0.5 rounded-full p-0.75',
        className,
      )}
    >
      <button
        aria-label="Light theme"
        aria-pressed={theme === 'light'}
        className={clsx(
          'outline-round-full grid h-7.5 w-8.5 place-items-center rounded-full',
          theme === 'light'
            ? 'bg-card text-warning shadow-toggle'
            : 'text-muted dark:text-dark-muted bg-transparent',
        )}
        onClick={() => setLightTheme()}
      >
        <Icon name="light" size={16} />
      </button>
      <button
        aria-label="Dark theme"
        aria-pressed={theme === 'dark'}
        className={clsx(
          'outline-round-full grid h-7.5 w-8.5 place-items-center rounded-full',
          theme === 'dark'
            ? 'bg-dark-selected text-dark-heading'
            : 'text-muted dark:text-dark-muted bg-transparent',
        )}
        onClick={() => setDarkTheme()}
      >
        <Icon name="dark" size={16} />
      </button>
    </div>
  );
}
