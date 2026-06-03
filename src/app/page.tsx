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
      {/* Hero Section */}
      <section className="hero-gradient min-h-[500px] flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-black mb-4 animate-fade-in-up">
              <span className="gradient-text">Nexora</span>
              <br />
              <span className="text-white">تسوق بذكاء، عيش التميز</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in-up delay-100 leading-relaxed">
              اكتشف أحدث المنتجات الحصرية بأفضل الأسعار في مصر. توصيل سريع لجميع المحافظات.
            </p>
            <div className="flex gap-3 animate-fade-in-up delay-200">
              <Link
                href="/products"
                className="gradient-bg text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:opacity-90 transition-all animate-pulse-glow inline-block"
              >
                تسوق الآن
              </Link>
              <Link
                href="#featured"
                className="glass text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all inline-block"
              >
                أشهر العروض
              </Link>
            </div>
          </div>
        </div>
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 relative -mt-16 z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.id as string}
                href={`/products?cat=${cat.slug}`}
                className="glass rounded-xl p-4 text-center card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="text-2xl mb-1">{categoryIcons[cat.slug as string] || "🛍️"}</div>
                <span className="text-xs text-gray-300 font-medium">{cat.name as string}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section id="featured" className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                <span className="gradient-text">⭐</span> أفضل العروض
              </h2>
              <p className="text-gray-500 text-sm mt-1">منتجات مختارة بعناية لك</p>
            </div>
            <Link href="/products" className="glass text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition-all">
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id as string} product={{ ...product, featured: true, category: product.categoryName ? { name: product.categoryName as string } : null } as any} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              <span className="gradient-text">🔥</span> أحدث المنتجات
            </h2>
            <p className="text-gray-500 text-sm mt-1">آخر ما وصلنا من المنتجات</p>
          </div>
          <Link href="/products" className="glass text-purple-400 px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition-all">
            عرض الكل ←
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {latest.map((product) => (
            <ProductCard key={product.id as string} product={{ ...product, category: product.categoryName ? { name: product.categoryName as string } : null } as any} />
          ))}
        </div>
      </section>

      {/* Features strip */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🚚", title: "توصيل سريع", desc: "لجميع المحافظات" },
            { icon: "💳", title: "دفع آمن", desc: "كاش أو فوري" },
            { icon: "🔄", title: "إرجاع مجاني", desc: "خلال 14 يوم" },
            { icon: "📞", title: "دعم 24/7", desc: "خدمة عملاء على مدار الساعة" },
          ].map((f, i) => (
            <div key={i} className="glass rounded-xl p-5 text-center card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="text-white font-bold text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
