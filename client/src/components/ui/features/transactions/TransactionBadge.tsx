import clsx from 'clsx';

import type { IconName } from '@/types/types';

import type { TransactionCategories } from '@/lib/constants/enums';
import { TRANSACTION_CATEGORIES_CONFIG } from '@/lib/constants/transactions';

import Icon from '../../icons/Icon';

interface TransactionBadgeProps {
  category: TransactionCategories;
  name: string;
  children?: React.ReactNode;
}

export default function TransactionBadge({
  category,
  name,
  children,
}: TransactionBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-1.5">
      <span
        className={clsx(
          'rounded-md',
          children ? 'p-2.5' : 'p-1.5',
          TRANSACTION_CATEGORIES_CONFIG[category].style.badge,
        )}
      >
        <Icon
          name={
            (TRANSACTION_CATEGORIES_CONFIG[category].icon ||
              'banknote') as IconName
          }
          size={children ? 22 : 18}
        />
      </span>
      <div className="flex flex-col gap-1">
        <span className={clsx('font-medium', children ? 'ml-1.5 text-sm' : '')}>
          {name}
        </span>
        {children}
      </div>
    </div>
  );
}
