export default function ModalFieldRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">{children}</div>
  );
}
