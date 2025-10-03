import { useTheme } from '@/hooks/useTheme';

export default function Logo() {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'light' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
      width={404}
      height={92}
      className="h-auto w-[300px]"
    />
  );
}
