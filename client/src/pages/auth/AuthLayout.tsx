import { Outlet } from 'react-router';
import { ThemeProvider } from '../../context';

export default function AuthLayout() {
  return (
    <main className="flex h-screen w-screen text-slate-900 dark:text-slate-300 dark:bg-slate-900">
      <div className="relative w-7/12">
        <img
          src="/background.jpg"
          alt="background image"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 70vw, 100vw"
        />
      </div>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </main>
  );
}
