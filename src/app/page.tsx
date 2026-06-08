import Link from "next/link";
import { getFeaturedProducts, getLatestProducts, getCategories } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

const categoryIcons: Record<string, string> = {
  electronics: "🖥️", automotive: "🚗", "home-kitchen": "🏠",
  "beauty-care": "💄", fashion: "👗", health: "💊",
  kids: "🧸", sports: "⚽",
};

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#232f3e] to-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="text-center md:text-right">
            <h1 className="text-3xl md:text-5xl font-black mb-4">
              تسوق بذكاء <span className="text-[#febd69]">مع Nexora</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6 max-w-xl">
              أفضل المنتجات بأفضل الأسعار. توصيل سريع لجميع المحافظات.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link href="/products" className="bg-[#febd69] text-[#0f1111] px-8 py-3 rounded-lg font-bold text-lg hover:bg-[#f3a847] transition-colors inline-block">
                تسوق الآن
              </Link>
              <Link href="#featured" className="border border-gray-500 text-gray-300 px-8 py-3 rounded-lg font-bold text-lg hover:border-white hover:text-white transition-all inline-block">
                أشهر العروض
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {categories.map((cat, i) => (
              <Link
                key={cat.id as string}
                href={`/products?cat=${cat.slug}`}
                className="bg-white rounded-lg p-3 text-center hover:shadow-md transition-shadow animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="text-2xl mb-1">{categoryIcons[cat.slug as string] || "🛍️"}</div>
                <span className="text-xs text-[#0f1111] font-medium">{cat.name as string}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#0f1111]">عروض مميزة</h2>
            <Link href="/products" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline transition-colors">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featured.slice(0, 8).map((product) => (
              <ProductCard key={product.id as string} product={{ ...product, featured: true, category: product.categoryName ? { name: product.categoryName as string } : null } as any} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#0f1111]">أحدث المنتجات</h2>
          <Link href="/products" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline transition-colors">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {latest.slice(0, 8).map((product) => (
            <ProductCard key={product.id as string} product={{ ...product, category: product.categoryName ? { name: product.categoryName as string } : null } as any} />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-t border-[#d5d9d9]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🚚", title: "توصيل سريع", desc: "لجميع المحافظات" },
            { icon: "💳", title: "دفع آمن", desc: "كاش أو فوري" },
            { icon: "🔄", title: "إرجاع مجاني", desc: "خلال 14 يوم" },
            { icon: "📞", title: "دعم 24/7", desc: "خدمة عملاء" },
          ].map((f, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-1">{f.icon}</div>
              <h3 className="text-[#0f1111] font-bold text-sm">{f.title}</h3>
              <p className="text-[#565959] text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
