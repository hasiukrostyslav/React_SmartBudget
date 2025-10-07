import { Outlet } from 'react-router';
import { ThemeProvider } from '@/context';

export default function AuthLayout() {
  return (
    <main className="flex h-screen w-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-300">
      <figure className="relative w-7/12">
        <img
          className="h-full"
          src="/background.jpg"
          alt="background image"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 70vw, 100vw"
        />
      </figure>
      <ThemeProvider>
        <Outlet />
      </ThemeProvider>
    </main>
  );
}
