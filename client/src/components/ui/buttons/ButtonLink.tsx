import clsx from 'clsx';
import { Link } from 'react-router';

import type { IconName } from '@/types/types';

import { BUTTON_CONFIG } from '@/lib/constants/components';

import Icon from '../icons/Icon';

interface ButtonLinkProps {
  href: string;
  children: React.ReactNode;
  disabled?: boolean;
  color: keyof typeof BUTTON_CONFIG.color;
  iconName: IconName;
}

export default function ButtonLink({
  href,
  children,
  disabled,
  color,
  iconName,
}: ButtonLinkProps) {
  return (
    <Link
      className={clsx(
        'outline-round-md flex items-center gap-1.5 rounded-lg border-2 px-4 py-2 text-base',
        disabled ? 'border-slate-400 bg-slate-400' : BUTTON_CONFIG.color[color],
      )}
      to={href}
    >
      <Icon name={iconName} size={18} />
      {children}
    </Link>
  );
}
