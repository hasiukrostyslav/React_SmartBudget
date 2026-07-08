export default function ModalFieldWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex w-full flex-col gap-2">{children}</div>;
}
