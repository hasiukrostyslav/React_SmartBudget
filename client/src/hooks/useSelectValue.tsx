import { useState } from 'react';

export function useSelectValue() {
  const [selectedValue, setSelectedValue] = useState<string>('');

  return { selectedValue, setSelectedValue };
}
