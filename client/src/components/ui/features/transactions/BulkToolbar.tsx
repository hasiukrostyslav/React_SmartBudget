import clsx from 'clsx';

import type {
  Currency,
  Status,
  TransactionCategories,
  TransactionType,
} from '@/lib/constants/enums';
import { useModal } from '@/hooks/useModal';
import { useDeleteManyTransactions } from '@/hooks/useTransactionMutations';

import DeleteForm from '@/components/forms/DeleteForm';
import EditItemStatusForm from '@/components/forms/EditItemStatusForm';
import EditTransactionCategoryForm from '@/components/forms/EditTransactionCategoryForm';
import SectionWrapper from '@/components/layouts/SectionWrapper';

import ButtonIcon from '../../buttons/ButtonIcon';
import ToolbarButton from '../../buttons/ToolbarButton';
import Modal from '../../modals/Modal';

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
  } = useModal();

  const {
    isOpen: isOpenEditCategoryModal,
    dialogRef: editCategoryModalRef,
    handleOpen: openEditCategoryModal,
    handleClose: closeEditCategoryModal,
  } = useModal();

  const {
    isOpen: isOpenDeleteModal,
    dialogRef: deleteModalRef,
    handleOpen: openDeleteModal,
    handleClose: closeDeleteModal,
  } = useModal();

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
          onClick={bulkSelect}
          disabled={allSelected}
        />
        <ToolbarButton
          iconName="refresh"
          iconSize={14}
          label="Change status"
          modalCategory="editStatus"
          onClick={openEditStatusModal}
        />
        <ToolbarButton
          iconName="tag"
          iconSize={14}
          label="Change category"
          modalCategory="editCategory"
          onClick={openEditCategoryModal}
        />
        <ToolbarButton
          iconName="delete"
          iconSize={14}
          label="Delete"
          modalCategory="delete"
          onClick={openDeleteModal}
        />
      </div>
      <ButtonIcon
        iconName="close"
        size={14}
        shape="square"
        variant="ghost"
        onClick={bulkUnSelect}
      />

      {isOpenEditStatusModal && (
        <Modal ref={editStatusModalRef} className="w-4/12">
          <EditItemStatusForm
            onClose={closeEditStatusModal}
            selectedItems={selectedItems.map((el) => ({
              id: el.itemId,
              status: el.status,
            }))}
          />
        </Modal>
      )}

      {isOpenEditCategoryModal && (
        <Modal ref={editCategoryModalRef} className="w-5/12">
          <EditTransactionCategoryForm
            onClose={closeEditCategoryModal}
            selectedItems={selectedItems.map((el) => ({
              id: el.itemId,
              category: el.category,
            }))}
          />
        </Modal>
      )}

      {isOpenDeleteModal && (
        <Modal ref={deleteModalRef} className="w-4/12">
          <DeleteForm
            itemType="transaction"
            isSubmitting={isDeleting}
            items={selectedItems.map((el) => ({
              id: el.itemId,
              name: el.itemName,
              type: el.type,
              currency: el.currency,
              amount: el.amount,
            }))}
            onClose={closeDeleteModal}
            onSubmit={() => deleteMany(selectedItems.map((el) => el.itemId))}
          />
        </Modal>
      )}
    </SectionWrapper>
  );
}
