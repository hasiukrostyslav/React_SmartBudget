import clsx from 'clsx';

import CheckBox from '../../controls/CheckBox';
import TransactionsSortList from './TransactionsSortList';

interface TransactionsSortProps {
  isAllSelected: boolean;
  toggleSelectAll: () => void;
}

export default function TransactionsSort({
  isAllSelected,
  toggleSelectAll,
}: TransactionsSortProps) {
  return (
    <div
      className={clsx(
        'col-span-full mb-4 grid grid-cols-subgrid items-center px-2',
      )}
    >
      <CheckBox name="all" checked={isAllSelected} onChange={toggleSelectAll} />

      <TransactionsSortList />
    </div>
  );
}
