import { clsx } from 'clsx';

import { INPUT_CONFIG } from '@/lib/constants/ui';

import Icon from '../icons/Icon';

interface InputButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  positionPadding?: keyof typeof INPUT_CONFIG.padding;
  role: keyof typeof INPUT_CONFIG.button.roleIcon;
  inRange?: boolean;
  iconSize?: number;
}

export default function InputButton({
  onClick,
  role,
  positionPadding,
  inRange,
  iconSize,
}: InputButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'outline-round-sm',
        inRange ? '' : 'absolute right-3',
        positionPadding && INPUT_CONFIG.button.position[positionPadding],
      )}
      onClick={onClick}
    >
      <Icon
        className="text-slate-500"
        size={iconSize ?? 16}
        name={INPUT_CONFIG.button.roleIcon[role]}
      />
    </button>
  );
}
