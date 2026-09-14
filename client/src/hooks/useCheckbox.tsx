import { useState } from 'react';

import { useSearchParams } from 'react-router';

export function useCheckbox(ids: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchParams] = useSearchParams();
  const searchKey = searchParams.toString();
  const [prevSearchKey, setPrevSearchKey] = useState(searchKey);

  // A new filter, sort or page shows different rows, so drop the selection.
  // Adjusted during render rather than in an effect, so the stale selection
  // is never painted.
  if (searchKey !== prevSearchKey) {
    setPrevSearchKey(searchKey);
    setSelectedIds(new Set());
  }

  const isAllSelected = ids.length > 0 && ids.length === selectedIds.size;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const deselectAll = () => setSelectedIds(new Set());
  const selectAll = () => setSelectedIds(new Set(ids));
  const toggleSelectAll = () => (isAllSelected ? deselectAll() : selectAll());

  return {
    selectedIds,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    selectAll,
    deselectAll,
  };
}
