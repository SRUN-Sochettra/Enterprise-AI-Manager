import { getProducts } from "@/src/lib/api/products";
import { getCategories } from "@/src/lib/api/categories";
import ProductsClient from "@/src/components/product_components/ProductsClient";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return <ProductsClient products={products} categories={categories} />;
}