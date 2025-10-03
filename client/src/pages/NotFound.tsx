import Error from '@/components/Error';
import ThemeButton from '@/components/ThemeButton';

export default function NotFound() {
  return (
    <section className="w-5/12 flex justify-center items-center relative">
      <Error type="route" />
      <ThemeButton className="absolute bottom-5 right-10" />
    </section>
  );
}
