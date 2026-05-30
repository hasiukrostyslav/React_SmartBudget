import { useId } from 'react';

import clsx from 'clsx';

import type { IconName } from '@/types/types';

import { INPUT_CONFIG } from '@/lib/constants/ui';

import InputButton from './InputButton';
import InputError from './InputError';
import InputIcon from './InputIcon';
import InputLabel from './InputLabel';

interface InputProps {
  name: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  icon?: IconName;
  type?: 'text' | 'number' | 'password';
  ref?: React.Ref<HTMLInputElement>;
  padding?: keyof typeof INPUT_CONFIG.padding;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  trailingButton?: {
    role: keyof typeof INPUT_CONFIG.button.roleIcon;
    onClick: () => void;
  };
}

export default function Input({
  name,
  label,
  value,
  disabled,
  placeholder,
  error,
  icon,
  type = 'text',
  ref,
  padding = 'lg',
  onChange,
  trailingButton,
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
        {icon && <InputIcon name={icon} padding={padding} />}

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
          className={clsx(
            'outline-input w-full text-sm tracking-wider',
            'text-slate-700 dark:text-slate-300 dark:placeholder:text-slate-600',
            trailingButton ? 'pr-10' : 'pr-3',
            icon ? INPUT_CONFIG.icon.padding[padding] : 'pl-3',
            padding === 'lg' ? 'border-2' : 'border',
            INPUT_CONFIG.padding[padding],
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
      </div>

      {error && <InputError message={error} />}
    </div>
  );
}
