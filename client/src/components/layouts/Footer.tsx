import { Link } from 'react-router';
import clsx from 'clsx';
import ThemeButton from '../ui/buttons/ThemeButton';
import Copyright from '../ui/Copyright';

const links = ['Privacy Policy', 'Term and Condition', 'Contact'];

export default function Footer() {
  return (
    <footer
      className={clsx(
        'col-start-2 flex items-center justify-between gap-20 px-10 py-5 text-xs',
        'text-slate-500 dark:text-slate-400',
      )}
    >
      <Copyright/>
      <ul className="flex items-center gap-4 self-end">
        {links.map((link) => (
          <li key={link} className="hover:text-slate-600">
            <Link className="outline-round-sm" to="#">
              {link}
            </Link>
          </li>
        ))}
      </ul>

      <ThemeButton className="justify-self-end" />
    </footer>
  );
}
