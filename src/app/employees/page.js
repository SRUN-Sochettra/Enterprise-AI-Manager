import { getEmployees } from "@/src/lib/api/employees";
import EmployeesClient from "@/src/components/employee_components/EmployeesClient";

export const metadata = { title: "Employees" };

export default async function EmployeesPage() {
  const employees = await getEmployees();
  return <EmployeesClient employees={employees} />;
}