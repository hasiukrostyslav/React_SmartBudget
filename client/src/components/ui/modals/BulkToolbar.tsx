import clsx from 'clsx';

import SectionWrapper from '@/components/layouts/SectionWrapper';

import ButtonIcon from '../buttons/ButtonIcon';
import ToolbarButton from '../buttons/ToolbarButton';

interface BulkToolbarProps {
  isShown: boolean;
  selectedNumber: number;
  isAllSelected: boolean;
  selectAll: () => void;
  deselectAll: () => void;
  children: React.ReactNode;
}

export default function BulkToolbar({
  isShown,
  selectedNumber,
  isAllSelected,
  selectAll,
  deselectAll,
  children,
}: BulkToolbarProps) {
  return (
    <SectionWrapper
      className={clsx(
        'flex items-center text-sm',
        'absolute top-full right-1/5 translate-y-6',
        !isShown ? 'hidden' : '',
      )}
    >
      <div
        className={clsx(
          'mr-2 flex gap-1 bg-blue-300/40 px-4 py-1 pr-3 dark:bg-blue-800/70',
          'rounded-md',
        )}
      >
        <span
          className={clsx(
            'grid h-5 min-w-5 place-content-center rounded-md px-2',
            'bg-blue-500 text-slate-100',
          )}
        >
          {selectedNumber}
        </span>
        <span className="text-blue-700 dark:text-blue-200">selected</span>
      </div>
      <div className="mr-3 flex items-center justify-center gap-3">
        <ToolbarButton
          iconName="select"
          iconSize={14}
          label="Select all"
          onClick={selectAll}
          disabled={isAllSelected}
        />
        {children}
      </div>
      <ButtonIcon
        iconName="close"
        size={14}
        shape="square"
        variant="ghost"
        onClick={deselectAll}
      />
    </SectionWrapper>
  );
}
