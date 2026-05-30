import { icons } from '@/lib/constants/icons';
import type { IconName } from '@/types/types';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({
  name,
  className,
  color,
  size,
  strokeWidth,
}: IconProps) {
  const Icon = icons.find((icon) => icon.role === name)?.component;

  if (!Icon) return null;

  return (
    <Icon
      name={name}
      strokeWidth={strokeWidth}
      size={size}
      color={color}
      className={className}
    />
  );
}
