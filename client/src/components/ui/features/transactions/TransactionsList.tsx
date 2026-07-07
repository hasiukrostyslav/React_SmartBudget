import clsx from 'clsx';

import type { TransactionItem } from '@/types/types';

import { useCheckbox } from '@/hooks/useCheckbox';
import { useTheme } from '@/hooks/useTheme';

import SectionWrapper from '@/components/layouts/SectionWrapper';

import BulkToolbar from './BulkToolbar';
import TransactionsItem from './TransactionsItem';
import TransactionsSort from './TransactionsSort';

export default function TransactionsList({
  data,
}: {
  data: TransactionItem[];
}) {
  const {
    selectedItems,
    isBulkSelect,
    toggleSelect,
    toggleBulkSelect,
    bulkSelect,
    bulkUnSelect,
  } = useCheckbox(data);
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
          isBulkSelect={isBulkSelect}
          toggleBulkSelect={toggleBulkSelect}
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
              checked={selectedItems.some(
                (i) => i.itemId === item.transactionId,
              )}
              toggleSelectTransaction={() =>
                toggleSelect(
                  item.transactionId,
                  item.transactionName,
                  item.status,
                  item.transactionCategory,
                  item.transactionType,
                  item.amount,
                  item.currency,
                )
              }
            />
          ))}
        </div>
        <BulkToolbar
          selectedNumber={selectedItems.length}
          isShown={selectedItems.length > 0}
          allSelected={selectedItems.length === data.length && isBulkSelect}
          bulkSelect={bulkSelect}
          bulkUnSelect={bulkUnSelect}
          selectedItems={selectedItems}
        />
      </div>
    </SectionWrapper>
  );
}
