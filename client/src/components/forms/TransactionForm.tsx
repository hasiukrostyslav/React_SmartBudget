import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import type { TransactionItem } from '@/types/types';

import { DEFAULT_CURRENCY } from '@/lib/constants/constants';
import {
  OperationType,
  STATUSES,
  TRANSACTION_CATEGORIES,
} from '@/lib/constants/enums';
import {
  CREATE_TRANSACTION_FIELDS,
  CURRENCY_CONFIG,
  STATUS_CONFIG,
  TRANSACTION_CATEGORIES_CONFIG,
  TRANSACTION_TYPE_CONFIG,
} from '@/lib/constants/transactions';
import { TransactionSchema } from '@/lib/schemas/transaction.schema';
import { useToast } from '@/hooks/useToast';
import { useCreateTransaction } from '@/hooks/useTransactionMutations';

import SegmentedControl from '../ui/controls/SegmentedControl';
import Input from '../ui/inputs/Input';
import TextArea from '../ui/inputs/TextArea';
import ModalFieldLabel from '../ui/modals/ModalFieldLabel';
import ModalFieldRow from '../ui/modals/ModalFieldRow';
import ModalFieldWrapper from '../ui/modals/ModalFieldWrapper';
import ModalFooter from '../ui/modals/ModalFooter';
import ModalHeader from '../ui/modals/ModalHeader';
import DatePicker from '../ui/selects/DatePicker';
import Select from '../ui/selects/Select';

type FormData = z.infer<typeof TransactionSchema>;

type TransactionFormProps = { onClose: () => void } & (
  | { mode: 'create' }
  | { mode: 'edit'; item: TransactionItem }
);

export default function TransactionForm(props: TransactionFormProps) {
  const isEdit = props.mode === 'edit';

  const { toastSuccess, toastError } = useToast();
  const { mutate: createTransaction, isPending } = useCreateTransaction();

  const {
    register,
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm({
    resolver: zodResolver(TransactionSchema),
    defaultValues: isEdit
      ? {
          transactionType: props.item.transactionType,
          transactionName: props.item.transactionName,
          amount: props.item.amount,
          currency: props.item.currency,
          status: props.item.status,
          transactionCategory: props.item.transactionCategory,
          createdAt: props.item.updatedAt, // SHOULD BE change to updatedAt
          paymentMethod: props.item.paymentMethod,
          description: props.item.description ?? '',
        }
      : {
          transactionType: 'Expenses',
          currency: DEFAULT_CURRENCY,
          status: 'COMPLETED',
          createdAt: new Date(),
        },
  });

  function onSubmit(data: FormData) {
    createTransaction(data as TransactionItem, {
      onSuccess: () => {
        props.onClose();
        toastSuccess(OperationType.CREATE, 'Transaction');
      },
      onError: () => toastError(OperationType.CREATE, 'Transaction'),
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex flex-col dark:text-slate-400"
    >
      <ModalHeader
        operationType={isEdit ? OperationType.EDIT : OperationType.CREATE}
        itemType="transaction"
        handleClose={props.onClose}
      />

      <section className="flex flex-col gap-4 px-6 py-4">
        <ModalFieldRow>
          <ModalFieldWrapper>
            <ModalFieldLabel label={CREATE_TRANSACTION_FIELDS.TYPE.label} />
            <Controller
              control={control}
              name={CREATE_TRANSACTION_FIELDS.TYPE.name}
              render={({ field }) => (
                <SegmentedControl
                  options={TRANSACTION_TYPE_CONFIG}
                  selectedValue={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
          </ModalFieldWrapper>
        </ModalFieldRow>

        <ModalFieldRow>
          <ModalFieldWrapper>
            <ModalFieldLabel label={CREATE_TRANSACTION_FIELDS.NAME.label} />
            <Input
              {...register(CREATE_TRANSACTION_FIELDS.NAME.name)}
              padding="md"
              placeholder={CREATE_TRANSACTION_FIELDS.NAME.placeholder}
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
                      contentWidthExpandedTo="min-w-max"
                    />
                  )}
                />
              </div>
            </div>
          </ModalFieldWrapper>
        </ModalFieldRow>

        <ModalFieldRow>
          <ModalFieldWrapper>
            <ModalFieldLabel label={CREATE_TRANSACTION_FIELDS.STATUS.label} />
            <Controller
              control={control}
              name={CREATE_TRANSACTION_FIELDS.STATUS.name}
              render={({ field }) => (
                <Select
                  label={CREATE_TRANSACTION_FIELDS.STATUS.name}
                  options={[...STATUSES].map((status) => ({
                    value: status,
                    label: STATUS_CONFIG[status].text.header,
                    description: STATUS_CONFIG[status].text.description,
                    icon: STATUS_CONFIG[status].icon,
                    color: STATUS_CONFIG[status].style.icon,
                  }))}
                  padding="md"
                  showSelectedOption
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  placeholder={CREATE_TRANSACTION_FIELDS.STATUS.placeholder}
                />
              )}
            />
          </ModalFieldWrapper>

          <ModalFieldWrapper>
            <ModalFieldLabel label={CREATE_TRANSACTION_FIELDS.CATEGORY.label} />
            <Controller
              control={control}
              name={CREATE_TRANSACTION_FIELDS.CATEGORY.name}
              render={({ field }) => (
                <Select
                  label={CREATE_TRANSACTION_FIELDS.CATEGORY.name}
                  options={[...TRANSACTION_CATEGORIES].map((category) => ({
                    value: category,
                    label: TRANSACTION_CATEGORIES_CONFIG[category].text.header,
                    description:
                      TRANSACTION_CATEGORIES_CONFIG[category].text.description,
                    icon: TRANSACTION_CATEGORIES_CONFIG[category].icon,
                    color: TRANSACTION_CATEGORIES_CONFIG[category].style.icon,
                  }))}
                  padding="md"
                  showSelectedOption
                  withSearch
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  placeholder={CREATE_TRANSACTION_FIELDS.CATEGORY.placeholder}
                />
              )}
            />
          </ModalFieldWrapper>
        </ModalFieldRow>

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
                  padding="md"
                />
              )}
            />
          </ModalFieldWrapper>

          <ModalFieldWrapper>
            <ModalFieldLabel
              label={CREATE_TRANSACTION_FIELDS.PAYMENT_METHOD.label}
            />
            <Controller
              control={control}
              name={CREATE_TRANSACTION_FIELDS.PAYMENT_METHOD.name}
              render={({ field }) => (
                // Should be fixed in the future!!!
                <Select
                  label={CREATE_TRANSACTION_FIELDS.PAYMENT_METHOD.name}
                  options={['Cash', 'Card'].map((payment) => ({
                    value: payment,
                    label: payment,
                  }))}
                  padding="md"
                  showSelectedOption
                  selectedValue={field.value}
                  onSelect={field.onChange}
                  placeholder={
                    CREATE_TRANSACTION_FIELDS.PAYMENT_METHOD.placeholder
                  }
                />
              )}
            />
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
        operationType={isEdit ? OperationType.EDIT : OperationType.CREATE}
        itemType="transaction"
        isSubmitting={isPending}
        handleClose={props.onClose}
        disabled={isEdit ? !isDirty : !isValid}
      />
    </form>
  );
}
