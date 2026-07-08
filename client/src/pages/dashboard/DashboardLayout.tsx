import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Outlet } from 'react-router';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';

export default function DashboardLayout() {
  return (
    <section className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      <TooltipProvider>
        <Sidebar />
        <Header />
        <section className="relative bg-slate-50 px-6 py-4 dark:bg-slate-900">
          <Outlet />
        </section>
        <Footer />
      </TooltipProvider>
    </section>
  );
}
