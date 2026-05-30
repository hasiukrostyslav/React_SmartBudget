import { Link } from 'react-router';

import ThemeButton from '@/components/ui/buttons/ThemeButton';
import Error from '@/components/ui/feedback/Error';
import Logo from '@/components/ui/logos/Logo';

export default function NotFound() {
  return (
    <section className="relative flex h-screen items-center justify-center">
      <Link to="/">
        <Logo type="lg" className="absolute top-2.5 left-6.5 h-10" />
      </Link>
      <Error type="route" page="outer" />
      <ThemeButton className="absolute right-10 bottom-5" />
    </section>
  );
}
