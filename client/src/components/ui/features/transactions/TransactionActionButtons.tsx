import type { DeleteItem } from '@/types/types';

import { useModal } from '@/hooks/useModal';
import { useDeleteTransaction } from '@/hooks/useTransactionMutations';

import DeleteForm from '@/components/forms/DeleteForm';

import ButtonIcon from '../../buttons/ButtonIcon';
import Modal from '../../modals/Modal';

interface TransactionActionButtonsProps {
  item: DeleteItem;
}

export default function TransactionActionButtons({
  item,
}: TransactionActionButtonsProps) {
  const { isOpen, dialogRef, handleOpen, handleClose } = useModal();
  const { mutateAsync: deleteOne, isPending } = useDeleteTransaction();

  return (
    <>
      <div className="flex text-slate-500 dark:text-slate-300">
        <ButtonIcon
          iconName="copy"
          shape="square"
          variant="ghost"
          size={14}
          tooltipLabel="Duplicate transaction"
        />
        <ButtonIcon
          iconName="edit"
          shape="square"
          variant="ghost"
          size={14}
          tooltipLabel="Edit transaction"
        />
        <ButtonIcon
          iconName="delete"
          shape="square"
          variant="ghost"
          size={14}
          onClick={handleOpen}
          tooltipLabel="Delete transaction"
        />
      </div>
      {isOpen && (
        <Modal ref={dialogRef} className="max-w-4/12">
          <DeleteForm
            onClose={handleClose}
            itemType="transaction"
            items={[item]}
            isSubmitting={isPending}
            onSubmit={() => deleteOne(item.id)}
          />
        </Modal>
      )}
    </>
  );
}
