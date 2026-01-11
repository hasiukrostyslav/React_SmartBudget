import { Link } from 'react-router';
import Error from '@/components/ui/Error';
import Logo from '@/components/ui/Logo';
import ThemeButton from '@/components/ui/buttons/ThemeButton';

export default function NotFound() {
  return (
    <section className="relative flex h-screen items-center justify-center">
      <Link to="/">
        <Logo type="lg" className="absolute top-5 left-5 w-48" />
      </Link>
      <Error type="route" />
      <ThemeButton className="absolute right-10 bottom-5" />
    </section>
  );
}
