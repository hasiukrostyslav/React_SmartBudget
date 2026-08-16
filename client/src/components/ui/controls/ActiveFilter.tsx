import { clsx } from 'clsx';
import { z } from 'zod';

import { FilterParamsSchema } from '@/lib/schemas/transaction.schema';

import ButtonIcon from '../buttons/ButtonIcon';

type FilterKey = keyof z.infer<typeof FilterParamsSchema>;

type ActiveFilterProps =
  | {
      filter: { key: keyof z.infer<typeof FilterParamsSchema>; value: string };
      onClick: (filter: { key: FilterKey; value: string }) => void;
    }
  | { filterCount: number; onClick: () => void; isExpanded: boolean };

export default function ActiveFilter(props: ActiveFilterProps) {
  if ('filterCount' in props) {
    const { filterCount, onClick, isExpanded } = props;

    return (
      <div className="shrink-0 whitespace-nowrap">
        <div
          className={clsx(
            'flex items-center gap-1 rounded-xl border py-0.5 pr-1 pl-2',
            'border-slate-400 bg-slate-200/20 dark:border-slate-600 dark:bg-slate-800',
          )}
        >
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            {isExpanded ? 'Show less' : `+${filterCount} more`}
          </p>
          <div>
            <ButtonIcon
              iconName={isExpanded ? 'chevron-up' : 'chevron-down'}
              shape="round"
              size={10}
              variant="ghost"
              onClick={onClick}
            />
          </div>
        </div>
      </div>
    );
  }

  const { filter, onClick } = props;

  return (
    <div className="shrink-0 whitespace-nowrap">
      <div
        className={clsx(
          'flex items-center gap-1 rounded-xl border py-0.5 pr-1 pl-2',
          'border-blue-400 bg-blue-200/20 dark:border-slate-600 dark:bg-slate-800',
        )}
      >
        <p className="text-sm text-blue-600 dark:text-blue-400">
          {filter.key.at(0)?.toUpperCase() + filter.key.slice(1)} :{' '}
          <span className="font-semibold">
            {filter.value
              .replace('-', ' ')
              .split(' ')
              .map((value) =>
                value ? value.at(0)?.toUpperCase() + value.slice(1) : '',
              )
              .join(' ')}
          </span>
        </p>
        <div>
          <ButtonIcon
            iconName="close"
            shape="round"
            size={10}
            variant="primary"
            onClick={() => onClick(filter)}
          />
        </div>
      </div>
    </div>
  );
}
