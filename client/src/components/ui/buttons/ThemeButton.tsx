import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Icon from '../Icon';

export default function ThemeButton({ className }: { className?: string }) {
  const [isInitial, setIsInitial] = useState(true);
  const { theme, setLightTheme, setDarkTheme } = useTheme();

  return (
    <div
      className={`flex gap-6 rounded-2xl border-2 border-blue-400 px-2 py-1 ${className}`}
    >
      <button
        className={`outline-round-full p-1 ${
          theme === 'light' ? 'bg-blue-300 text-blue-600' : 'text-blue-200'
        } ${!isInitial && theme === 'light' ? 'animate-wiggle' : ''}`}
        onClick={() => {
          setIsInitial(true);
          setLightTheme();
          setIsInitial(false);
        }}
      >
        <Icon name="light" size={16} />
      </button>
      <button
        className={`outline-round-full p-1 ${
          theme === 'dark' ? 'bg-blue-500 text-blue-200' : 'text-blue-600'
        } ${!isInitial && theme === 'dark' ? 'animate-wiggle' : ''}`}
        onClick={() => {
          setIsInitial(true);
          setDarkTheme();
          setIsInitial(false);
        }}
      >
        <Icon name="dark" size={16} />
      </button>
    </div>
  );
}
