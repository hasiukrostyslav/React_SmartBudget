import { AxiosError } from 'axios';

import { EMPTY_STATE_TEXT } from '@/lib/constants/messages';
import { useTransactions } from '@/hooks/useTransactions';

import TransactionsCTA from '@/components/ui/features/transactions/TransactionsCTA';
import TransactionsFilters from '@/components/ui/features/transactions/TransactionsFilters';
import TransactionsList from '@/components/ui/features/transactions/TransactionsList';
import EmptyState from '@/components/ui/feedback/EmptyState';
import Error from '@/components/ui/feedback/Error';
import Spinner from '@/components/ui/feedback/Spinner';
import PaginationTable from '@/components/ui/pagination/PaginationTable';

export default function TransactionsPage() {
  const { transactions, transactionCount, isPending, error } =
    useTransactions();

  if (isPending)
    return (
      <Spinner
        title="Loading your transactions"
        subtitle="Fetching balances and recent activity..."
      />
    );

  if (error) {
    const status =
      error instanceof AxiosError ? (error.response?.status ?? 500) : 500;
    return (
      <Error
        type={status === 401 ? 'auth' : status === 404 ? 'route' : 'server'}
      />
    );
  }

  if (transactions.length < 1)
    return (
      <EmptyState config={EMPTY_STATE_TEXT.transactions}>
        <TransactionsCTA
          buttonSize="sm"
          iconSize={14}
          configCTA={EMPTY_STATE_TEXT.transactions.cta}
        />
      </EmptyState>
    );

  return (
    <section className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
      <TransactionsFilters />
      <TransactionsList data={transactions} />
      <PaginationTable totalCount={transactionCount} />
    </section>
  );
}
