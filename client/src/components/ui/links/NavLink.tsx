import clsx from 'clsx';
import { NavLink as RouterNavLink } from 'react-router';

import type { IconName } from '@/types/types';

import Icon from '../icons/Icon';

interface NavLinkProps {
  href: string;
  text: string;
  iconName: IconName;
  isCollapsed: boolean;
}

export default function NavLink({
  href,
  text,
  iconName,
  isCollapsed,
}: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        clsx(
          `outline-round-sm flex items-center gap-3`,
          isActive
            ? 'bg-blue-500 text-blue-100 hover:bg-blue-600'
            : 'text-slate-600 hover:bg-slate-200 hover:text-blue-500 dark:text-blue-100 dark:hover:bg-slate-700',
        )
      }
      style={{
        transition: 'padding 0.5s ease-in-out',
        padding: isCollapsed ? '0.5rem' : '0.5rem 1.75rem',
        borderRadius: isCollapsed ? '9999px ' : '1.5rem',
      }}
      to={href}
      end
    >
      <Icon className="shrink-0" name={iconName} size={24} />
      <span
        className={clsx(
          'transition-transform duration-500 ease-out',
          isCollapsed ? 'translate-x-5 delay-500' : 'translate-x-0',
        )}
      >
        {text}
      </span>
    </RouterNavLink>
  );
}
