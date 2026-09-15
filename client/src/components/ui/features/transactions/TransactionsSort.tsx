import clsx from 'clsx';

import CheckBox from '../../controls/CheckBox';
import TransactionsSortList from './TransactionsSortList';

interface TransactionsSortProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
}

export default function TransactionsSort({
  isAllSelected,
  onToggleSelectAll,
}: TransactionsSortProps) {
  return (
    <div
      role="row"
      className={clsx(
        'col-span-full mb-4 grid grid-cols-subgrid items-center px-2',
      )}
    >
      <div role="columnheader" className="flex">
        <CheckBox
          name="all"
          checked={isAllSelected}
          onChange={onToggleSelectAll}
        />
      </div>

      <TransactionsSortList />

      {/* The actions column has no visible heading, but a table needs one. */}
      <div role="columnheader">
        <span className="sr-only">Actions</span>
      </div>
    </div>
  );
}
