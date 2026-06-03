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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <nav className="text-sm text-gray-500 mb-4">
        <a href="/" className="hover:underline">الرئيسية</a> /{" "}
        {formatted.category && (
          <><a href={`/products?cat=${formatted.category.slug}`} className="hover:underline">{formatted.category.name}</a> / </>)}
        <span className="text-gray-800">{formatted.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-lg p-6">
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
          <img src={images[0] || "/placeholder.svg"} alt={formatted.name} className="w-full h-full object-contain p-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">{formatted.name}</h1>
          <div className="flex items-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-lg ${i < Math.round(formatted.rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
            ))}
            <span className="text-sm text-gray-500 mr-1">({formatted.rating})</span>
          </div>
          <p className="text-3xl font-bold text-[#131921] mb-4">{formatPrice(formatted.price)}</p>
          <p className="text-gray-700 mb-4 leading-relaxed">{formatted.description}</p>
          <p className={`text-sm mb-4 ${formatted.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {formatted.stock > 0 ? `متوفر - الكمية: ${formatted.stock}` : "غير متوفر حالياً"}
          </p>
          <ClientActions product={formatted} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">منتجات مشابهة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((r: any) => (
              <a key={r.id} href={`/products/${r.slug}`} className="bg-white p-3 rounded-lg border hover:shadow-md">
                <img src={parseImages(r.images)[0] || "/placeholder.svg"} alt={r.name} className="w-full h-32 object-contain mb-2" />
                <p className="text-sm font-medium line-clamp-2">{r.name}</p>
                <p className="text-lg font-bold mt-1">{formatPrice(Number(r.price))}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
