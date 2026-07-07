import { useState } from 'react';

import clsx from 'clsx';

import ButtonIcon from '../ui/buttons/ButtonIcon';
import AnimatedLogo from '../ui/logos/AnimatedLogo';
import Navbar from './Navbar';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'relative row-span-full flex flex-col overflow-hidden border-r px-4 py-2.5',
        'border-blue-400 bg-slate-100 dark:bg-slate-800',
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
        variant="ghost"
        tooltipLabel={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        tooltipSide="right"
        className="mt-auto self-end text-blue-400 dark:text-blue-200"
        iconClassName={clsx(
          'transform transition-transform duration-500 ease-in-out',
          isCollapsed ? 'rotate-180' : 'rotate-0',
        )}
      />
    </aside>
  );
}
