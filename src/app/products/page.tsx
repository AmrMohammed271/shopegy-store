import { query, getCategories } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await searchParams;
  const q = params.q;
  const cat = params.cat;

  let where = "";
  const vals: unknown[] = [];
  if (q) { where = "WHERE (p.name LIKE ? OR p.description LIKE ?)"; vals.push(`%${q}%`, `%${q}%`); }
  if (cat) { where = where ? `${where} AND c.slug = ?` : "WHERE c.slug = ?"; vals.push(cat); }

  const [products, categories] = await Promise.all([
    query(
      `SELECT p.*, c.name as categoryName, c.slug as categorySlug FROM products p LEFT JOIN categories c ON p.categoryId = c.id ${where} ORDER BY p.createdAt DESC`,
      vals
    ),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">
          {q ? `نتائج البحث عن "${q}"` : cat ? `قسم ${cat}` : "جميع المنتجات"}
        </h1>
        <span className="text-gray-500">({products.length} منتج)</span>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <a href="/products" className="px-3 py-1 rounded-full text-sm border bg-white hover:bg-gray-100">الكل</a>
        {categories.map((c: any) => (
          <a key={c.id} href={`/products?cat=${c.slug}`}
            className={`px-3 py-1 rounded-full text-sm border ${cat === c.slug ? "bg-[#131921] text-white" : "bg-white hover:bg-gray-100"}`}>
            {c.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl">لا توجد منتجات</p>
          <a href="/products" className="text-blue-600 hover:underline mt-2 inline-block">عرض الكل</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={{ ...p, featured: !!p.featured, category: p.categoryName ? { name: p.categoryName } : null }} />
          ))}
        </div>
      )}
    </div>
  );
}
