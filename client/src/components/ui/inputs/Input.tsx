'use client';

import { useId } from 'react';
import clsx from 'clsx';
import { useShowPassword } from '@/hooks/useShowPassword';
import { setBorderColor } from '@/lib/utils/utils';
import type { IconName } from '@/types/types';
import InputLabel from './InputLabel';
import InputIcon from './InputIcon';
import InputButton from './InputButton';
import InputError from './InputError';

interface InputProps {
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
  icon?: IconName;
  withButton?: boolean;
  withError?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  width?: 'sm' | 'md' | 'lg' | 'full';
  type?: 'text' | 'number' | 'password';
}

const styles = {
  width: { sm: 'min-w-18', md: 'min-w-38', lg: 'min-w-50', full: 'w-full' },
  padding: { sm: 'py-1.5 border', md: 'py-2 border-2', lg: 'py-2.5 border-2' },
};

export default function Input({
  name,
  label,
  error,
  disabled,
  placeholder,
  ref,
  icon,
  withButton,
  withError,
  padding = 'lg',
  width = 'full',
  type = 'text',
  ...props
}: InputProps) {
  const id = useId();
  const { isPasswordShown, handleClick } = useShowPassword();

  const borderColor = setBorderColor({ error, disabled });

  return (
    <div className={clsx('relative', withError ? 'mb-4.5' : '')}>
      {label && (
        <InputLabel label={label} htmlFor={`${name}-${id}`} margin={padding} />
      )}

      <div className="relative">
        {icon && <InputIcon name={icon} />}

        <input
          {...props}
          ref={ref}
          id={`${name}-${id}`}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          type={
            name === 'password' && !isPasswordShown
              ? 'password'
              : type === 'number'
                ? 'number'
                : 'text'
          }
          min={0}
          className={clsx(
            'outline-input text-sm tracking-wider',
            'text-slate-700 dark:text-slate-50 dark:placeholder:text-slate-400',
            withButton ? 'pr-10' : 'pr-3',
            icon ? 'pl-10' : 'pl-3',
            styles.padding[padding],
            styles.width[width],
            borderColor,
          )}
        />

        {withButton && (
          <InputButton
            isPasswordShown={isPasswordShown}
            onClick={handleClick}
          />
        )}
      </div>

      {error && <InputError message={error} />}
    </div>
  );
}
