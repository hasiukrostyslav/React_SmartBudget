import {
  PiEyeLight,
  PiEyeSlashLight,
  PiExclamationMarkBold,
} from 'react-icons/pi';
import { LuSun, LuMoon } from 'react-icons/lu';
import { IoCheckmark, IoClose, IoInformationOutline } from 'react-icons/io5';

interface IconProps {
  className?: string;
  name:
    | 'visible'
    | 'hidden'
    | 'sun'
    | 'moon'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
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
    case 'success':
      return <IoCheckmark className={className} />;
    case 'error':
      return <IoClose className={className} />;
    case 'info':
      return <IoInformationOutline className={className} />;
    case 'warning':
      return <PiExclamationMarkBold className={className} />;

    default:
      return null;
  }
}
