import { clsx } from 'clsx';

import InputButton from './InputButton';

interface InputRangeButtonsProps {
  increaseValue: () => void;
  decreaseValue: () => void;
}

export default function InputRangeButtons({
  increaseValue,
  decreaseValue,
}: InputRangeButtonsProps) {
  return (
    <div className={clsx('absolute top-0.5 right-1 flex flex-col gap-1')}>
      <InputButton
        role="increaseValue"
        onClick={increaseValue}
        inRange
        iconSize={12}
      />
      <InputButton
        role="decreaseValue"
        onClick={decreaseValue}
        inRange
        iconSize={12}
      />
    </div>
  );
}
