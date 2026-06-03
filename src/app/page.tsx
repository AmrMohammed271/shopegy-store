import Link from "next/link";
import { getFeaturedProducts, getLatestProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-b from-[#232f3e] to-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            مرحباً بك في <span className="text-[#febd69]">ShopEgy</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            أكبر متجر إلكتروني في مصر — أفضل المنتجات، أقل الأسعار، توصيل سريع
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#febd69] text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#f3a847] transition-colors"
          >
            تسوق الآن
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-4">الفئات</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id as string}
                href={`/products?cat=${cat.slug}`}
                className="bg-white rounded-lg p-4 text-center border hover:shadow-md transition-shadow"
              >
                {!!cat.image && <img src={String(cat.image)} alt={String(cat.name)} className="w-12 h-12 mx-auto mb-2 object-contain" />}
                <span className="font-medium text-sm">{cat.name as string}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">أفضل العروض</h2>
            <Link href="/products" className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id as string} product={{ ...product, featured: !!product.featured, category: product.categoryName ? { name: product.categoryName } : null } as any} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">أحدث المنتجات</h2>
          <Link href="/products" className="text-blue-600 hover:underline text-sm">عرض الكل</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latest.map((product) => (
            <ProductCard key={product.id as string} product={{ ...product, featured: !!product.featured, category: product.categoryName ? { name: product.categoryName } : null } as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
