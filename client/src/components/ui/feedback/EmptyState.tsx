import clsx from 'clsx';

import { EMPTY_STATE_TEXT } from '@/lib/constants/messages';

import Button from '../buttons/Button';
import Icon from '../icons/Icon';

type EmptyStateEntry = (typeof EMPTY_STATE_TEXT)[keyof typeof EMPTY_STATE_TEXT];

interface EmptyStateProps {
  config: EmptyStateEntry;
  children?: React.ReactNode;
}

export default function EmptyState({ config, children }: EmptyStateProps) {
  return (
    <section
      className={clsx(
        'row-span-full flex h-full flex-col items-center justify-center',
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="h-35 w-35"
          alt="Error"
          src="/error-404.png"
          width={140}
          height={140}
        />
        {config?.header && (
          <h2
            className={clsx(
              'mt-4 text-xl leading-snug font-bold tracking-wider',
            )}
          >
            {config.header}
          </h2>
        )}
      </div>
      <div
        className={clsx(
          'mt-2 flex w-1/3 flex-col items-center justify-center gap-3 text-center',
        )}
      >
        {config?.description && (
          <p className="text-slate-500">{config.description}</p>
        )}
        {children ||
          (config?.cta && (
            <div className="flex gap-2">
              <Button color="blue" size="sm">
                <Icon name="plus" size={14} />
                <span>{config.cta.primaryLabel}</span>
              </Button>
              {'secondaryLabel' in config.cta && config.cta.secondaryLabel && (
                <Button color="outline" size="sm">
                  {config.cta.secondaryLabel}
                </Button>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}
