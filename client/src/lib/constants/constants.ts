import { Zoom, type ToastPosition } from 'react-toastify';

// Options for Toast Component
export const toastOptions = {
  position: 'top-center' as ToastPosition,
  autoClose: 3000,
  transition: Zoom,
  closeButton: false,
  hideProgressBar: true,
  className: '!bg-transparent !shadow-none !p-0 !m-0 !border-0',
};

// Salt for password hashing
export const SALT_ROUNDS = 10 as const;

export const DEFAULT_LOCALE = 'ukr' as const;

// Number of the displayed item on pagination filter
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const PAGINATION_RANGE = 5;
