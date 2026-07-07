import SectionWrapper from '@/components/layouts/SectionWrapper';

import TransactionsCTA from './TransactionsCTA';
import TransactionsFilters from './TransactionsFilters';

export default function TransactionsToolbar() {
  return (
    <SectionWrapper>
      <div className="flex items-center gap-4">
        <TransactionsFilters />

        <div className="ml-auto flex items-center gap-4">
          <TransactionsCTA buttonSize="sm" iconSize={16} />
        </div>
      </div>
    </SectionWrapper>
  );
}
