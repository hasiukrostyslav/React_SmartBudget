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
    <div className="flex flex-col gap-2 mb-4.5 relative">
      <label className="text-sm" htmlFor={name}>
        {label}
      </label>
      <input
        type={isPassword && !isVisible ? 'password' : 'text'}
        name={name}
        className={`outline-round-md py-2 border-2 ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${isPassword ? 'pl-3 pr-10' : 'px-3'}`}
      />
      {isPassword && (
        <button
          className="absolute outline-round-sm right-3 bottom-3 w-4 h-4"
          onClick={handleClick}
        >
          {isVisible ? <Icon name="visible" /> : <Icon name="hidden" />}
        </button>
      )}
      <span className="text-xs text-red-500 absolute -bottom-5.5">{error}</span>
    </div>
  );
}
