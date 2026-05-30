import { clsx } from 'clsx';

import type { IconName } from '@/types/types';

import { INPUT_CONFIG } from '@/lib/constants/ui';

import Icon from '../icons/Icon';

interface InputIconProps {
  name: IconName;
  padding: keyof typeof INPUT_CONFIG.padding;
}

export default function InputIcon({ name, padding }: InputIconProps) {
  return (
    <span className={clsx('absolute', INPUT_CONFIG.icon.position[padding])}>
      <Icon
        className="text-slate-400 dark:text-slate-500"
        size={padding === 'xs' ? 16 : 18}
        name={name}
      />
    </span>
  );
}
