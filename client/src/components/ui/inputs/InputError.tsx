export default function InputError({
  id,
  message,
}: {
  id?: string;
  message: string | undefined;
}) {
  // role="alert" makes screen readers announce the message when it appears.
  return (
    <span
      id={id}
      role="alert"
      className="absolute -bottom-5 text-xs tracking-wide text-red-500"
    >
      {message}
    </span>
  );
}
