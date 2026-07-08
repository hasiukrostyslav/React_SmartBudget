import { useId } from 'react';

import clsx from 'clsx';

import type { IconName } from '@/types/types';

import { INPUT_CONFIG } from '@/lib/constants/ui';

import InputButton from './InputButton';
import InputError from './InputError';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';
import InputRangeButtons from './InputRangeButtons';

interface InputProps {
  name: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  iconName?: IconName;
  groupPosition?: 'start' | 'end';
  type?: 'text' | 'number' | 'password';
  step?: number | 'any';
  ref?: React.Ref<HTMLInputElement>;
  padding?: keyof typeof INPUT_CONFIG.padding;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  trailingButton?: {
    role: keyof typeof INPUT_CONFIG.button.roleIcon;
    onClick: () => void;
  };
  rangeButtons?: { increaseValue: () => void; decreaseValue: () => void };
}

export default function Input({
  name,
  label,
  value,
  disabled,
  placeholder,
  error,
  iconName,
  groupPosition,
  type = 'text',
  step,
  ref,
  padding = 'lg',
  onChange,
  trailingButton,
  rangeButtons,
  ...props
}: InputProps) {
  const id = useId();

  const borderColor = INPUT_CONFIG.border;

  return (
    <div className={clsx('relative', error ? 'mb-4.5' : '')}>
      {label && (
        <InputLabel label={label} htmlFor={`${name}-${id}`} margin={padding} />
      )}

      <div className="relative">
        {iconName && <InputIcon name={iconName} padding={padding} />}

        <input
          {...props}
          ref={ref}
          id={`${name}-${id}`}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          value={value}
          onChange={onChange}
          type={
            name === 'password' && trailingButton?.role === 'showPassword'
              ? 'password'
              : type === 'number'
                ? 'number'
                : 'text'
          }
          min={0}
          step={step}
          className={clsx(
            'outline-input w-full text-sm tracking-wider',
            'text-slate-700 dark:text-slate-300 dark:placeholder:text-slate-600',
            trailingButton ? 'pr-10' : 'pr-3',
            iconName ? INPUT_CONFIG.icon.padding[padding] : 'pl-3',
            padding === 'lg' ? 'border-2' : 'border',
            INPUT_CONFIG.padding[padding],
            groupPosition === 'start' && 'rounded-l-none',
            groupPosition === 'end' && 'rounded-r-none',
            error
              ? borderColor.error
              : disabled
                ? borderColor.disabled
                : borderColor.default,
          )}
        />

        {((trailingButton && trailingButton.role !== 'clear') ||
          (trailingButton && trailingButton.role === 'clear' && value)) && (
          <InputButton
            positionPadding={padding}
            role={trailingButton.role}
            onClick={trailingButton.onClick}
          />
        )}

        {rangeButtons && (
          <InputRangeButtons
            increaseValue={rangeButtons.increaseValue}
            decreaseValue={rangeButtons.decreaseValue}
          />
        )}
      </div>

      {error && <InputError message={error} />}
    </div>
  );
}
