import { useTheme } from '@/hooks/useTheme';

interface LogoProps {
  type: 'logo' | 'icon' | 'symbol';
  color?: 'black' | 'white';
  className?: string;
}
const baseURL = '/logo/smartbudget';

export default function Logo({ className, type, color }: LogoProps) {
  const { theme } = useTheme();

  return (
    <img
      src={`${baseURL}-${type}${color ? '-' + color : ''}.svg`}
      alt="Logo"
      className={`w-full ${className}`}
    />
  );
}
