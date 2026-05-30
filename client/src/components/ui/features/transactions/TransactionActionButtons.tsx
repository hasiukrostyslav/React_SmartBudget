import type { DeleteItem } from '@/types/types';

import { useDialog } from '@/hooks/useDialog';
import { useDeleteTransaction } from '@/hooks/useTransactionMutations';

import ButtonIcon from '../../buttons/ButtonIcon';
import DeleteModal from '../../modals/DeleteModal';

interface TransactionActionButtonsProps {
  item: DeleteItem;
}

export default function TransactionActionButtons({
  item,
}: TransactionActionButtonsProps) {
  const { isOpen, dialogRef, handleOpen, handleClose } = useDialog();
  const { mutateAsync: deleteOne, isPending } = useDeleteTransaction();

  return (
    <>
      <div className="flex text-slate-500">
        <ButtonIcon
          iconName="copy"
          shape="square"
          variant="outline"
          size={14}
          className="hover:text-slate-400"
        />
        <ButtonIcon
          iconName="edit"
          shape="square"
          variant="outline"
          size={14}
          className="hover:text-slate-400"
        />
        <ButtonIcon
          iconName="delete"
          shape="square"
          variant="outline"
          size={14}
          className="hover:text-slate-400"
          onClick={handleOpen}
        />
      </div>
      {isOpen && (
        <DeleteModal
          ref={dialogRef}
          handleClose={handleClose}
          itemType="transaction"
          items={[item]}
          isSubmitting={isPending}
          handleSubmit={() => deleteOne(item.id)}
        />
      )}
    </>
  );
}
