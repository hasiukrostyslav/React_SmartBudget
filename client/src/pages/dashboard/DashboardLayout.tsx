import { Suspense } from 'react';

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Outlet } from 'react-router';

import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';
import Sidebar from '@/components/layouts/Sidebar';
import RouteErrorBoundary from '@/components/routes/RouteErrorBoundary';
import ErrorState from '@/components/ui/feedback/ErrorState';
import Spinner from '@/components/ui/feedback/Spinner';

export default function DashboardLayout() {
  return (
    <section className="grid h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]">
      <TooltipProvider>
        <Sidebar />
        <Header />
        <section className="relative min-h-0 overflow-y-auto bg-slate-50 px-6 py-4 dark:bg-slate-900">
          {/* A crashing page keeps the sidebar and header usable */}
          <RouteErrorBoundary fallback={<ErrorState type="server" />}>
            <Suspense fallback={<Spinner />}>
              <Outlet />
            </Suspense>
          </RouteErrorBoundary>
        </section>
        <Footer />
      </TooltipProvider>
    </section>
  );
}
