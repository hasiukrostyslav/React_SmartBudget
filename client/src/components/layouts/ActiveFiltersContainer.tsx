import { clsx } from 'clsx';

import { useFilters } from '@/hooks/useFilters';
import { useOverflowList } from '@/hooks/useOverflowList';

import Button from '../ui/buttons/Button';
import ActiveFilter from '../ui/controls/ActiveFilter';
import Icon from '../ui/icons/Icon';

export default function ActiveFiltersContainer() {
  const { filters, clearAll, clearFilter } = useFilters();
  const { containerRef, measureRef, visible, isListExpanded, expandList } =
    useOverflowList({ count: filters.length });

  const hidden = filters.length - visible;
  const shownFilters = isListExpanded ? filters : filters.slice(0, visible);

  if (filters.length === 0) return null;

  return (
    <div
      className={clsx(
        'mt-4 border-t border-slate-300 pt-4 pb-1 dark:border-slate-600',
        'grid grid-cols-[auto_1fr_auto] items-start gap-2',
      )}
    >
      <h4 className="flex h-7 items-center py-1 text-sm text-slate-500">
        ACTIVE
      </h4>
      <div className="relative min-w-0">
        {/* Hidden layer: all chips on one row, used only to measure widths. */}
        <div
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute flex w-max gap-2"
        >
          {filters.map((filter) => (
            <ActiveFilter
              key={filter.key + '=' + filter.value}
              filter={filter}
              onClick={clearFilter}
            />
          ))}
        </div>

        <div
          ref={containerRef}
          className={clsx(
            'flex grow items-center gap-2',
            isListExpanded ? 'flex-wrap' : 'overflow-hidden',
          )}
        >
          {shownFilters.map((filter) => (
            <ActiveFilter
              key={filter.key + '=' + filter.value}
              filter={filter}
              onClick={clearFilter}
            />
          ))}
          {hidden > 0 && (
            <ActiveFilter
              filterCount={hidden}
              isExpanded={isListExpanded}
              onClick={expandList}
            />
          )}
        </div>
      </div>
      <div className="flex h-7 items-center">
        <Button color="transparent" size="xs" onClick={clearAll}>
          <Icon name="delete" size={14} />
          <span>Clear all</span>
          <span>( {filters.length} )</span>
        </Button>
      </div>
    </div>
  );
}
