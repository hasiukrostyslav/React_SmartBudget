import clsx from 'clsx';

import type { TransactionItem } from '@/types/types';

import { useCheckbox } from '@/hooks/useCheckbox';
import { useTheme } from '@/hooks/useTheme';

import SectionWrapper from '@/components/layouts/SectionWrapper';

import BulkToolbar from '../../modals/BulkToolbar';
import TransactionBulkActionButtons from './TransactionBulkActionButtons';
import TransactionsItem from './TransactionsItem';
import TransactionsSort from './TransactionsSort';

export default function TransactionsList({
  data,
}: {
  data: TransactionItem[];
}) {
  const {
    selectedIds,
    isAllSelected,
    toggleSelect,
    toggleSelectAll,
    selectAll,
    deselectAll,
  } = useCheckbox(data.map((el) => el.transactionId));
  const { theme } = useTheme();

  return (
    <SectionWrapper className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        role="table"
        aria-label="Transactions"
        className={clsx(
          'relative grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-x-4',
          'grid-cols-[auto_1fr_1fr_1fr_auto_minmax(6rem,auto)_1fr_auto_auto]',
        )}
      >
        <TransactionsSort
          isAllSelected={isAllSelected}
          onToggleSelectAll={toggleSelectAll}
        />
        <div
          role="rowgroup"
          className={clsx(
            'col-span-full grid auto-rows-min grid-cols-subgrid',
            'scrollbar overflow-x-hidden overflow-y-auto',
            theme === 'dark' ? 'scrollbar-dark' : '',
          )}
        >
          {data.map((item) => (
            <TransactionsItem
              key={item.transactionId}
              item={item}
              checked={selectedIds.has(item.transactionId)}
              onToggleSelect={() => toggleSelect(item.transactionId)}
            />
          ))}
        </div>
      </div>
      {/* Outside role="table": a table may only own rows. The toolbar is
          position: fixed, so where it sits in the DOM doesn't move it. */}
      <BulkToolbar
        selectedNumber={selectedIds.size}
        isShown={selectedIds.size > 0}
        isAllSelected={isAllSelected}
        onSelectAll={selectAll}
        onDeselectAll={deselectAll}
      >
        <TransactionBulkActionButtons
          selectedItems={data.filter((item) =>
            selectedIds.has(item.transactionId),
          )}
          onSuccess={deselectAll}
        />
      </BulkToolbar>
      {/* The toolbar appears silently; this tells screen readers it did. */}
      <p role="status" className="sr-only">
        {selectedIds.size > 0 ? `${selectedIds.size} selected` : ''}
      </p>
    </SectionWrapper>
  );
}
