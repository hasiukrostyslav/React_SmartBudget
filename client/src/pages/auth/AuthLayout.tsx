import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <main className="flex h-screen w-screen">
      <figure className="relative w-7/12">
        <img
          className="h-full"
          src="/background.jpg"
          alt="background image"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 70vw, 100vw"
        />
      </figure>
      <Outlet />
    </main>
  );
}
