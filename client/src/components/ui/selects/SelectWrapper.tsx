import React from 'react';

interface SelectWrapperProps {
  id: string;
  isContentExpanded: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  onBlur: (e: React.FocusEvent) => void;
  children: React.ReactNode;
  ariaHasPopup: 'menu' | 'dialog' | 'grid' | 'listbox' | 'tree';
}

export default function SelectWrapper({
  id,
  isContentExpanded,
  ref,
  onBlur,
  children,
  ariaHasPopup,
}: SelectWrapperProps) {
  return (
    <div
      role="combobox"
      aria-haspopup={ariaHasPopup}
      aria-controls={`select-control-${id}`}
      aria-labelledby={`select-label-${id}`}
      aria-expanded={isContentExpanded}
      ref={ref}
      className="relative"
      onBlur={onBlur}
    >
      {children}
    </div>
  );
}
