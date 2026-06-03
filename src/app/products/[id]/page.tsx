import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/db";
import { formatPrice, parseImages } from "@/lib/utils";
import ClientActions from "./ClientActions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id);
  if (!product) notFound();

  const formatted = {
    id: product.id as string,
    name: product.name as string,
    slug: product.slug as string,
    description: product.description as string,
    price: Number(product.price),
    images: product.images as string,
    stock: Number(product.stock),
    rating: Number(product.rating),
    category: product.categoryName ? { name: product.categoryName as string, slug: product.categorySlug as string } : null,
  };

  const images = parseImages(formatted.images);
  const related = product.categoryId ? await getRelatedProducts(product.categoryId as string, product.id as string) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 glass inline-block px-4 py-2 rounded-xl">
        <a href="/" className="hover:text-purple-400 transition-colors">الرئيسية</a>
        {formatted.category && (
          <><span className="mx-2">/</span><a href={`/products?cat=${formatted.category.slug}`} className="hover:text-purple-400 transition-colors">{formatted.category.name}</a></>)}
        <span className="mx-2">/</span>
        <span className="text-purple-400">{formatted.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 glass rounded-2xl p-6 md:p-8">
        <div className="aspect-square bg-white/5 rounded-xl overflow-hidden">
          <img src={images[0] || "/placeholder.svg"} alt={formatted.name} className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-500" />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{formatted.name}</h1>
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-xl ${i < Math.round(formatted.rating) ? "text-yellow-400" : "text-gray-600"}`}>★</span>
            ))}
            <span className="text-sm text-gray-500 mr-2">({formatted.rating})</span>
          </div>
          <p className="text-4xl font-black gradient-text mb-6">{formatPrice(formatted.price)}</p>
          <p className="text-gray-300 mb-6 leading-relaxed">{formatted.description}</p>
          <p className={`text-sm mb-6 ${formatted.stock > 0 ? "text-green-400" : "text-red-400"}`}>
            {formatted.stock > 0 ? `✅ متوفر - الكمية: ${formatted.stock}` : "❌ غير متوفر حالياً"}
          </p>
          <ClientActions product={formatted} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r: any) => (
              <a key={r.id} href={`/products/${r.slug}`} className="glass rounded-xl p-4 card-hover">
                <img src={parseImages(r.images)[0] || "/placeholder.svg"} alt={r.name} className="w-full h-36 object-contain mb-3" />
                <p className="text-sm font-medium text-white line-clamp-2 mb-2">{r.name}</p>
                <p className="text-lg font-bold gradient-text">{formatPrice(Number(r.price))}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
