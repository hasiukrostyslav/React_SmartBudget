import type { TransactionItem } from '@/types/types';

import { useDeleteTransaction } from '@/hooks/useTransactionMutations';

import CreateTransactionForm from '@/components/forms/CreateTransactionForm';
import DeleteForm from '@/components/forms/DeleteForm';

import ButtonIcon from '../../buttons/ButtonIcon';
import ModalTrigger from '../../modals/ModalTrigger';

interface TransactionActionButtonsProps {
  item: TransactionItem;
}

export default function TransactionActionButtons({
  item,
}: TransactionActionButtonsProps) {
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
        <ModalTrigger
          renderTrigger={(open) => (
            <ButtonIcon
              iconName="edit"
              shape="square"
              variant="ghost"
              size={14}
              onClick={open}
              tooltipLabel="Edit transaction"
            />
          )}
          renderContent={(close) => <CreateTransactionForm onClose={close} />}
        />

        <ModalTrigger
          renderTrigger={(open) => (
            <ButtonIcon
              iconName="delete"
              shape="square"
              variant="ghost"
              size={14}
              onClick={open}
              tooltipLabel="Delete transaction"
            />
          )}
          renderContent={(close) => (
            <DeleteForm
              onClose={close}
              itemType="transaction"
              items={[item]}
              isSubmitting={isPending}
              onSubmit={() => deleteOne(item.transactionId)}
            />
          )}
        />
      </div>
    </>
  );
}
