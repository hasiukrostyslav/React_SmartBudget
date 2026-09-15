import { useEffect, useState } from 'react';

import { ThemeContext } from './ThemeContext';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

// A saved choice wins; without one, follow the OS. Read before the first render
// so the initial default can never overwrite what the user picked.
function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Only an explicit choice is saved, so visitors who never pick one keep
  // following their OS setting.
  const chooseTheme = (next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setTheme(next);
  };

  const setLightTheme = () => chooseTheme('light');
  const setDarkTheme = () => chooseTheme('dark');

  return (
    <ThemeContext value={{ theme, setLightTheme, setDarkTheme }}>
      {children}
    </ThemeContext>
  );
}
