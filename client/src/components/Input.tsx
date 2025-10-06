import { useState } from 'react';
import { inputIcons } from '@/lib/constants';
import { setBorderColor } from '@/lib/utils';
import Icon from './Icon';

interface InputProps {
  name: 'name' | 'email' | 'password';
  label?: string;
  error?: string;
  isPassword?: boolean;
  disabled?: boolean;
  placeholder?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input({
  name,
  label,
  error,
  isPassword,
  disabled,
  placeholder,
  ref,
  ...props
}: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setIsVisible(isVisible ? false : true);
  }

  const borderColor = setBorderColor({ error, disabled });

  return (
    <div className="relative mb-4.5 flex flex-col gap-2">
      <label className="text-sm tracking-wider" htmlFor={name}>
        {label}
      </label>
      <input
        {...props}
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        type={isPassword && !isVisible ? 'password' : 'text'}
        name={name}
        className={`outline-input border-2 py-2.5 pl-10 tracking-wider text-slate-700 dark:text-slate-50 dark:placeholder:text-slate-400 ${borderColor} ${
          isPassword ? 'pr-10' : 'pr-3'
        }`}
      />
      <span className="absolute bottom-3.5 left-3">
        <Icon
          className="text-slate-400 dark:text-slate-400"
          size={18}
          name={inputIcons[name]}
        />
      </span>
      {isPassword && (
        <button
          type="button"
          className="outline-round-sm absolute right-3 bottom-3.5"
          onClick={handleClick}
        >
          <Icon
            className="text-slate-500 dark:text-slate-400"
            size={16}
            name={isVisible ? 'eye' : 'eye-off'}
          />
        </button>
      )}
      <span className="absolute -bottom-5 text-xs tracking-wide text-red-500">
        {error}
      </span>
    </div>
  );
}
