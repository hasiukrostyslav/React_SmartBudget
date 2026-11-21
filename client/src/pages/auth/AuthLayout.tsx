import { Suspense } from 'react';

import { clsx } from 'clsx';
import { Outlet } from 'react-router';

import type { IconName } from '@/types/types';

import Icon from '@/components/ui/icons/Icon';
import Logo from '@/components/ui/logos/Logo';

type AppFeature = {
  icon: IconName;
  label: string;
};

const APP_FEATURES: AppFeature[] = [
  { icon: 'card', label: 'Every card and wallet in one place' },
  { icon: 'target', label: 'Budgets that keep you on track' },
  { icon: 'trending-up', label: 'Goals you actually reach' },
];

export default function AuthLayout() {
  return (
    <main className="flex h-dvh w-screen">
      <section
        className={clsx(
          'bg-navy bg-grid w-1/2 px-10 py-7 xl:px-12 xl:py-9',
          'hidden flex-col justify-between md:flex',
        )}
      >
        <div className="max-w-30 lg:max-w-36 xl:max-w-42">
          <Logo type="logo" color="white" className="w-12" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-on-navy text-3xl font-extrabold lg:text-4xl xl:text-5xl">
            Know where every <br /> dollars goes.
          </h1>
          <p className="text-placeholder text-base lg:text-lg xl:text-xl">
            Track spending, plan budgets and grow your savings <br /> — all in
            one calm, simple place.
          </p>
        </div>
        <div className="relative py-10">
          <img
            className="w-2/5"
            src="/auth/balance-card.png"
            alt="Balance card"
          />
          <img
            className="absolute top-0 right-2/6 z-10 w-2/6"
            src="/auth/budget-card.png"
            alt="Budget card"
          />
          <img
            className="absolute right-3/10 bottom-0 w-3/8"
            src="/auth/transactions-card.png"
            alt="Transaction card"
          />
        </div>

        <div className="grid grid-cols-1 justify-start justify-items-start gap-x-5 gap-y-3 xl:grid-cols-[auto_auto]">
          {APP_FEATURES.map((feature) => (
            <div className="flex items-center justify-center gap-2">
              <div className="bg-on-navy-surface rounded-md p-1.5">
                <Icon
                  name={feature.icon}
                  size={14}
                  className="text-on-navy-accent"
                />
              </div>
              <p className="text-on-navy-muted text-xs xl:text-sm">
                {feature.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </main>
  );
}
