import clsx from 'clsx';

import type { Status } from '@/lib/constants/enums';
import { STATUS_CONFIG } from '@/lib/constants/ui';

export default function TransactionStatus({ status }: { status: Status }) {
  return (
    <div
      className={clsx(
        'rounded-md border px-2 py-1 text-center',
        STATUS_CONFIG[status].style.badge,
      )}
    >
      {status.at(0) + status.slice(1).toLowerCase()}
    </div>
  );
}
