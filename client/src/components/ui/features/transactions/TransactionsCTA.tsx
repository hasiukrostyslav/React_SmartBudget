import type { EMPTY_STATE_TEXT } from '@/lib/constants/messages';

import CreateTransactionForm from '@/components/forms/CreateTransactionForm';

import Button from '../../buttons/Button';
import Icon from '../../icons/Icon';
import ModalTrigger from '../../modals/ModalTrigger';

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
  return (
    <div className="flex gap-2">
      <ModalTrigger
        modalWidth="lg"
        renderTrigger={(open) => (
          <Button
            onClick={open}
            className="flex items-center"
            color="blue"
            size={buttonSize}
          >
            <Icon name="plus" size={iconSize} />
            <span>{configCTA?.primaryLabel || 'New Transaction'}</span>
          </Button>
        )}
        renderContent={(close) => <CreateTransactionForm onClose={close} />}
      />

      {configCTA &&
        'secondaryLabel' in configCTA &&
        configCTA.secondaryLabel && (
          <Button color="outline" size="sm">
            {configCTA.secondaryLabel}
          </Button>
        )}
    </div>
  );
}
