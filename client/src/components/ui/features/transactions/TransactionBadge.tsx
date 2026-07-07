import clsx from 'clsx';

import type { IconName } from '@/types/types';

import type { TransactionCategories } from '@/lib/constants/enums';
import { TRANSACTION_CATEGORIES_CONFIG } from '@/lib/constants/ui';

import Icon from '../../icons/Icon';

interface TransactionBadgeProps {
  category: TransactionCategories;
  name: string;
}

export default function TransactionBadge({
  category,
  name,
}: TransactionBadgeProps) {
  return (
    <div className="flex gap-2 px-1.5">
      <span
        className={clsx(
          'rounded-full border-2 p-1.5',
          TRANSACTION_CATEGORIES_CONFIG[category].style.badge,
        )}
      >
        <Icon
          name={
            (TRANSACTION_CATEGORIES_CONFIG[category].icon ||
              'banknote') as IconName
          }
          size={18}
        />
      </span>
      <div className="flex items-center">
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
}
