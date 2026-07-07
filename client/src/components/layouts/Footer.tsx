import clsx from 'clsx';
import { Link } from 'react-router';

import Copyright from '../ui/atomic/Copyright';
import ThemeButton from '../ui/buttons/ThemeButton';

const links = ['Privacy Policy', 'Term and Condition', 'Contact'];

export default function Footer() {
  return (
    <footer
      className={clsx(
        'col-start-2 flex items-center justify-between gap-20 px-10 py-4 text-xs',
        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
        'border-t border-blue-400',
      )}
    >
      <Copyright />
      <ul className="flex items-center gap-4">
        {links.map((link) => (
          <li key={link} className="hover:text-slate-600">
            <Link className="outline-round-sm" to="#">
              {link}
            </Link>
          </li>
        ))}
      </ul>

      <ThemeButton />
    </footer>
  );
}
