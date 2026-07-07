import type { SelectOption } from '@/types/types';

import SelectOptionItem from './SelectOptionItem';

interface SelectValueProps {
  selectedValue?: SelectOption;
  placeholder?: string;
}

export default function SelectValue({
  selectedValue,
  placeholder,
}: SelectValueProps) {
  if (placeholder && !selectedValue) {
    return (
      <span className="text-slate-300 dark:text-slate-700">{placeholder}</span>
    );
  }

  if (!selectedValue) return null;

  return <SelectOptionItem option={selectedValue} context="value" />;
}
