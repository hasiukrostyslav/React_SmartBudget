import clsx from 'clsx';

import DashboardHeading from '../ui/atomic/DashboardHeading';
import Time from '../ui/atomic/Time';
import UserPanel from '../ui/UserPanel';

export default function Header() {
  return (
    <header
      className={clsx(
        'col-start-2 flex items-center border-b px-6 py-3',
        'border-blue-400 bg-slate-100 dark:bg-slate-800',
      )}
    >
      <DashboardHeading />
      <Time />
      <UserPanel />
    </header>
  );
}
