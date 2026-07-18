import clsx from 'clsx';

import type { IconName } from '@/types/types';

import { OperationType, STATUSES, type Status } from '@/lib/constants/enums';

import { useSelectValue } from '@/hooks/useSelectValue';
import { useToast } from '@/hooks/useToast';
import { useChangeTransactionStatus } from '@/hooks/useTransactionMutations';

import RadioCard from '../ui/controls/RadioCard';
import ModalFieldLabel from '../ui/modals/ModalFieldLabel';
import ModalFieldWrapper from '../ui/modals/ModalFieldWrapper';
import ModalFooter from '../ui/modals/ModalFooter';
import ModalHeader from '../ui/modals/ModalHeader';
import { STATUS_CONFIG } from '@/lib/constants/transactions';

interface EditItemStatusFormProps {
  onClose: () => void;
  selectedItems: {
    id: string;
    status: Status;
  }[];
}

export default function EditItemStatusForm({
  onClose,
  selectedItems,
}: EditItemStatusFormProps) {
  const { selectedValue, handleSelect } = useSelectValue();
  const { toastSuccess } = useToast();
  const { mutateAsync: changeStatus, isPending } = useChangeTransactionStatus();

  const initialValue = [...new Set(selectedItems.map((el) => el.status))];

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await changeStatus({
      ids: selectedItems.map((el) => el.id),
      status: selectedValue as Status,
    });

    onClose();
    toastSuccess(OperationType.EDIT, 'Transaction');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('flex min-w-84 flex-col dark:text-slate-400')}
    >
      <ModalHeader
        operationType="editStatus"
        itemType="transaction"
        handleClose={onClose}
      />

      <section className="px-6 py-5">
        <p className="mb-4">
          Update the {selectedItems.length} transaction's status to reflect its
          current state. Changes will appear in the transaction history and
          related records.
        </p>

        <ModalFieldWrapper>
          <ModalFieldLabel label="New status" />
          <div className="flex flex-col gap-3">
            {STATUSES.map((status) => {
              const item = STATUS_CONFIG[status];

              return (
                <RadioCard
                  key={status}
                  option={status}
                  selectedValue={selectedValue}
                  onSelect={handleSelect}
                  iconName={item.icon as IconName}
                  text={item.text}
                  styleConfig={item.style}
                  isCurrent={
                    initialValue.length === 1 && initialValue[0] === status
                  }
                />
              );
            })}
          </div>
        </ModalFieldWrapper>
      </section>

      <ModalFooter
        operationType={OperationType.EDIT}
        itemType="transaction"
        disabled={
          isPending ||
          !selectedValue ||
          (initialValue.length === 1 && initialValue[0] === selectedValue)
        }
        isSubmitting={isPending}
        handleClose={onClose}
      />
    </form>
  );
}
