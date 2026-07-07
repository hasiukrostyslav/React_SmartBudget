import clsx from 'clsx';

import CheckBox from '../../controls/CheckBox';
import TransactionsSortList from './TransactionsSortList';

interface TransactionsSortProps {
  isBulkSelect: boolean;
  toggleBulkSelect: () => void;
}

export default function TransactionsSort({
  isBulkSelect,
  toggleBulkSelect,
}: TransactionsSortProps) {
  return (
    <div
      className={clsx(
        'col-span-full mb-4 grid grid-cols-subgrid items-center px-2',
      )}
    >
      <CheckBox name="all" checked={isBulkSelect} onChange={toggleBulkSelect} />

      <TransactionsSortList />
    </div>
  );
}
