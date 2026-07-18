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
  return (
    <div
      className={clsx(
        'col-span-full grid grid-cols-subgrid items-center text-xs',
        'border-t tracking-wide text-slate-800 dark:text-slate-400',
        'border-slate-300 px-2 py-1.5 dark:border-slate-700',
        'visible-hover-show visible-hide hover:bg-green-100 dark:hover:bg-blue-900/50',
        'next-sibling hover:rounded-md',
      )}
    >
      <CheckBox
        name={item.transactionName}
        checked={checked}
        onChange={onToggleSelect}
      />
      <TransactionBadge
        category={item.transactionCategory}
        name={item.transactionName}
      />
      <TransactionCategory category={item.transactionCategory} />
      <TransactionAccount paymentMethod={item.paymentMethod} />
      <TransactionDate date={item.createdAt} withTime />
      <TransactionAmount
        type={item.transactionType}
        amount={item.amount}
        currency={item.currency}
      />
      <div className="px-1.5">{item.description}</div>
      <TransactionStatus status={item.status} />
      <TransactionActionButtons item={item} />
    </div>
  );
}
