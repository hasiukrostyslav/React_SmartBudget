import { useState } from 'react';
import clsx from 'clsx';
import AnimatedLogo from '../ui/AnimatedLogo';
import Navbar from './Navbar';
import ButtonIcon from '../ui/buttons/ButtonIcon';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'relative row-span-full flex flex-col overflow-hidden px-4 py-2.5',
        'border-r-2 border-blue-400 bg-slate-100 dark:bg-slate-800',
        'transition-[width] duration-1000 ease-in-out',
        isCollapsed ? 'w-18' : 'w-58',
      )}
    >
      <AnimatedLogo isCollapsed={isCollapsed} />
      <Navbar isCollapsed={isCollapsed} />

      <ButtonIcon
        onClick={() => setIsCollapsed(!isCollapsed)}
        iconName="chevrons-left"
        size={24}
        shape="square"
        variant="outline"
        className={clsx(
          'mt-auto self-end rounded-lg',
          'text-blue-400 hover:bg-slate-200 dark:text-blue-200 dark:hover:bg-slate-700',
        )}
        iconClassName={clsx(
          'transform transition-transform duration-500 ease-in-out',
          isCollapsed ? 'rotate-180' : 'rotate-0',
        )}
      />
    </aside>
  );
}
