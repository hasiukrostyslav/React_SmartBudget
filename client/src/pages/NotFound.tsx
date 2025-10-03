import Error from '@/components/Error';
import ThemeButton from '@/components/ThemeButton';

export default function NotFound() {
  return (
    <section className="relative flex w-5/12 items-center justify-center">
      <Error type="route" />
      <ThemeButton className="absolute right-10 bottom-5" />
    </section>
  );
}
