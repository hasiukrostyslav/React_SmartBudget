export default function InputError({
  message,
}: {
  message: string | undefined;
}) {
  return (
    <span className="absolute -bottom-5 text-xs tracking-wide text-red-500">
      {message}
    </span>
  );
}
