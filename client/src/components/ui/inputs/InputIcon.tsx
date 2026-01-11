import type { IconName } from '@/types/types';
import Icon from '../Icon';

export default function InputIcon({ name }: { name: IconName }) {
  return (
    <span className="absolute bottom-3.5 left-3">
      <Icon
        className="text-slate-400 dark:text-slate-400"
        size={18}
        name={name}
      />
    </span>
  );
}
