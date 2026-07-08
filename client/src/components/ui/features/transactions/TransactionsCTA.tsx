import type { EMPTY_STATE_TEXT } from '@/lib/constants/messages';
import { useModal } from '@/hooks/useModal';

import CreateTransactionForm from '@/components/forms/CreateTransactionForm';

import Button from '../../buttons/Button';
import Icon from '../../icons/Icon';
import Modal from '../../modals/Modal';

interface TransactionsCTAProps {
  buttonSize: 'sm' | 'md' | 'lg';
  iconSize: number;
  configCTA?: typeof EMPTY_STATE_TEXT.transactions.cta;
}

export default function TransactionsCTA({
  buttonSize,
  iconSize,
  configCTA,
}: TransactionsCTAProps) {
  const { dialogRef, isOpen, handleOpen, handleClose } = useModal();

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleOpen}
        className="flex items-center"
        color="blue"
        size={buttonSize}
      >
        <Icon name="plus" size={iconSize} />
        <span>{configCTA?.primaryLabel || 'New Transaction'}</span>
      </Button>
      {configCTA &&
        'secondaryLabel' in configCTA &&
        configCTA.secondaryLabel && (
          <Button color="outline" size="sm">
            {configCTA.secondaryLabel}
          </Button>
        )}
      {isOpen && (
        <Modal ref={dialogRef} className="w-2/5">
          <CreateTransactionForm onClose={handleClose} />
        </Modal>
      )}
    </div>
  );
}
