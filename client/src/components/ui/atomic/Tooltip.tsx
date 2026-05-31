import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  label?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  delayDuration?: number;
  container?: HTMLElement | null;
}

export default function Tooltip({
  children,
  label,
  side = 'top',
  delayDuration = 500,
  container,
}: TooltipProps) {
  if (!label) return <>{children}</>;

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal container={container}>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            avoidCollisions
            collisionPadding={8}
            className="max-w-xs rounded-md px-2.5 py-1.5 text-xs font-medium shadow-md"
            style={{
              backgroundColor: 'var(--tooltip-bg)',
              color: 'var(--tooltip-fg)',
              zIndex: 9999,
            }}
          >
            {label}
            <TooltipPrimitive.Arrow style={{ fill: 'var(--tooltip-arrow)' }} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
