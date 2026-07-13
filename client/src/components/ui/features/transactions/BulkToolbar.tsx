import clsx from 'clsx';

import type { TransactionItem } from '@/types/types';

import { useDeleteManyTransactions } from '@/hooks/useTransactionMutations';

import DeleteForm from '@/components/forms/DeleteForm';
import EditItemStatusForm from '@/components/forms/EditItemStatusForm';
import EditTransactionCategoryForm from '@/components/forms/EditTransactionCategoryForm';
import SectionWrapper from '@/components/layouts/SectionWrapper';

import ButtonIcon from '../../buttons/ButtonIcon';
import ToolbarButton from '../../buttons/ToolbarButton';
import ModalTrigger from '../../modals/ModalTrigger';

interface BulkToolbarProps {
  isShown: boolean;
  selectedNumber: number;
  isAllSelected: boolean;
  selectAll: () => void;
  deselectAll: () => void;
  selectedItems: TransactionItem[];
}

export default function BulkToolbar({
  isShown,
  selectedNumber,
  isAllSelected,
  selectAll,
  deselectAll,
  selectedItems,
}: BulkToolbarProps) {
  const { mutateAsync: deleteMany, isPending: isDeleting } =
    useDeleteManyTransactions();

  return (
    <SectionWrapper
      className={clsx(
        'flex items-center text-sm',
        'absolute top-full right-1/5 translate-y-6',
        !isShown ? 'hidden' : '',
      )}
    >
      <div
        className={clsx(
          'mr-2 flex gap-1 bg-blue-300/40 px-4 py-1 pr-3 dark:bg-blue-800/70',
          'rounded-md',
        )}
      >
        <span
          className={clsx(
            'grid h-5 min-w-5 place-content-center rounded-md px-2',
            'bg-blue-500 text-slate-100',
          )}
        >
          {selectedNumber}
        </span>
        <span className="text-blue-700 dark:text-blue-200">selected</span>
      </div>
      <div className="mr-3 flex items-center justify-center gap-3">
        <ToolbarButton
          iconName="select"
          iconSize={14}
          label="Select all"
          onClick={selectAll}
          disabled={isAllSelected}
        />

        <ModalTrigger
          renderTrigger={(open) => (
            <ToolbarButton
              iconName="refresh"
              iconSize={14}
              label="Change status"
              modalCategory="editStatus"
              onClick={open}
            />
          )}
          renderContent={(close) => (
            <EditItemStatusForm
              onClose={close}
              selectedItems={selectedItems.map((el) => ({
                id: el.transactionId,
                status: el.status,
              }))}
            />
          )}
        />
        <ModalTrigger
          modalWidth="lg"
          renderTrigger={(open) => (
            <ToolbarButton
              iconName="tag"
              iconSize={14}
              label="Change category"
              modalCategory="editCategory"
              onClick={open}
            />
          )}
          renderContent={(close) => (
            <EditTransactionCategoryForm
              onClose={close}
              selectedItems={selectedItems.map((el) => ({
                id: el.transactionId,
                category: el.transactionCategory,
              }))}
            />
          )}
        />
        <ModalTrigger
          renderTrigger={(open) => (
            <ToolbarButton
              iconName="delete"
              iconSize={14}
              label="Delete"
              modalCategory="delete"
              onClick={open}
            />
          )}
          renderContent={(close) => (
            <DeleteForm
              itemType="transaction"
              items={selectedItems}
              isSubmitting={isDeleting}
              onClose={close}
              onSubmit={() =>
                deleteMany(selectedItems.map((el) => el.transactionId))
              }
            />
          )}
        />
      </div>
      <ButtonIcon
        iconName="close"
        size={14}
        shape="square"
        variant="ghost"
        onClick={deselectAll}
      />
    </SectionWrapper>
  );
}
