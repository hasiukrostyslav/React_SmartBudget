interface ModalFieldLabelProps {
  label: string;
  isOptional?: boolean;
}

export default function ModalFieldLabel({
  label,
  isOptional = false,
}: ModalFieldLabelProps) {
  return (
    <h4 className="text-xs text-slate-500 dark:text-slate-400">
      {label.toUpperCase()}{' '}
      {!isOptional && <span className="text-red-500">*</span>}
    </h4>
  );
}
