import Icon from '../Icon';

interface InputButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isPasswordShown?: boolean;
}

export default function InputButton({
  onClick,
  isPasswordShown,
}: InputButtonProps) {
  return (
    <button
      type="button"
      className="outline-round-sm absolute right-3 bottom-3.5"
      onClick={onClick}
    >
      <Icon
        className="text-slate-500 dark:text-slate-400"
        size={16}
        name={isPasswordShown ? 'show' : 'hide'}
      />
    </button>
  );
}
