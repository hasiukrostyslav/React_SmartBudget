import { useCallback, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { INPUT_CONFIG } from '@/lib/constants/components';
import { createQueryString } from '@/lib/utils/utils';

interface useSearchInputProps {
  isContentExpanded?: boolean;
  isUpdateSearchParam?: boolean;
}

export function useSearchInput({
  isContentExpanded,
  isUpdateSearchParam,
}: useSearchInputProps) {
  const [searchParams] = useSearchParams();
  const [localSearchQuery, setLocalSearchQuery] = useState(
    searchParams.get('search') ?? '',
  );
  const [prevExpanded, setPrevExpanded] = useState(isContentExpanded);
  const location = useLocation();
  const navigate = useNavigate();

  const searchQuery = isUpdateSearchParam
    ? (searchParams.get('search') ?? '')
    : localSearchQuery;

  if (isContentExpanded !== prevExpanded) {
    setPrevExpanded(isContentExpanded);
    if (isContentExpanded) setLocalSearchQuery('');
  }

  const handleClear = useCallback(() => {
    setLocalSearchQuery('');

    if (isUpdateSearchParam) {
      const newSearchString = createQueryString(searchParams, [
        { param: 'search', value: '' },
      ]);
      navigate(`${location.pathname}?${newSearchString}`, { replace: true });
    }
  }, [isUpdateSearchParam, searchParams, location, navigate]);

  const role: keyof typeof INPUT_CONFIG.button.roleIcon = 'clear';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);

    if (isUpdateSearchParam) {
      const newSearchString = createQueryString(searchParams, [
        { param: 'search', value: e.target.value },
      ]);
      navigate(`${location.pathname}?${newSearchString}`);
    }
  };

  return { searchQuery, role, handleChange, handleClear };
}
