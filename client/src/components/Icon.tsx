import type { IconName } from '@/types/types';
import { DynamicIcon } from 'lucide-react/dynamic';

interface IconProps {
  className?: string;
  color?: string;
  size?: number;
  name: IconName;
}

export default function Icon({ name, className, color, size }: IconProps) {
  return (
    <DynamicIcon name={name} size={size} color={color} className={className} />
  );
}
