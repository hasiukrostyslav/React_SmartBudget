import { useEffect, useId, useRef, useState } from 'react';

export function useSelectDropdown(onSelect?: (value: string | number) => void) {
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Close by click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsContentExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape inside an open dropdown closes only the dropdown. The listener sits
  // on the select itself, below any <dialog>, so it runs before the dialog's
  // own Escape handler and can stop the key there. On document it ran last,
  // after the dialog had already closed and thrown away its form.
  useEffect(() => {
    const select = selectRef.current;
    if (!isContentExpanded || !select) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      e.preventDefault(); // also suppresses the native dialog "cancel"
      e.stopPropagation();
      setIsContentExpanded(false);
      select?.querySelector<HTMLButtonElement>('button')?.focus();
    }

    select.addEventListener('keydown', handleKeyDown);
    return () => select.removeEventListener('keydown', handleKeyDown);
  }, [isContentExpanded]);

  // Escape with focus elsewhere on the page still closes an open dropdown.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsContentExpanded(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget)) {
      setIsContentExpanded(false);
    }
  };
  const handleSelect = (value: string | number) => {
    setIsContentExpanded(false);

    if (onSelect) onSelect(value);
  };
  const handleToggleExpanded = () =>
    setIsContentExpanded((expanded) => !expanded);
  const handleClose = () => setIsContentExpanded(false);

  return {
    id,
    selectRef,
    isContentExpanded,
    handleBlur,
    handleSelect,
    handleToggleExpanded,
    handleClose,
  };
}
