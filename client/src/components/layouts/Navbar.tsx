import { navLinks } from '@/lib/constants/ui';
import NavigationLink from '../ui/links/NavigationLink';

interface NavbarProps {
  isCollapsed: boolean;
}

export default function Navbar({ isCollapsed }: NavbarProps) {
  return (
    <nav className="mt-4 flex flex-col gap-3">
      {navLinks
        .filter((el) => el.type === 'main')
        .map((el) => (
          <NavigationLink
            key={el.page}
            iconName={el.icon}
            href={
              el.page === 'dashboard' ? '/dashboard' : `/dashboard/${el.page}`
            }
            text={el.page.replace(el.page[0], el.page[0].toUpperCase())}
            isCollapsed={isCollapsed}
          />
        ))}

      <div className="flex flex-col gap-3 border-t-2 border-blue-400 pt-3">
        {navLinks
          .filter((el) => el.type === 'setting')
          .map((el) => (
            <NavigationLink
              key={el.page}
              iconName={el.icon}
              href={`/dashboard/${el.page}`}
              text={el.page.replace(el.page[0], el.page[0].toUpperCase())}
              isCollapsed={isCollapsed}
            />
          ))}
      </div>
    </nav>
  );
}
