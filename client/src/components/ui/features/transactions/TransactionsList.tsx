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
    <SectionWrapper>
      <div
        className={clsx(
          'relative grid auto-rows-min gap-x-4',
          'grid-cols-[auto_1fr_1fr_1fr_auto_minmax(6rem,auto)_1fr_auto_auto]',
        )}
      >
        <TransactionsSort
          isAllSelected={isAllSelected}
          onToggleSelectAll={toggleSelectAll}
        />
        <div
          className={clsx(
            'col-span-full grid auto-rows-min grid-cols-subgrid',
            'scrollbar h-50vh h-61vh overflow-x-hidden overflow-y-auto',
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
      </div>
    </SectionWrapper>
  );
}
