export default function Header() {
  return (
    <header className="col-start-2 flex items-center px-6 py-3">
      <DashboardHeading />
      <Time />
      <SearchForm size="sm" className="ml-auto" placeholder="Search..." />
      <UserPanel />
    </header>
  );
}
