// Set border color of Input Component
export function setBorderColor({
  error,
  disabled,
}: {
  error: string | undefined;
  disabled: boolean | undefined;
}) {
  const styles = {
    default: 'border-slate-300 dark:border-slate-400',
    error: 'border-red-300 dark:border-red-400',
    disabled: 'border-slate-200 dark:border-slate-500',
  };
  if (error) return styles.error;
  if (disabled) return styles.disabled;
  return styles.default;
}
