import { AxiosError } from 'axios';

import { EMPTY_STATE_TEXT } from '@/lib/constants/messages';
import { useTransactions } from '@/hooks/useTransactions';

import TransactionsCTA from '@/components/ui/features/transactions/TransactionsCTA';
import TransactionsList from '@/components/ui/features/transactions/TransactionsList';
import TransactionsToolbar from '@/components/ui/features/transactions/TransactionsToolbar';
import EmptyState from '@/components/ui/feedback/EmptyState';
import Error from '@/components/ui/feedback/Error';
import Spinner from '@/components/ui/feedback/Spinner';
import PaginationTable from '@/components/ui/pagination/PaginationTable';

export default function TransactionsPage() {
  const { transactions, transactionCount, isPending, isFetching, error } =
    useTransactions();

  if (error) {
    const status =
      error instanceof AxiosError ? (error.response?.status ?? 500) : 500;
    return (
      <Error
        type={status === 401 ? 'auth' : status === 404 ? 'route' : 'server'}
      />
    );
  }

  return (
    <section className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
      <TransactionsToolbar />

      <div className="relative">
        {(isPending || isFetching) && (
          <Spinner
            title="Loading your transactions"
            subtitle="Fetching balances and recent activity..."
          />
        )}

        {!isPending &&
          (transactions.length < 1 ? (
            <EmptyState config={EMPTY_STATE_TEXT.transactions}>
              <TransactionsCTA
                buttonSize="sm"
                iconSize={14}
                configCTA={EMPTY_STATE_TEXT.transactions.cta}
              />
            </EmptyState>
          ) : (
            <TransactionsList data={transactions} />
          ))}
      </div>

      {transactionCount > 0 && (
        <PaginationTable totalCount={transactionCount} />
      )}
    </section>
  );
}
