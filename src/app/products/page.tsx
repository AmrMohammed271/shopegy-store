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
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#0f1111]">
          {q ? `نتائج البحث عن "${q}"` : cat ? `قسم ${categories.find((c: any) => c.slug === cat)?.name || cat}` : "جميع المنتجات"}
        </h1>
        <span className="text-sm text-[#565959]">({products.length} منتج)</span>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <a href="/products" className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${!cat ? "border-[#febd69] bg-[#fef4e4] text-[#c7511f]" : "border-[#d5d9d9] text-[#0f1111] hover:border-[#febd69] hover:bg-[#fef4e4]"}`}>الكل</a>
        {categories.map((c: any) => (
          <a key={c.id} href={`/products?cat=${c.slug}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${cat === c.slug ? "border-[#febd69] bg-[#fef4e4] text-[#c7511f]" : "border-[#d5d9d9] text-[#0f1111] hover:border-[#febd69] hover:bg-[#fef4e4]"}`}>
            {c.name}
          </a>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-[#565959] mb-4">لا توجد منتجات</p>
          <a href="/products" className="bg-[#febd69] text-[#0f1111] px-6 py-2.5 rounded-lg font-bold inline-block hover:bg-[#f3a847] transition-colors">عرض الكل</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={{ ...p, featured: !!p.featured, category: p.categoryName ? { name: p.categoryName } : null }} />
          ))}
        </div>
      )}
    </div>
  );
}
