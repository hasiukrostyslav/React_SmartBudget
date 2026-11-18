import { Suspense } from 'react';

import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <main className="flex h-dvh w-screen">
      <section className="bg-navy w-1/2"></section>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </main>
  );
}
