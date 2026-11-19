import ThemeButton from '../ui/buttons/ThemeButton';

interface AuthFormProps {
  children: React.ReactNode;
  heading: string;
}

export default function AuthFormContainer({
  children,
  heading,
}: AuthFormProps) {
  return (
    <section className="relative flex w-1/2 items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center gap-2">
        <h2 className="text-lg font-medium tracking-wide">{heading}</h2>
        {children}
      </div>
      <ThemeButton className="absolute right-10 bottom-5" />
    </section>
  );
}
