import { clsx } from 'clsx';

import Button from '../buttons/Button';
import Icon from '../icons/Icon';

interface EmptySearchResultProps {
  category: string;
  query: string;
  onClick: () => void;
}

export default function EmptySearchResult({
  category,
  query,
  onClick,
}: EmptySearchResultProps) {
  return (
    <section
      className={clsx(
        'col-span-full flex h-full flex-col items-center justify-center',
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          className="h-30 w-30"
          alt="Error"
          src="/error-404.png"
          width={120}
          height={120}
        />

        <h2
          className={clsx(
            'my-2 text-base leading-snug font-semibold tracking-wider',
          )}
        >
          No matches for <span className="text-purple-500">"{query}"</span>
        </h2>
      </div>
      <div
        className={clsx(
          'flex w-2/3 flex-col items-center justify-center gap-3 text-center',
        )}
      >
        <p className="text-slate-500">
          Nothing in your {category} list matches that. Try a different keyword,
          or clear the search to see them all.
        </p>

        <div className="flex gap-2">
          <Button color="blue" size="sm" onClick={onClick}>
            <Icon name="undo" size={14} />
            <span>Clear search</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
