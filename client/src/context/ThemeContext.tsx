import { createContext } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  setLightTheme: () => void;
  setDarkTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
