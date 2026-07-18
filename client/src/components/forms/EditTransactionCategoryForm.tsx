import clsx from 'clsx';

import type { IconName } from '@/types/types';

import {
  TRANSACTION_CATEGORIES,
  type TransactionCategories,
} from '@/lib/constants/enums';

import { useSearchInput } from '@/hooks/useSearchInput';
import { useSelectValue } from '@/hooks/useSelectValue';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useChangeTransactionCategory } from '@/hooks/useTransactionMutations';

import RadioCard from '../ui/controls/RadioCard';
import EmptySearchResult from '../ui/feedback/EmptySearchResult';
import Input from '../ui/inputs/Input';
import ModalFieldLabel from '../ui/modals/ModalFieldLabel';
import ModalFieldWrapper from '../ui/modals/ModalFieldWrapper';
import ModalFooter from '../ui/modals/ModalFooter';
import ModalHeader from '../ui/modals/ModalHeader';
import { TRANSACTION_CATEGORIES_CONFIG } from '@/lib/constants/transactions';

interface EditTransactionCategoryFormProps {
  onClose: () => void;
  selectedItems: {
    id: string;
    category: TransactionCategories;
  }[];
}

export default function EditTransactionCategoryForm({
  onClose,
  selectedItems,
}: EditTransactionCategoryFormProps) {
  const { theme } = useTheme();
  const { selectedValue, handleSelect } = useSelectValue();
  const { searchQuery, role, onChange, onClear } = useSearchInput();
  const { mutateAsync: changeCategory, isPending } =
    useChangeTransactionCategory();
  const { toastSuccess } = useToast();

  const initialValue = [...new Set(selectedItems.map((el) => el.category))];
  const filteredCategories = TRANSACTION_CATEGORIES.filter((el) =>
    searchQuery.length === 0
      ? el
      : el.replaceAll('_', ' ').includes(searchQuery.trimStart()) ||
        TRANSACTION_CATEGORIES_CONFIG[el].text.description
          .toLowerCase()
          .includes(searchQuery.trimStart()),
  ).toSorted();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await changeCategory({
      ids: selectedItems.map((el) => el.id),
      category: selectedValue as TransactionCategories,
    });

    onClose();
    toastSuccess('edit', 'Transaction');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('flex min-w-84 flex-col dark:text-slate-400')}
    >
      <ModalHeader
        operationType="editCategory"
        itemType="transaction"
        handleClose={onClose}
      />

      <section className="px-6 py-5">
        <p className="mb-4">
          Update the {selectedItems.length} transaction's category to reflect
          its current state. Changes will appear in the transaction history and
          related records.
        </p>

        <ModalFieldWrapper>
          <ModalFieldLabel label="New category" />
          <Input
            name="search"
            placeholder="Search categories..."
            iconName="search"
            padding="md"
            value={searchQuery}
            onChange={onChange}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            trailingButton={{ role, onClick: onClear }}
          />

          <div
            className={clsx(
              'mt-2 grid h-72 grid-cols-2 gap-3 pr-2',
              'scrollbar auto-rows-min overflow-y-auto',
              theme === 'dark' ? 'scrollbar-dark' : '',
              filteredCategories.length === 0 ? 'place-content-center' : '',
            )}
          >
            {filteredCategories.length === 0 ? (
              <EmptySearchResult
                category="category"
                query={searchQuery}
                onClick={onClear}
              />
            ) : (
              filteredCategories.map((category) => {
                const item = TRANSACTION_CATEGORIES_CONFIG[category];

                return (
                  <RadioCard
                    key={category}
                    option={category}
                    selectedValue={selectedValue}
                    onSelect={handleSelect}
                    iconName={item.icon as IconName}
                    text={item.text}
                    styleConfig={item.style}
                    isCurrent={
                      initialValue.length === 1 && initialValue[0] === category
                    }
                  />
                );
              })
            )}
          </div>
        </ModalFieldWrapper>
      </section>

      <ModalFooter
        operationType="edit"
        itemType="transaction"
        disabled={
          isPending ||
          !selectedValue ||
          (initialValue.length === 1 && initialValue[0] === selectedValue)
        }
        isSubmitting={isPending}
        handleClose={onClose}
      />
    </form>
  );
}
