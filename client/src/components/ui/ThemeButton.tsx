import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Icon from './Icon';

export default function ThemeButton({ className }: { className?: string }) {
  const [isInitial, setIsInitial] = useState(true);
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  return (
    <div
      className={`flex gap-6 rounded-2xl border-2 border-slate-300 px-2 py-1 ${className}`}
    >
      <button
        className={`outline-round-full p-1 ${
          theme === 'light' ? 'bg-slate-300' : ''
        } ${!isInitial && theme === 'light' ? 'animate-wiggle' : ''}`}
        onClick={() => {
          setIsInitial(true);
          setLightTheme();
          setIsInitial(false);
        }}
      >
        <Icon name="sun" size={16} />
      </button>
      <button
        className={`outline-round-full p-1 ${
          theme === 'dark' ? 'bg-slate-500' : ''
        } ${!isInitial && theme === 'dark' ? 'animate-wiggle' : ''}`}
        onClick={() => {
          setIsInitial(true);
          setDarkTheme();
          setIsInitial(false);
        }}
      >
        <Icon name="moon" size={16} />
      </button>
    </div>
  );
}
