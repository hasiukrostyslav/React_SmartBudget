import { useLocation } from 'react-router';

export default function DashboardHeading() {
  const location = useLocation();
  const heading = location.pathname.split('/').at(-1);

  return (
    <h2 className="min-w-40 text-xl font-semibold tracking-wider">
      {heading?.replace(heading[0], heading[0].toUpperCase())}
    </h2>
  );
}
