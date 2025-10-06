import type { InputIcons } from '@/types/types';
import { Zoom, type ToastPosition } from 'react-toastify';

export const toastOptions = {
  position: 'top-center' as ToastPosition,
  autoClose: 3000,
  transition: Zoom,
  closeButton: false,
  hideProgressBar: true,
  className: '!bg-transparent !shadow-none !p-0 !m-0 !border-0',
};

// Auth input with icons types
export const inputIcons: InputIcons = {
  name: 'user',
  email: 'mail',
  password: 'lock',
};
