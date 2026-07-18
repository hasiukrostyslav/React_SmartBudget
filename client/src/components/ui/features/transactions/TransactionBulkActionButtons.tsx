import type { TransactionItem } from '@/types/types';

import { useDeleteManyTransactions } from '@/hooks/useTransactionMutations';

import DeleteForm from '@/components/forms/DeleteForm';
import EditItemStatusForm from '@/components/forms/EditItemStatusForm';
import EditTransactionCategoryForm from '@/components/forms/EditTransactionCategoryForm';

import ToolbarButton from '../../buttons/ToolbarButton';
import ModalTrigger from '../../modals/ModalTrigger';

export default function TransactionBulkActionButtons({
  selectedItems,
  onSuccess,
}: {
  selectedItems: TransactionItem[];
  onSuccess: () => void;
}) {
  const { mutateAsync: deleteMany, isPending: isDeleting } =
    useDeleteManyTransactions();

  return (
    <>
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
            onSuccess={onSuccess}
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
            onSuccess={onSuccess}
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
            onSubmit={async () => {
              await deleteMany(selectedItems.map((el) => el.transactionId));
              onSuccess();
            }}
          />
        )}
      />
    </>
  );
}
