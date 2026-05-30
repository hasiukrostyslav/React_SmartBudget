import clsx from 'clsx';

import type { DeleteItem, ItemType } from '@/types/types';

import { calcDeletedBalance, getFormattedAmount } from '@/lib/utils/utils';

import { getCurrencySymbol } from '@/lib/utils/currency';
import Dialog from './Dialog';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

interface DeleteModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  itemType: ItemType;
  items: DeleteItem[];
  isSubmitting?: boolean;
  handleClose: () => void;
  handleSubmit: () => unknown | Promise<unknown>;
}

export default function DeleteModal({
  ref,
  itemType,
  items,
  isSubmitting = false,
  handleClose,
  handleSubmit,
}: DeleteModalProps) {
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await handleSubmit();
    handleClose();
  };

  const balance = calcDeletedBalance(items);

  return (
    <Dialog ref={ref} className="max-w-4/12 px-0 py-0">
      <form onSubmit={onSubmit}>
        <ModalHeader
          itemsCount={items.length}
          itemType={itemType}
          operationType="delete"
          handleClose={handleClose}
        />

        <section className="flex flex-col gap-4 px-6 py-5">
          <div className="text-sm dark:text-slate-300">
            You're about to permanently delete{' '}
            <span className="font-semibold">
              {`${items.length === 1 ? items[0].name : items.length}
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
                const formattedAmount = getFormattedAmount(
                  Math.abs(item.total),
                );

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
          operationType="delete"
          isSubmitting={isSubmitting}
          handleClose={handleClose}
        />
      </form>
    </Dialog>
  );
}
