import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TransactionItem } from '@/types/types';

import { OperationType } from '@/lib/constants/enums';
import {
  CREATE_TRANSACTION_FIELDS,
  CURRENCY_CONFIG,
} from '@/lib/constants/transactions';
import { CopyTransactionSchema } from '@/lib/schemas/transaction.schema';
import { useToast } from '@/hooks/useToast';
import { useCreateTransaction } from '@/hooks/useTransactionMutations';

import TransactionAmount from '../ui/features/transactions/TransactionAmount';
import TransactionBadge from '../ui/features/transactions/TransactionBadge';
import TransactionCategory from '../ui/features/transactions/TransactionCategory';
import TransactionDate from '../ui/features/transactions/TransactionDate';
import TransactionStatus from '../ui/features/transactions/TransactionStatus';
import Icon from '../ui/icons/Icon';
import Input from '../ui/inputs/Input';
import TextArea from '../ui/inputs/TextArea';
import ModalFieldLabel from '../ui/modals/ModalFieldLabel';
import ModalFieldRow from '../ui/modals/ModalFieldRow';
import ModalFieldWrapper from '../ui/modals/ModalFieldWrapper';
import ModalFooter from '../ui/modals/ModalFooter';
import ModalHeader from '../ui/modals/ModalHeader';
import DatePicker from '../ui/selects/DatePicker';
import Select from '../ui/selects/Select';

type FormData = z.infer<typeof CopyTransactionSchema>;

interface CopyTransactionFormProps {
  sourceTransaction: TransactionItem;
  onClose: () => void;
}

export default function CopyTransactionForm({
  sourceTransaction,
  onClose,
}: CopyTransactionFormProps) {
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { toastSuccess, toastError } = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(CopyTransactionSchema),
    defaultValues: {
      createdAt: new Date(),
      amount: sourceTransaction.amount,
      currency: sourceTransaction.currency,
      description: sourceTransaction.description ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    createTransaction(
      {
        ...data,
        transactionName: sourceTransaction.transactionName,
        transactionType: sourceTransaction.transactionType,
        transactionCategory: sourceTransaction.transactionCategory,
        paymentMethod: sourceTransaction.paymentMethod,
        status: sourceTransaction.status,
      } as TransactionItem,
      {
        onSuccess: () => {
          onClose();
          toastSuccess(OperationType.CREATE, 'Transaction');
        },
        onError: () => toastError(OperationType.CREATE, 'Transaction'),
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex flex-col dark:text-slate-400"
    >
      <ModalHeader
        operationType={OperationType.COPY}
        itemType="transaction"
        handleClose={onClose}
      />
      <section className="mx-6 my-4">
        <ModalFieldWrapper>
          <ModalFieldLabel label="Copying from" isOptional />
          <section
            className={clsx(
              'flex items-center justify-between rounded-md border px-2 py-4',
              'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-900',
            )}
          >
            <div>
              <TransactionBadge
                name={sourceTransaction.transactionName}
                category={sourceTransaction.transactionCategory}
              >
                <div className="flex items-center gap-2">
                  <TransactionCategory
                    category={sourceTransaction.transactionCategory}
                  />
                  <TransactionStatus status={sourceTransaction.status} />
                </div>
              </TransactionBadge>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-base font-bold">
                <TransactionAmount
                  type={sourceTransaction.transactionType}
                  amount={sourceTransaction.amount}
                  currency={sourceTransaction.currency}
                />
              </div>
              <TransactionDate
                date={sourceTransaction.createdAt}
                withTime={false}
              />
            </div>
          </section>
        </ModalFieldWrapper>
      </section>

      <div className="flex items-center gap-4 px-6">
        <div className="flex-1 border border-slate-200 dark:border-slate-600"></div>
        <div
          className={clsx(
            'flex flex-1 items-center gap-1 rounded-md px-2 py-1',
            'border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-900',
          )}
        >
          <Icon name="copy" size={12} className="text-blue-500" />
          Creates a copy below
        </div>
        <div className="flex-1 border border-slate-200 dark:border-slate-600"></div>
      </div>

      <section className="flex flex-col gap-4 px-6 py-4">
        <ModalFieldRow>
          <ModalFieldWrapper>
            <ModalFieldLabel label={CREATE_TRANSACTION_FIELDS.DATE.label} />
            <Controller
              control={control}
              name={CREATE_TRANSACTION_FIELDS.DATE.name}
              render={({ field }) => (
                <DatePicker
                  label={CREATE_TRANSACTION_FIELDS.DATE.label}
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  showSelectedOption
                  contentWidthExpandedTo="w-76"
                  padding="md"
                />
              )}
            />
          </ModalFieldWrapper>

          <ModalFieldWrapper>
            <ModalFieldLabel
              label={`${CREATE_TRANSACTION_FIELDS.AMOUNT.label} & ${CREATE_TRANSACTION_FIELDS.CURRENCY.label}`}
            />
            <div className="flex items-center">
              <div className="flex-2">
                <Input
                  {...register(CREATE_TRANSACTION_FIELDS.AMOUNT.name)}
                  padding="md"
                  type="number"
                  step="any"
                  placeholder={CREATE_TRANSACTION_FIELDS.AMOUNT.placeholder}
                  groupPosition="end"
                />
              </div>
              <div className="flex-1">
                <Controller
                  control={control}
                  name={CREATE_TRANSACTION_FIELDS.CURRENCY.name}
                  render={({ field }) => (
                    <Select
                      label={CREATE_TRANSACTION_FIELDS.CURRENCY.name}
                      options={CURRENCY_CONFIG.map((el) => ({
                        value: el.currency,
                        label: el.currency,
                        description: el.description,
                      }))}
                      padding="md"
                      showSelectedOption
                      selectedValue={field.value}
                      onSelect={field.onChange}
                      groupPosition="start"
                      contentExpandedAlign="right"
                      contentPosition="top"
                      contentWidthExpandedTo="min-w-max"
                    />
                  )}
                />
              </div>
            </div>
          </ModalFieldWrapper>
        </ModalFieldRow>

        <ModalFieldWrapper>
          <ModalFieldLabel
            label={CREATE_TRANSACTION_FIELDS.DESCRIPTION.label}
            isOptional
          />
          <TextArea
            {...register(CREATE_TRANSACTION_FIELDS.DESCRIPTION.name)}
            placeholder={CREATE_TRANSACTION_FIELDS.DESCRIPTION.placeholder}
          />
        </ModalFieldWrapper>
      </section>

      <ModalFooter
        operationType={OperationType.COPY}
        itemType="transaction"
        isSubmitting={isPending}
        handleClose={onClose}
        disabled={!isValid}
      />
    </form>
  );
}
