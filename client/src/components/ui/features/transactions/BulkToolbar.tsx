import clsx from 'clsx';

import type {
  Currency,
  Status,
  TransactionCategories,
  TransactionType,
} from '@/lib/constants/enums';
import { useDialog } from '@/hooks/useDialog';
import { useDeleteManyTransactions } from '@/hooks/useTransactionMutations';

import ButtonIcon from '../../buttons/ButtonIcon';
import ToolbarButton from '../../buttons/ToolbarButton';
import DeleteModal from '../../modals/DeleteModal';
import EditCategoryModal from '../../modals/EditCategoryModal';
import EditStatusModal from '../../modals/EditStatusModal';

interface BulkToolbarProps {
  isShown: boolean;
  selectedNumber: number;
  allSelected: boolean;
  bulkSelect: () => void;
  bulkUnSelect: () => void;
  selectedItems: {
    itemId: string;
    itemName: string;
    status: Status;
    category: TransactionCategories;
    type: TransactionType;
    amount: number;
    currency: Currency;
  }[];
}

export default function BulkToolbar({
  isShown,
  selectedNumber,
  allSelected,
  bulkSelect,
  bulkUnSelect,
  selectedItems,
}: BulkToolbarProps) {
  const {
    isOpen: isOpenEditStatusModal,
    dialogRef: editStatusModalRef,
    handleOpen: openEditStatusModal,
    handleClose: closeEditStatusModal,
  } = useDialog();

  const {
    isOpen: isOpenEditCategoryModal,
    dialogRef: editCategoryModalRef,
    handleOpen: openEditCategoryModal,
    handleClose: closeEditCategoryModal,
  } = useDialog();

  const {
    isOpen: isOpenDeleteModal,
    dialogRef: deleteModalRef,
    handleOpen: openDeleteModal,
    handleClose: closeDeleteModal,
  } = useDialog();

  const { mutateAsync: deleteMany, isPending: isDeleting } =
    useDeleteManyTransactions();

  return (
    <div
      className={clsx(
        'flex items-center rounded-md px-3 py-2.5 text-sm',
        'bg-blue-600 text-slate-100 dark:bg-blue-800/20',
        'absolute top-full left-1/5 translate-y-3',
        !isShown ? 'hidden' : '',
      )}
    >
      <div className="mr-3 flex gap-1 border-r pr-3">
        <span
          className={clsx(
            'grid h-5 min-w-5 place-content-center rounded-md px-2',
            'bg-blue-500',
          )}
        >
          {selectedNumber}
        </span>
        <span>selected</span>
      </div>
      <div className="mr-9 flex items-center justify-center gap-3">
        <ToolbarButton
          iconName="select"
          iconSize={14}
          label="Select all"
          onClick={bulkSelect}
          disabled={allSelected}
        />
        <ToolbarButton
          iconName="refresh"
          iconSize={14}
          label="Change status"
          onClick={openEditStatusModal}
        />
        <ToolbarButton
          iconName="tag"
          iconSize={14}
          label="Change category"
          onClick={openEditCategoryModal}
        />
        <ToolbarButton
          iconName="delete"
          iconSize={14}
          label="Delete"
          onClick={openDeleteModal}
        />
      </div>
      <ButtonIcon
        iconName="close"
        size={14}
        shape="square"
        variant="outline"
        padding="base"
        onClick={bulkUnSelect}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800/10"
      />

      {isOpenEditStatusModal && (
        <EditStatusModal
          ref={editStatusModalRef}
          handleClose={closeEditStatusModal}
          selectedItems={selectedItems.map((el) => ({
            id: el.itemId,
            status: el.status,
          }))}
        />
      )}

      {isOpenEditCategoryModal && (
        <EditCategoryModal
          ref={editCategoryModalRef}
          handleClose={closeEditCategoryModal}
          selectedItems={selectedItems.map((el) => ({
            id: el.itemId,
            category: el.category,
          }))}
        />
      )}

      {isOpenDeleteModal && (
        <DeleteModal
          ref={deleteModalRef}
          itemType="transaction"
          isSubmitting={isDeleting}
          items={selectedItems.map((el) => ({
            id: el.itemId,
            name: el.itemName,
            type: el.type,
            currency: el.currency,
            amount: el.amount,
          }))}
          handleClose={closeDeleteModal}
          handleSubmit={() => deleteMany(selectedItems.map((el) => el.itemId))}
        />
      )}
    </div>
  );
}
