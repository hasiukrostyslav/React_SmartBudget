import type { EMPTY_STATE_TEXT } from '@/lib/constants/messages';
import { useDialog } from '@/hooks/useDialog';

import Button from '../../buttons/Button';
import Icon from '../../icons/Icon';
import TransactionModal from '../../modals/TransactionModal';

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
  const { dialogRef, isOpen, handleOpen, handleClose } = useDialog();

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
      {isOpen && <TransactionModal ref={dialogRef} handleClose={handleClose} />}
    </div>
  );
}
