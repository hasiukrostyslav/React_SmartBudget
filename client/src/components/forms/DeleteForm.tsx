import clsx from 'clsx';

import type { ItemType, TransactionItem } from '@/types/types';

import { OperationType } from '@/lib/constants/enums';
import { getCurrencySymbol } from '@/lib/utils/currency';
import { calcDeletedBalance, getFormattedAmount } from '@/lib/utils/utils';
import { useToast } from '@/hooks/useToast';

import ModalFooter from '../ui/modals/ModalFooter';
import ModalHeader from '../ui/modals/ModalHeader';

interface DeleteFormProps {
  itemType: ItemType;
  items: TransactionItem[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: () => unknown | Promise<unknown>;
}

export default function DeleteForm({
  itemType,
  items,
  isSubmitting = false,
  onClose,
  onSubmit,
}: DeleteFormProps) {
  const { toastSuccess } = useToast();

  const handleDelete = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await onSubmit();
    onClose();
    toastSuccess(OperationType.DELETE, 'Transaction');
  };

  const balance = calcDeletedBalance(items);

  return (
    <form
      onSubmit={handleDelete}
      className={clsx('flex flex-col dark:text-slate-400')}
    >
      <ModalHeader
        itemsCount={items.length}
        itemType={itemType}
        operationType={OperationType.DELETE}
        onClose={onClose}
      />

      <section className="flex flex-col gap-4 px-6 py-5">
        <div className="text-sm dark:text-slate-300">
          You're about to permanently delete{' '}
          <span className="font-semibold">
            {`${items.length === 1 ? items[0].transactionName : items.length}
            ${itemType}${items.length > 1 ? 's' : ''}`}
          </span>
          . Their amounts will be removed from your account balances and
          category totals.
        </div>
        <div
          className={clsx(
            'flex items-center justify-between rounded-xl border',
            'px-4 py-4 text-sm font-semibold text-red-500',
            'border-red-500 bg-red-100 dark:bg-red-500/10',
          )}
        >
          <span>Total impact on balance</span>
          <div className="flex gap-2 divide-x divide-slate-400">
            {balance.map((item) => {
              const formattedAmount = getFormattedAmount(Math.abs(item.total));

              return (
                <div
                  key={item.currency}
                  className={clsx(
                    'flex gap-0.5 pr-2',
                    item.total < 0
                      ? 'text-green-600'
                      : item.total === 0
                        ? 'text-amber-500'
                        : '',
                  )}
                >
                  <span>
                    {item.total > 0
                      ? '-' + formattedAmount
                      : item.total < 0
                        ? '+' + formattedAmount
                        : formattedAmount}
                  </span>
                  <span>{getCurrencySymbol(item.currency)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ModalFooter
        itemsCount={items.length}
        itemType={itemType}
        disabled={isSubmitting}
        operationType={OperationType.DELETE}
        isSubmitting={isSubmitting}
        onClose={onClose}
      />
    </form>
  );
}
