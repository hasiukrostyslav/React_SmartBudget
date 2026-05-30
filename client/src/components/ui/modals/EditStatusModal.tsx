import clsx from 'clsx';

import { type Status, STATUSES } from '@/lib/constants/enums';
import { STATUS_CONFIG } from '@/lib/constants/ui';
import type { IconName } from '@/types/types';
import { useChangeTransactionStatus } from '@/hooks/useTransactionMutations';
import { useSelectValue } from '@/hooks/useSelectValue';

import RadioCard from '../selects/RadioCard';
import Dialog from './Dialog';
import ModalFooter from './ModalFooter';
import ModalHeader from './ModalHeader';

interface EditStatusModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  handleClose: () => void;
  selectedItems: {
    id: string;
    status: Status;
  }[];
}

export default function EditStatusModal({
  ref,
  handleClose,
  selectedItems,
}: EditStatusModalProps) {
  const { selectedValue, setSelectedValue } = useSelectValue();
  const initialValue = [...new Set(selectedItems.map((el) => el.status))];

  const { mutateAsync: changeStatus, isPending } = useChangeTransactionStatus();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await changeStatus({
      ids: selectedItems.map((el) => el.id),
      status: selectedValue as Status,
    });

    handleClose();
  };

  return (
    <Dialog ref={ref} className="max-w-4/12 px-0 py-0">
      <form
        onSubmit={handleSubmit}
        className={clsx('flex min-w-84 flex-col dark:text-slate-400')}
      >
        <ModalHeader
          operationType="editStatus"
          itemType="transaction"
          handleClose={handleClose}
        />

        <section className="px-6 py-5">
          <p className="mb-4">
            Update the {selectedItems.length} transaction's status to reflect
            its current state. Changes will appear in the transaction history
            and related records.
          </p>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs">
              NEW STATUS <span className="text-red-500">*</span>
            </h4>
            <div className="flex flex-col gap-3">
              {STATUSES.map((status) => {
                const item = STATUS_CONFIG[status];

                return (
                  <RadioCard
                    key={status}
                    option={status}
                    selectedValue={selectedValue}
                    handleSelect={setSelectedValue}
                    icon={item.icon as IconName}
                    text={item.text}
                    styleConfig={item.style}
                    isCurrent={
                      initialValue.length === 1 && initialValue[0] === status
                    }
                  />
                );
              })}
            </div>
          </div>
        </section>

        <ModalFooter
          operationType="edit"
          itemType="transaction"
          disabled={
            isPending ||
            !selectedValue ||
            (initialValue.length === 1 && initialValue[0] === selectedValue)
          }
          isSubmitting={isPending}
          handleClose={handleClose}
        />
      </form>
    </Dialog>
  );
}
