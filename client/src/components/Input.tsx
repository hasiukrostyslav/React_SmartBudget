import { useState } from 'react';
import Icon from './Icon';

interface InputProps {
  name: string;
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export default function Input({ name, label, error, isPassword }: InputProps) {
  const [isVisible, setIsVisible] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setIsVisible(isVisible ? false : true);
  }

  return (
    <div className="relative mb-4.5 flex flex-col gap-2">
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        type={isPassword && !isVisible ? 'password' : 'text'}
        name={name}
        className={`outline-round-md border-2 py-2 ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${isPassword ? 'pr-10 pl-3' : 'px-3'}`}
      />
      {isPassword && (
        <button
          className="outline-round-sm absolute right-3 bottom-3 h-4 w-4"
          onClick={handleClick}
        >
          <Icon
            className="text-slate-500 dark:text-slate-400"
            size={16}
            name={isVisible ? 'eye' : 'eye-off'}
          />
        </button>
      )}
      <span className="absolute -bottom-5.5 text-xs text-red-500">{error}</span>
    </div>
  );
}
