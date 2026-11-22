export default function Copyright() {
  const year = new Date().getFullYear();

  return (
    <p className="text-muted text-xs xl:text-sm">&copy; {year} SmartBudget</p>
  );
}
