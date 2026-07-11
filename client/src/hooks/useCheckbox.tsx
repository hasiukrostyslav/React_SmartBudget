/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router';

export function useCheckbox(ids: string[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [searchParams] = useSearchParams();
  const searchKey = searchParams.toString();

  // reset selection when the filter/query changes
  useEffect(() => setSelectedIds(new Set()), [searchKey]);

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
