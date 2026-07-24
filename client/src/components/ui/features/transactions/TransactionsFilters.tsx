import Input from '../../inputs/Input';

export default function TransactionsFilters() {
  return (
    <form>
      <Input
        name="search"
        padding="sm"
        placeholder="Search Transaction..."
        iconName="search"
      />
    </form>
  );
}
