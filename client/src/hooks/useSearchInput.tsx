import { useCallback, useEffect, useState } from 'react';

import {
  useLocation,
  useNavigate,
  useNavigationType,
  useSearchParams,
} from 'react-router';

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
  // The query this hook itself last wrote to the URL. Navigation renders as a
  // transition, so newer typing can commit before the write does. When the URL
  // then changes to this value, it must not overwrite the input.
  const [writtenQuery, setWrittenQuery] = useState<string | null>(null);
  const [prevExpanded, setPrevExpanded] = useState(isContentExpanded);
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [prevLocationKey, setPrevLocationKey] = useState(location.key);

  if (isContentExpanded !== prevExpanded) {
    setPrevExpanded(isContentExpanded);
    if (isContentExpanded) setLocalSearchQuery('');
  }

  // The URL changed without typing (Back/Forward, "Clear filters"): show it,
  // unless it's the value this hook just wrote. Any committed change retires
  // the marker, matched or not, so it can only ever skip its own write's sync.
  if (isUpdateSearchParam && urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setWrittenQuery(null);
    if (urlQuery !== writtenQuery) setLocalSearchQuery(urlQuery);
  }

  // Back/Forward always shows that entry's query, even if it's unchanged, and
  // drops typing that wasn't written yet. Otherwise the pending write would
  // land on the entry the user just went back to.
  if (isUpdateSearchParam && location.key !== prevLocationKey) {
    setPrevLocationKey(location.key);
    if (navigationType === 'POP') {
      setWrittenQuery(null);
      setLocalSearchQuery(urlQuery);
    }
  }

  // The input updates on every keystroke, but the URL, and the request it
  // triggers, only once typing pauses. It replaces the history entry instead
  // of pushing one per character.
  useEffect(() => {
    if (!isUpdateSearchParam || localSearchQuery === urlQuery) return;

    const timer = setTimeout(() => {
      setWrittenQuery(localSearchQuery);
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
      setWrittenQuery('');
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
