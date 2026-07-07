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

  // Close by click Escape
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
  const handleToggleExpanded = () => setIsContentExpanded(!isContentExpanded);
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
