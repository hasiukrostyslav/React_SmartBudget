import React from 'react';

import { clsx } from 'clsx';

import type { IconName } from '@/types/types';

import { SELECT_CONFIG } from '@/lib/constants/components';

import Icon from '../icons/Icon';

interface SelectTriggerProps {
  children: React.ReactNode;
  label: string;
  id: string;
  padding?: keyof typeof SELECT_CONFIG.padding;
  variant?: keyof typeof SELECT_CONFIG.variant;
  isContentExpanded: boolean;
  groupPosition?: 'start' | 'end';
  disabled?: boolean;
  onClick: () => void;
  ariaHasPopup: 'menu' | 'dialog' | 'grid' | 'listbox' | 'tree';
  iconName?: IconName;
}

export default function SelectTrigger({
  children,
  label,
  id,
  padding = 'sm',
  variant = 'primary',
  isContentExpanded,
  groupPosition,
  disabled,
  onClick,
  ariaHasPopup,
  iconName,
}: SelectTriggerProps) {
  return (
    <button
      id={`select-label-${id}`}
      name={label}
      aria-haspopup={ariaHasPopup}
      aria-controls={`select-control-${id}`}
      aria-expanded={isContentExpanded}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'flex items-center justify-between gap-2 px-2.5 text-sm font-medium',
        'outline-input w-full rounded-md border dark:text-slate-400',
        SELECT_CONFIG.padding[padding],
        groupPosition === 'start' && 'rounded-l-none',
        groupPosition === 'end' && 'rounded-r-none',
        disabled
          ? 'border-slate-300 bg-slate-200/50 text-slate-400 dark:border-slate-500 dark:bg-slate-600'
          : SELECT_CONFIG.variant[variant],
      )}
    >
      <div className="flex items-center gap-2">
        {iconName && (
          <Icon name={iconName} size={16} className="text-slate-500" />
        )}
        {children}
      </div>
      <Icon
        size={16}
        name="chevron-down"
        className={clsx(
          'transform transition-transform duration-400 ease-in-out',
          isContentExpanded ? 'rotate-180' : 'rotate-0',
        )}
      />
    </button>
  );
}
