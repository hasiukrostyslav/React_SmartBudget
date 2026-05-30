interface SelectDisplayProps {
  selectedOption: string | number | undefined;
  bulkLabel: string;
  placeholder?: string;
}

export default function SelectDisplay({
  selectedOption,
  bulkLabel,
  placeholder,
}: SelectDisplayProps) {
  if (placeholder && !selectedOption) {
    return (
      <span className="text-slate-300 dark:text-slate-700">{placeholder}</span>
    );
  }

  if (!selectedOption) return null;

  let renderOption;
  if (typeof selectedOption === 'number') {
    renderOption = selectedOption;
  } else if (selectedOption === 'all') {
    renderOption = `All ${bulkLabel.at(0)?.toUpperCase() + bulkLabel.slice(1)}`;
  } else {
    renderOption = selectedOption
      .split(' ')
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join(' ');
  }

  return <span>{renderOption}</span>;
}
