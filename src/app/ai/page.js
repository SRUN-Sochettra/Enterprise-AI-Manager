import { getProducts } from "@/src/lib/api/products";
import { getEmployees } from "@/src/lib/api/employees";
import GeminiChat from "@/src/components/GeminiChat";

export const metadata = { title: "AI Assistant" };

export default async function AiPage() {
  const [products, employees] = await Promise.all([
    getProducts(),
    getEmployees(),
  ]);
  return <GeminiChat products={products} employees={employees} />;
}