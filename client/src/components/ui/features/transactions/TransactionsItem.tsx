import clsx from 'clsx';

import type { TransactionItem } from '@/types/types';

import CheckBox from '../../controls/CheckBox';
import TransactionAccount from './TransactionAccount';
import TransactionActionButtons from './TransactionActionButtons';
import TransactionAmount from './TransactionAmount';
import TransactionBadge from './TransactionBadge';
import TransactionCategory from './TransactionCategory';
import TransactionDate from './TransactionDate';
import TransactionStatus from './TransactionStatus';

interface TransactionsItemProps {
  item: TransactionItem;
  checked: boolean;
  onToggleSelect: () => void;
}

export default function TransactionsItem({
  item,
  checked,
  onToggleSelect,
}: TransactionsItemProps) {
  // Each value sits in a role="cell" wrapper so the grid reads as a table.
  // The wrappers take the grid slots the components occupied; the last one
  // is still the div that .visible-hide hides until the row is hovered.
  return (
    <div
      role="row"
      className={clsx(
        'col-span-full grid grid-cols-subgrid items-center text-xs',
        'border-t tracking-wide text-slate-800 dark:text-slate-400',
        'border-slate-300 px-2 py-1.5 dark:border-slate-700',
        'visible-hover-show visible-hide hover:bg-green-100 dark:hover:bg-blue-900/50',
        'next-sibling hover:rounded-md',
      )}
    >
      <div role="cell" className="flex">
        <CheckBox
          name={item.transactionName}
          checked={checked}
          onChange={onToggleSelect}
        />
      </div>
      <div role="cell">
        <TransactionBadge
          category={item.transactionCategory}
          name={item.transactionName}
        />
      </div>
      <div role="cell">
        <TransactionCategory category={item.transactionCategory} />
      </div>
      <div role="cell">
        <TransactionAccount paymentMethod={item.paymentMethod} />
      </div>
      <div role="cell">
        <TransactionDate date={item.createdAt} withTime />
      </div>
      <div role="cell">
        <TransactionAmount
          type={item.transactionType}
          amount={item.amount}
          currency={item.currency}
        />
      </div>
      <div role="cell" className="px-1.5">
        {item.description}
      </div>
      <div role="cell">
        <TransactionStatus status={item.status} />
      </div>
      <div role="cell">
        <TransactionActionButtons item={item} />
      </div>
    </div>
  );
}
