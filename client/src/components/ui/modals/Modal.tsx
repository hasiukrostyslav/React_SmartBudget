import clsx from 'clsx';

interface ModalProps {
  ref: React.RefObject<HTMLDialogElement | null>;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ ref, children, className }: ModalProps) {
  return (
    <dialog
      ref={ref}
      className={clsx(
        'outline-input top-1/2 left-1/2 -translate-1/2 rounded-xl text-left',
        'overflow-visible bg-slate-50 dark:bg-slate-800',
        'backdrop:bg-slate-400/60 dark:backdrop:bg-slate-700/60',
        `${className}`,
      )}
    >
      {children}
    </dialog>
  );
}
