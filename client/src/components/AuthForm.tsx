import Logo from './Logo';
import ThemeButton from './ThemeButton';

interface AuthFormProps {
  children: React.ReactNode;
  heading: string;
}

export default function AuthForm({ children, heading }: AuthFormProps) {
  return (
    <section className="w-5/12 flex items-center justify-center relative">
      <div className=" w-1/2 flex items-center justify-center flex-col gap-2">
        <Logo />
        <h2 className="text-2xl font-bold">{heading}</h2>
        {children}
      </div>
      <ThemeButton className="absolute bottom-5 right-10" />
    </section>
  );
}
