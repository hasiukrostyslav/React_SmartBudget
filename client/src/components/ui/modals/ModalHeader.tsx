import clsx from 'clsx';

import type { IconName, ItemType } from '@/types/types';

import { MODAL_CONFIG } from '@/lib/constants/ui';

import ButtonIcon from '../buttons/ButtonIcon';
import Icon from '../icons/Icon';

interface ModalHeaderProps {
  operationType: keyof typeof MODAL_CONFIG.header;
  itemType: ItemType;
  itemsCount?: number;
  handleClose: () => void;
}

export default function ModalHeader({
  itemsCount,
  itemType,
  operationType,
  handleClose,
}: ModalHeaderProps) {
  const headerConfig = MODAL_CONFIG.header[operationType];

  const headerText = !operationType.startsWith('edit')
    ? ` ${itemsCount && itemsCount > 1 ? `${itemsCount} ${itemType}s` : itemType}`
    : '';

  return (
    <header
      className={clsx(
        'flex items-center gap-3',
        'border-b border-slate-300 px-6 py-4 dark:border-slate-600',
      )}
    >
      <div className={clsx('rounded-md p-2', headerConfig.iconBgColor)}>
        <Icon
          name={headerConfig.icon as IconName}
          size={22}
          className={headerConfig.iconColor}
        />
      </div>
      <div>
        <h2 className="text-lg font-semibold dark:text-slate-300">
          {headerConfig.header + headerText}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {headerConfig.infoText}
        </p>
      </div>
      <ButtonIcon
        iconName="close"
        size={18}
        shape="square"
        variant="ghost"
        className="ml-auto"
        onClick={handleClose}
      />
    </header>
  );
}
