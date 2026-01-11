import { Outlet } from 'react-router';
import clsx from 'clsx';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export default function DashboardLayout() {
  return (
    <section className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      <Sidebar />
      {/* <Header /> */}
      <section
        className={clsx(
          'relative mx-5 rounded-2xl border',
          'border-slate-300 px-3 py-4 dark:border-slate-600',
        )}
      >
        <Outlet />
      </section>
      <Footer />
    </section>
  );
}
