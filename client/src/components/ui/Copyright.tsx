export default function Copyright() {
  const year = new Date().getFullYear();

  return (
    <p className="self-end">Copyright &copy; {year} SmartBudget</p>
  )
}