import Dialog from './Dialog';

interface TransactionModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  handleClose: () => void;
}

export default function TransactionModal({
  ref,
}: TransactionModalProps) {
  return (
    <Dialog ref={ref}>
      <form className="flex flex-col gap-6 text-slate-700 dark:text-slate-50"></form>
    </Dialog>
  );
}
