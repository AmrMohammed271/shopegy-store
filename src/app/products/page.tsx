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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {q ? `نتائج البحث عن "${q}"` : cat ? `قسم ${categories.find((c: any) => c.slug === cat)?.name || cat}` : "جميع المنتجات"}
        </h1>
        <span className="text-gray-500 text-sm">({products.length} منتج)</span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <a href="/products" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!cat ? "gradient-bg text-white" : "glass text-gray-300 hover:bg-white/10"}`}>الكل</a>
        {categories.map((c: any) => (
          <a key={c.id} href={`/products?cat=${c.slug}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cat === c.slug ? "gradient-bg text-white" : "glass text-gray-300 hover:bg-white/10"}`}>
            {c.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-400">لا توجد منتجات</p>
          <a href="/products" className="inline-block mt-4 gradient-bg text-white px-6 py-3 rounded-xl font-bold">عرض الكل</a>
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
