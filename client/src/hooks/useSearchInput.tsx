import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router';

import { INPUT_CONFIG } from '@/lib/constants/components';
import { createQueryString } from '@/lib/utils/utils';

interface useSearchInputProps {
  isContentExpanded?: boolean;
  isUpdateSearchParam?: boolean;
}

// How long typing must pause before the query is written to the URL.
const SEARCH_DEBOUNCE_MS = 300;

export function useSearchInput({
  isContentExpanded,
  isUpdateSearchParam,
}: useSearchInputProps) {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') ?? '';
  const [localSearchQuery, setLocalSearchQuery] = useState(
    isUpdateSearchParam ? urlQuery : '',
  );
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [prevExpanded, setPrevExpanded] = useState(isContentExpanded);
  const location = useLocation();
  const navigate = useNavigate();

  if (isContentExpanded !== prevExpanded) {
    setPrevExpanded(isContentExpanded);
    if (isContentExpanded) setLocalSearchQuery('');
  }

  // The URL changed without typing (Back/Forward, "Clear filters"): show it.
  if (isUpdateSearchParam && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setLocalSearchQuery(urlQuery);
  }

  // The input updates on every keystroke, but the URL, and the request it
  // triggers, only once typing pauses. It replaces the history entry instead
  // of pushing one per character.
  useEffect(() => {
    if (!isUpdateSearchParam || localSearchQuery === urlQuery) return;

    const timer = setTimeout(() => {
      const newSearchString = createQueryString(searchParams, [
        { param: 'search', value: localSearchQuery },
      ]);
      navigate(`${location.pathname}?${newSearchString}`, { replace: true });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [
    isUpdateSearchParam,
    localSearchQuery,
    urlQuery,
    searchParams,
    location.pathname,
    navigate,
  ]);

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
  };

  return { searchQuery: localSearchQuery, role, handleChange, handleClear };
}
