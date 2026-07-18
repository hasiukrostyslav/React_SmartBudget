import { TRANSACTION_SORT_OPTIONS } from '@/lib/constants/transactions';
import { useSort } from '@/hooks/useSort';

import SortButton from '../../buttons/SortButton';

export default function TransactionsSortList() {
  const { sort, order, handleSort } = useSort();

  return (
    <>
      {TRANSACTION_SORT_OPTIONS.map((el) => (
        <SortButton
          key={el.label}
          name={el.name}
          label={el.label}
          isActive={el.label === sort}
          onClick={handleSort}
          order={order}
        />
      ))}
    </>
  );
}
