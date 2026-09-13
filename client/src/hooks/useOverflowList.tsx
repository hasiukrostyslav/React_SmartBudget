import { useLayoutEffect, useRef, useState } from 'react';

interface useOverflowListProps {
  count: number;
  buttonWidth?: number;
  gap?: number;
}

export function useOverflowList({
  count,
  buttonWidth = 100,
  gap = 8,
}: useOverflowListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(count);
  const [isListExpanded, setIsListExpanded] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const calcVisibleItems = () => {
      const available = container.clientWidth;
      const widths = Array.from(measure.children).map(
        (child) => (child as HTMLElement).offsetWidth,
      );

      // Everything fits without needing the "+N more" button.
      const total = widths.reduce((sum, w) => sum + w + gap, 0) - gap;
      if (total <= available) {
        setVisible(count);
        return;
      }

      // Overflowing: reserve space for the button and count what fits.
      let usedSpace = 0;
      let itemsFit = 0;
      for (const width of widths) {
        if (usedSpace + width + buttonWidth > available) break;
        usedSpace += width + gap;
        itemsFit++;
      }
      setVisible(itemsFit);
    };

    const observer = new ResizeObserver(calcVisibleItems);
    observer.observe(container);
    calcVisibleItems();

    return () => observer.disconnect();
  }, [count, buttonWidth, gap]);

  const expandList = () => setIsListExpanded(!isListExpanded);

  return { containerRef, measureRef, visible, isListExpanded, expandList };
}
