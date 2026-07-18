import type { IconName } from '@/types/types';

export const ERROR_MESSAGES_CONFIG = {
  auth: {
    code: 401,
    header: 'Access denied',
    message:
      "You don't have permission to view this page. Please log in and try again.",
  },
  route: {
    code: 404,
    header: 'Page not found',
    message:
      "The page you're looking for doesn't exist or may have been moved.",
  },
  server: {
    code: 500,
    header: 'Something went wrong',
    message: "We're having trouble loading this page. Please try again later.",
  },
} as const;

export const BUTTON_CONFIG = {
  color: {
    black: `border-slate-900 bg-slate-900 hover:border-slate-800
    hover:bg-slate-800 dark:border-blue-600 dark:bg-blue-600
    dark:hover:border-blue-500 dark:hover:bg-blue-500`,
    blue: `border-blue-600 text-slate-100 bg-blue-600
    hover:border-blue-700 hover:bg-blue-700
    dark:bg-blue-800 dark:border-blue-800 dark:hover:bg-blue-900 dark:hover:border-blue-900`,
    red: `border-red-600 bg-red-600 text-slate-100
    hover:bg-red-700 hover:border-red-700
    dark:bg-red-700 dark:border-red-700 dark:hover:bg-red-800 dark:hover:border-red-800`,
    transparent: `text-slate-600 border-transparent dark:text-slate-400`,
    outline: `border-slate-600 text-slate-600 dark:border-slate-400
    hover:bg-slate-100 dark:text-slate-400
    focus-visible:border-transparent dark:hover:bg-slate-800`,
  },
  size: {
    xs: 'outline-round-sm px-3 py-1 text-sm',
    sm: 'outline-round-sm px-3 py-1.5',
    md: 'outline-round-sm px-3 py-2',
    lg: 'outline-round-md px-3.5 py-2.5',
  },
} as const;

export const MODAL_CONFIG = {
  header: {
    create: {
      icon: 'plus',
      iconColor: 'text-blue-500',
      button:
        'border border-blue-500 text-blue-500 bg-blue-100 dark:bg-blue-500/10',
      iconBgColor: 'bg-blue-100 dark:bg-blue-500/20',
      header: 'Add new',
      infoText: 'Enter an income or expense record',
    },
    copy: {
      icon: 'copy',
      iconColor: 'text-blue-500',
      button:
        'border border-blue-500 text-blue-500 bg-blue-100 dark:bg-blue-500/10',
      iconBgColor: 'bg-blue-100 dark:bg-blue-500/20',
      header: 'Duplicate',
      infoText: 'Create a copy of this item to reuse its details',
    },
    edit: {
      icon: 'refresh',
      iconColor: 'text-blue-500',
      button:
        'border border-blue-500 text-blue-500 bg-blue-100 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-500/20',
      header: 'Edit',
      infoText: 'Update what happened with this transaction',
    },
    editStatus: {
      icon: 'refresh',
      iconColor: 'text-blue-500',
      button:
        'border border-blue-500 text-blue-500 bg-blue-100 dark:bg-blue-500/10 dark:border-blue-400 dark:text-blue-400',
      iconBgColor: 'bg-blue-100 dark:bg-blue-500/20',
      header: 'Change status',
      infoText: 'Update what happened with this transaction',
    },
    editCategory: {
      icon: 'tag',
      iconColor: 'text-purple-500',
      button:
        'border border-purple-500 text-purple-500 bg-purple-100 dark:bg-purple-500/10 dark:border-purple-400 dark:text-purple-400',
      iconBgColor: 'bg-purple-200 dark:bg-purple-500/20',
      header: 'Change category',
      infoText: 'Re-categorize what these transactions are for',
    },
    delete: {
      icon: 'delete',
      iconColor: 'text-red-500',
      button:
        'border border-red-500 text-red-500 bg-red-100 dark:bg-red-500/10 dark:border-red-400 dark:text-red-400',
      iconBgColor: 'bg-red-200 dark:bg-red-500/10',
      header: 'Delete',
      infoText: 'This action cannot be undone',
    },
  },
  footer: {
    create: {
      infoColor: 'text-slate-600',
      infoIcon: 'info',
      infoText: 'Fields marked * are required',
      buttonIcon: 'plus',
      buttonColor: 'blue',
      buttonText: 'Create',
    },
    copy: {
      infoColor: 'text-slate-600',
      infoIcon: 'info',
      infoText: 'The original item is not changed',
      buttonIcon: 'copy',
      buttonColor: 'blue',
      buttonText: 'Create copy',
    },
    edit: {
      infoColor: 'text-slate-500',
      infoIcon: 'undo',
      infoText: 'Editable from history',
      buttonIcon: 'check',
      buttonColor: 'blue',
      buttonText: 'Save changes',
    },
    delete: {
      infoColor: 'text-red-600',
      infoIcon: 'error',
      infoText: 'Cannot be undone',
      buttonIcon: 'delete',
      buttonColor: 'red',
      buttonText: 'Delete',
    },
  },
} as const;

export const INPUT_CONFIG = {
  padding: {
    xs: 'py-1',
    sm: 'py-1.5',
    md: 'py-2',
    lg: 'py-2.5',
  },
  border: {
    default: 'border-slate-300 dark:border-slate-500',
    error: 'border-red-300 dark:border-red-400',
    disabled: 'border-slate-200 dark:border-slate-500',
  },
  icon: {
    padding: {
      xs: 'pl-8',
      sm: 'pl-8',
      md: 'pl-8',
      lg: 'pl-10',
    },
    position: {
      xs: 'bottom-2 left-2',
      sm: 'bottom-2 left-2',
      md: 'bottom-2.5 left-2',
      lg: 'bottom-3.5 left-3',
    },
  },
  button: {
    position: {
      xs: 'bottom-2',
      sm: 'bottom-2',
      md: 'bottom-2.5',
      lg: 'bottom-3.5',
    },
    roleIcon: {
      clear: 'close',
      showPassword: 'hide',
      hidePassword: 'show',
      increaseValue: 'chevron-up',
      decreaseValue: 'chevron-down',
    },
  },
} as const;

export const SELECT_CONFIG = {
  padding: { xs: 'py-1', sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' },
  variant: {
    primary:
      'border-slate-300 dark:border-slate-500 dark:bg-slate-800 text-slate-700',
    secondary:
      'border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-500 dark:bg-slate-800',
  },
} as const;

// Toast Config
export const TOAST_CONFIG = {
  success: {
    header: {
      create: '{x} created',
      edit: 'Changes saved',
      delete: '{x} deleted',
    },
    description: {
      create: '{x} added successfully.',
      edit: '{x} updated successfully.',
      delete: '{x} removed successfully.',
    },
    icon: 'check' as IconName,
    style: {
      icon: 'bg-green-200 text-green-600 dark:bg-green-500/20',
      border: 'border-l-green-500 dark:border-l-green-400',
    },
  },
  error: {
    header: {
      create: 'Failed to create {x}',
      edit: 'Failed to save changes',
      delete: 'Failed to delete {x}',
    },
    description: {
      create: '{x} could not be created.',
      edit: '{x} could not be updated.',
      delete: '{x} could not be deleted.',
    },
    icon: 'close' as IconName,
    style: {
      icon: 'bg-red-200 text-red-600 dark:bg-red-500/20',
      border: 'border-l-red-500 dark:border-l-red-400',
    },
  },
} as const;
