import { clsx } from 'clsx';

import type { SelectOption } from '@/types/types';

import Icon from '../icons/Icon';

type SelectOptionItemProps =
  | { option: SelectOption; context: 'value' }
  | {
      option: SelectOption;
      context: 'list';
      showSelectedOption: boolean;
      selectedValue: string | number | undefined;
    };

export default function SelectOptionItem(props: SelectOptionItemProps) {
  const { option, context } = props;

  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        context === 'list' && 'w-full',
      )}
    >
      {(option.color || option.symbol || option.icon) && (
        <div
          className={clsx(
            'rounded-md',
            context === 'list' ? 'p-1' : 'p-0.5',
            option.color,
            !option.icon && !option.symbol && 'p-2',
          )}
        >
          {option.icon && <Icon size={16} name={option.icon}></Icon>}
          {option.symbol && context !== 'value' && (
            <span className="rounded-md border px-2.5 py-0.5 text-lg">
              {option.symbol}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col items-start justify-center">
        <h4 className="dark:text-slate-300">{option.label}</h4>
        {option.description && context === 'list' && (
          <p className={clsx('text-xs text-slate-500 dark:text-slate-400')}>
            {option.description}
          </p>
        )}
      </div>

      {context === 'list' && props.showSelectedOption && (
        <div className="ml-auto flex w-8 justify-end">
          {props.selectedValue === option.value && (
            <Icon
              name="check"
              size={16}
              className="text-blue-700 dark:text-blue-400"
            />
          )}
        </div>
      )}
    </div>
  );
}
