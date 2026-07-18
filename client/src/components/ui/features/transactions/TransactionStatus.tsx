import clsx from 'clsx';

import type { Status } from '@/lib/constants/enums';
import { STATUS_CONFIG } from '@/lib/constants/transactions';

export default function TransactionStatus({ status }: { status: Status }) {
  return (
    <div
      className={clsx(
        'flex items-baseline gap-1 font-bold',
        STATUS_CONFIG[status].style.text,
      )}
    >
      <span
        className={clsx(
          'h-2 w-2 rounded-full border-4',
          STATUS_CONFIG[status].style.radio,
        )}
      ></span>
      <h4>{status.at(0) + status.slice(1).toLowerCase()}</h4>
    </div>
  );
}
