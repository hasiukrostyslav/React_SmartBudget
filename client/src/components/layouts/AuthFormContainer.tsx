import Logo from '../ui/Logo';
import ThemeButton from '../ui/ThemeButton';

interface AuthFormProps {
  children: React.ReactNode;
  heading: string;
}

export default function AuthFormContainer({
  children,
  heading,
}: AuthFormProps) {
  return (
    <section className="relative flex w-5/12 items-center justify-center">
      <div className="flex w-1/2 flex-col items-center justify-center gap-2">
        <Logo />
        <h2 className="text-2xl font-bold tracking-wider">{heading}</h2>
        {children}
      </div>
      <ThemeButton className="absolute right-10 bottom-5" />
    </section>
  );
}
