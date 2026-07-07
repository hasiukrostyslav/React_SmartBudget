import React from 'react';

import clsx from 'clsx';

interface PopoverPanelProps {
  id: string;
  isContentExpanded: boolean;
  position: 'top' | 'bottom';
  widthExpandedTo?: string;
  expandedAlign?: 'left' | 'right';
  children: React.ReactNode;
}

export default function PopoverPanel({
  id,
  isContentExpanded,
  position,
  widthExpandedTo,
  expandedAlign = 'left',
  children,
}: PopoverPanelProps) {
  return (
    <div
      id={`select-list-${id}`}
      role="listbox"
      inert={!isContentExpanded}
      className={clsx(
        'absolute z-50 text-sm',
        'transition-all duration-400 ease-in',
        isContentExpanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
        widthExpandedTo ?? 'w-full',
        expandedAlign === 'left' ? 'left-0' : 'right-0',
        position === 'top'
          ? 'bottom-[calc(100%+4px)] origin-bottom'
          : 'origin-top translate-y-1',
      )}
    >
      <div
        tabIndex={-1}
        className={clsx(
          'shadow-md',
          'rounded-md border border-slate-300 dark:border-slate-600',
          'bg-slate-50 dark:bg-slate-800 dark:text-slate-400',
        )}
      >
        {children}
      </div>
    </div>
  );
}
