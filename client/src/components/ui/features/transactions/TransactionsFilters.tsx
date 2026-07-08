import SearchForm from '@/components/forms/SearchForm';

export default function TransactionsFilters() {
  return (
    <>
      <SearchForm inputPadding="sm" placeholder="Search Transaction..." />

      <div className="ml-2 flex items-center gap-2">
        {/* <Select
          label="categories"
          param="categories"
          options={TRANSACTION_CATEGORIES.map((el) => el.replace('_', ' '))}
          width="lg"
        />
        <Select label="accounts" param="accounts" options={[]} />
        <Select
          label="types"
          param="types"
          options={TRANSACTION_TYPE_CONFIG.map((c) => c.option)}
        />
        <Select
          label="currency"
          param="currency"
          options={CURRENCY.map((c) => c.currency)}
        /> */}
      </div>
    </>
  );
}
