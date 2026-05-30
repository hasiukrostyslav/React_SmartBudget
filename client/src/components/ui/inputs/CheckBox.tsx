import clsx from 'clsx';

import Icon from '../icons/Icon';

interface CheckBoxProps {
  name: string;
  disabled?: boolean;
  checked: boolean;
  onChange: () => void;
}

export default function CheckBox({
  name,
  disabled,
  checked,
  onChange,
}: CheckBoxProps) {
  return (
    <label className="cursor-pointer select-none">
      <input
        type="checkbox"
        className="peer hidden"
        name={name}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
      />
      <span
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={!disabled ? 0 : -1}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange();
          }
        }}
        className={clsx(
          'flex h-4 w-4 items-center justify-center rounded-sm border',
          'outline-round-sm-ch outline-input border-slate-500',
          '[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100',
          disabled
            ? 'cursor-default bg-slate-200 text-slate-400 dark:bg-slate-500'
            : 'peer-checked:border-blue-400 peer-checked:bg-blue-400 peer-checked:text-slate-50',
        )}
      >
        <Icon name="check" size={14} aria-checked />
      </span>
    </label>
  );
}
