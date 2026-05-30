import clsx from 'clsx';

import type { TransactionItem } from '@/types/types';

import CheckBox from '../../inputs/CheckBox';
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
  toggleSelectTransaction: () => void;
}

export default function TransactionsItem({
  item,
  checked,
  toggleSelectTransaction,
}: TransactionsItemProps) {
  const {
    transactionId,
    transactionCategory,
    transactionName,
    transactionType,
    paymentMethod,
    createdAt,
    currency,
    amount,
    description,
    status,
  } = item;

  return (
    <div
      className={clsx(
        'col-span-full grid grid-cols-subgrid items-center text-xs',
        'border-t tracking-wide text-slate-800 dark:text-slate-400',
        'border-slate-300 px-1 py-2 dark:border-slate-700',
        'visible-hover-show visible-hide hover:bg-blue-200 dark:hover:bg-blue-950',
        'next-sibling hover:rounded-md',
      )}
    >
      <CheckBox
        name={transactionName}
        checked={checked}
        onChange={toggleSelectTransaction}
      />
      <TransactionBadge category={transactionCategory} name={transactionName} />
      <TransactionCategory category={transactionCategory} />
      <TransactionAccount paymentMethod={paymentMethod} />
      <TransactionDate date={createdAt} />
      <TransactionAmount
        type={transactionType}
        amount={amount}
        currency={currency}
      />
      <div className="px-1.5">{description}</div>
      <TransactionStatus status={status} />
      <TransactionActionButtons
        item={{
          id: transactionId,
          name: transactionName,
          type: transactionType,
          amount,
          currency,
        }}
      />
    </div>
  );
}
