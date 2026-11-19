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
          'bg-navy bg-grid w-1/2 px-12 py-9 xl:px-14 xl:py-11',
          'flex flex-col justify-between',
        )}
      >
        <div className="max-w-36 lg:max-w-42 xl:max-w-48">
          <Logo type="logo" color="white" className="w-12" />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-on-navy text-3xl font-extrabold text-balance lg:text-4xl xl:text-5xl">
            Know where every dollars goes.
          </h1>
          <p className="text-placeholder text-base text-balance lg:text-lg xl:text-xl">
            Track spending, plan budgets and grow your savings — all in one
            calm, simple place.
          </p>
        </div>
        <div></div>

        <div className="grid grid-cols-1 justify-start justify-items-start gap-x-5 gap-y-3 xl:grid-cols-[auto_auto]">
          {APP_FEATURES.map((feature) => (
            <div className="flex items-center justify-center gap-2">
              <div className="bg-on-navy-surface rounded-md p-1.5">
                <Icon
                  name={feature.icon}
                  size={16}
                  className="text-on-navy-accent"
                />
              </div>
              <p className="text-on-navy-muted text-sm">{feature.label}</p>
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
