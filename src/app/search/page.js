import { getProducts } from "@/src/lib/api/products";
import { getEmployees } from "@/src/lib/api/employees";
import SmartSearch from "@/src/components/SmartSearch";

export const metadata = { title: "Smart Search" };

export default async function SearchPage() {
  const [products, employees] = await Promise.all([
    getProducts(),
    getEmployees(),
  ]);
  return <SmartSearch products={products} employees={employees} />;
}