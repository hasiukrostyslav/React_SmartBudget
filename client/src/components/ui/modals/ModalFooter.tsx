import clsx from 'clsx';

import type { ItemType, IconName } from '@/types/types';

import { BUTTON_CONFIG, MODAL_CONFIG } from '@/lib/constants/ui';

import Button from '../buttons/Button';
import Icon from '../icons/Icon';

interface ModalFooterProps {
  operationType: keyof typeof MODAL_CONFIG.footer;
  itemType: ItemType;
  itemsCount?: number;
  disabled?: boolean;
  isSubmitting: boolean;
  handleClose: () => void;
}

export default function ModalFooter({
  itemsCount,
  itemType,
  disabled,
  isSubmitting,
  operationType,
  handleClose,
}: ModalFooterProps) {
  const footerConfig = MODAL_CONFIG.footer[operationType];

  const submitButtonText =
    operationType !== 'edit'
      ? ` ${itemsCount && itemsCount > 1 ? `${itemsCount} ${itemType}s` : itemType}`
      : '';

  return (
    <footer
      className={clsx(
        'flex items-center justify-between gap-8 rounded-b-md px-6 py-5 text-base',
        'border-t border-slate-300 bg-slate-100',
        'dark:border-slate-600 dark:bg-slate-900',
      )}
    >
      <div className={clsx('flex gap-1', footerConfig.infoColor)}>
        <Icon name={footerConfig.infoIcon as IconName} size={12} />
        <span className="text-xs">{footerConfig.infoText}</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button type="button" color="outline" size="md" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          color={footerConfig.buttonColor as keyof typeof BUTTON_CONFIG.color}
          size="md"
          className="flex items-center gap-1"
          disabled={disabled}
        >
          <Icon
            name={
              (isSubmitting ? 'loader-circle' : footerConfig.buttonIcon) as IconName
            }
            className={isSubmitting ? 'animate-spin' : ''}
            size={16}
          />
          {footerConfig.buttonText + submitButtonText}
        </Button>
      </div>
    </footer>
  );
}
