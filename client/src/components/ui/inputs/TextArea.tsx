import clsx from 'clsx';

import InputLabel from './InputLabel';

export default function TextArea() {
  return (
    <div className="w-full">
      <InputLabel label="Note" margin="sm" htmlFor="note" />
      <textarea
        id="note"
        className={clsx(
          'outline-input w-full text-slate-700 dark:text-slate-50',
          'border border-slate-300 dark:border-slate-400',
          'resize-none px-3 py-2',
        )}
      ></textarea>
    </div>
  );
}
