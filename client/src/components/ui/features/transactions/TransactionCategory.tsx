import clsx from 'clsx';

import type { TransactionCategories } from '@/lib/constants/enums';
import { TRANSACTION_CATEGORIES_CONFIG } from '@/lib/constants/ui';

interface TransactionCategoryProps {
  category: TransactionCategories;
}

export default function TransactionCategory({
  category,
}: TransactionCategoryProps) {
  return (
    <div>
      <span
        className={clsx(
          'inline-block rounded-xl border-2 px-2.5 py-1',
          TRANSACTION_CATEGORIES_CONFIG[category].style.badge,
        )}
      >
        {TRANSACTION_CATEGORIES_CONFIG[category].text.header}
      </span>
    </div>
  );
}
