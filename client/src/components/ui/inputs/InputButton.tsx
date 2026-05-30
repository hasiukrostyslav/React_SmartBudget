import { clsx } from 'clsx';

import { INPUT_CONFIG } from '@/lib/constants/ui';

import Icon from '../icons/Icon';

interface InputButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  positionPadding: keyof typeof INPUT_CONFIG.padding;
  role: keyof typeof INPUT_CONFIG.button.roleIcon;
}

export default function InputButton({
  onClick,
  role,
  positionPadding,
}: InputButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'outline-round-sm absolute right-3',
        INPUT_CONFIG.button.position[positionPadding],
      )}
      onClick={onClick}
    >
      <Icon
        className="text-slate-500"
        size={16}
        name={INPUT_CONFIG.button.roleIcon[role]}
      />
    </button>
  );
}
