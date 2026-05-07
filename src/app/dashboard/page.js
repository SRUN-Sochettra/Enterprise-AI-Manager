import { getProducts } from "@/src/lib/api/products";
import { getEmployees } from "@/src/lib/api/employees";
import AIDashboard from "@/src/components/AIDashboard";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [products, employees] = await Promise.all([
    getProducts(),
    getEmployees(),
  ]);

  return <AIDashboard products={products} employees={employees} />;
}