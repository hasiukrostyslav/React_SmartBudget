import { useSearchInput } from '@/hooks/useSearchInput';

import Input from '../../inputs/Input';

export default function TransactionsFilters() {
  const { searchQuery, role, handleChange, handleClear } = useSearchInput({
    isUpdateSearchParam: true,
  });

  return (
    <div>
      <Input
        name="search"
        padding="sm"
        placeholder="Search Transaction..."
        iconName="search"
        value={searchQuery}
        onChange={handleChange}
        trailingButton={{ role, onClick: handleClear }}
      />
    </div>
  );
}
