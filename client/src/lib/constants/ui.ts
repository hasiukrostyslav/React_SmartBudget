import type { IconName } from '@/types/types';

// Navigation Links
export const navLinks: {
  type: 'main' | 'setting';
  page: string;
  icon: IconName;
}[] = [
  { type: 'main', page: 'dashboard', icon: 'dashboard' },
  { type: 'main', page: 'transactions', icon: 'transfer' },
  { type: 'main', page: 'payments', icon: 'payment' },
  { type: 'main', page: 'cards', icon: 'card' },
  { type: 'main', page: 'savings', icon: 'saving' },
  { type: 'main', page: 'loans', icon: 'percent' },
  { type: 'main', page: 'deposits', icon: 'income' },
  { type: 'setting', page: 'profile', icon: 'user' },
  { type: 'setting', page: 'settings', icon: 'settings' },
];
