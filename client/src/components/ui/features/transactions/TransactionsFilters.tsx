import { TRANSACTION_CATEGORIES } from '@/lib/constants/enums';
import { currency, transactionTypes } from '@/lib/constants/ui';

import SearchForm from '@/components/forms/SearchForm';

import Select from '../../selects/Select';
import TransactionsCTA from './TransactionsCTA';

export default function TransactionsFilters() {
  return (
    <div className="flex items-center gap-4 px-1">
      <SearchForm inputPadding="sm" placeholder="Search Transaction..." />

      <div className="ml-2 flex items-center gap-2">
        <Select
          name="categories"
          data={TRANSACTION_CATEGORIES.map((el) => el.replace('_', ' '))}
          autoFetchOnChange
          defaultOption="all"
          width="lg"
        />
        <Select
          name="accounts"
          data={[]}
          autoFetchOnChange
          defaultOption="all"
        />
        <Select
          name="types"
          data={transactionTypes.map((c) => c.name)}
          autoFetchOnChange
          defaultOption="all"
        />
        <Select
          name="currency"
          data={currency.map((c) => c.currency)}
          autoFetchOnChange
          defaultOption="all"
        />
      </div>

      <div className="ml-auto flex items-center gap-4">
        <TransactionsCTA buttonSize="md" iconSize={16} />
      </div>
    </div>
  );
}
