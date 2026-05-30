import { useLocation } from 'react-router';

export default function DashboardHeading() {
  const location = useLocation();
  const heading = location.pathname.split('/').at(-1);

  return (
    <h2 className="min-w-40 text-xl font-semibold tracking-wider">
      {heading ? heading[0].toUpperCase() + heading.slice(1) : ''}
    </h2>
  );
}
