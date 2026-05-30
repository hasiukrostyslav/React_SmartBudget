import { useEffect, useId, useRef, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { createQueryString } from '@/lib/utils/utils';

interface useSelectProps {
  defaultOption: string | number | undefined;
  param: string;
  autoFetchOnChange?: boolean;
  onSelectValue?: (value: string | number) => void;
}

export function useSelect({
  defaultOption,
  param,
  autoFetchOnChange,
  onSelectValue,
}: useSelectProps) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isExpanded, setIsExpanded] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Close by click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close by click Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsExpanded(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (option: string | number) => {
    setSelectedOption(option);
    setIsExpanded(false);

    if (onSelectValue) onSelectValue(option);

    // Make new request if autoFetchOnChange is true
    if (autoFetchOnChange) {
      const newSearchString = createQueryString(searchParams, [
        { name: param, value: option },
      ]);

      navigate(`${location.pathname}?${newSearchString}`, { replace: true });
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!selectRef.current?.contains(e.relatedTarget)) {
      setIsExpanded(false);
    }
  };
  const handleToggleExpanded = () => setIsExpanded(!isExpanded);

  return {
    id,
    selectRef,
    selectedOption,
    isExpanded,
    handleBlur,
    handleSelect,
    handleToggleExpanded,
  };
}
