import clsx from 'clsx';

interface SelectItemProps {
  isSelectExpanded: boolean;
  selectedOption: string | number | undefined;
  bulkLabel: string;
  option: string | number;
  onSelect: (option: string | number) => void;
}

export default function SelectItem({
  isSelectExpanded,
  selectedOption,
  bulkLabel,
  option,
  onSelect,
}: SelectItemProps) {
  return (
    <button
      role="option"
      tabIndex={isSelectExpanded ? 0 : -1}
      aria-selected={selectedOption === option}
      disabled={selectedOption === option}
      onClick={() => onSelect(option)}
      type="button"
      className={clsx(
        'outline-input flex w-full rounded-md px-1.5 py-1',
        'hover:bg-blue-200/50 dark:hover:bg-slate-600/40',
        selectedOption === option ? 'hidden' : '',
      )}
    >
      {typeof option === 'number'
        ? option
        : option === 'all'
          ? `All ${bulkLabel.at(0)?.toUpperCase() + bulkLabel.slice(1)}`
          : option
              .split(' ')
              .map((word) => word.replace(word[0], word[0].toUpperCase()))
              .join(' ')}
    </button>
  );
}
