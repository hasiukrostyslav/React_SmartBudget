import { clsx } from 'clsx';

import InputButton from './InputButton';

interface InputRangeButtonsProps {
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function InputRangeButtons({
  onIncrease,
  onDecrease,
}: InputRangeButtonsProps) {
  return (
    <div className={clsx('absolute top-0.5 right-1 flex flex-col gap-1')}>
      <InputButton
        role="increaseValue"
        onClick={onIncrease}
        inRange
        iconSize={12}
      />
      <InputButton
        role="decreaseValue"
        onClick={onDecrease}
        inRange
        iconSize={12}
      />
    </div>
  );
}
