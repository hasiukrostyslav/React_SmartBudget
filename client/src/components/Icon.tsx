import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi';
import { LuSun, LuMoon } from 'react-icons/lu';

interface IconProps {
  className?: string;
  name: 'visible' | 'hidden' | 'sun' | 'moon';
}

export default function Icon({ name, className }: IconProps) {
  switch (name) {
    case 'visible':
      return <PiEyeLight className={className} />;
    case 'hidden':
      return <PiEyeSlashLight className={className} />;
    case 'sun':
      return <LuSun className={className} />;
    case 'moon':
      return <LuMoon className={className} />;

    default:
      return null;
  }
}
