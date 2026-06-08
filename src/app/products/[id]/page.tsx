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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="text-[#ffa41c] text-lg" dir="ltr">
        {"★".repeat(full)}{half ? "★" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-[#565959] mb-4">
        <a href="/" className="hover:text-[#c7511f] transition-colors">الرئيسية</a>
        {formatted.category && (
          <><span className="mx-1">/</span><a href={`/products?cat=${formatted.category.slug}`} className="hover:text-[#c7511f] transition-colors">{formatted.category.name}</a></>)}
        <span className="mx-1">/</span>
        <span className="text-[#0f1111]">{formatted.name}</span>
      </nav>

      {/* Product */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          <div className="aspect-square bg-white rounded-lg overflow-hidden border border-[#d5d9d9] flex items-center justify-center p-6">
            <img src={images[0] || "/placeholder.svg"} alt={formatted.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-[#0f1111] mb-2">{formatted.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              {renderStars(formatted.rating)}
              <span className="text-sm text-[#007185]">{formatted.rating}</span>
            </div>
            <hr className="border-[#d5d9d9] mb-3" />
            <p className="text-3xl font-bold text-[#0f1111] mb-3">
              <span className="text-sm align-super">ج.م</span> {formatPrice(formatted.price).replace("ج.م", "").trim()}
            </p>
            {formatted.stock > 20 && (
              <p className="text-sm text-[#067d62] mb-2">✓ التوصيل المجاني متوفر</p>
            )}
            <p className={`text-sm mb-4 ${formatted.stock > 0 ? "text-[#067d62]" : "text-[#c7511f]"}`}>
              {formatted.stock > 0 ? `متوفر - الكمية: ${formatted.stock}` : "غير متوفر حالياً"}
            </p>
            <p className="text-sm text-[#0f1111] mb-6 leading-relaxed">{formatted.description}</p>
            <ClientActions product={formatted} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg md:text-xl font-bold text-[#0f1111] mb-4">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map((r: any) => (
              <a key={r.id} href={`/products/${r.slug}`} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow">
                <img src={parseImages(r.images)[0] || "/placeholder.svg"} alt={r.name} className="w-full h-32 object-contain mb-2" />
                <p className="text-sm text-[#0f1111] line-clamp-2 mb-1">{r.name}</p>
                <p className="text-lg font-bold text-[#0f1111]">
                  <span className="text-xs align-super">ج.م</span> {formatPrice(Number(r.price)).replace("ج.م", "").trim()}
                </p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
