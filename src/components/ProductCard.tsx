import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    rating: number;
    stock: number;
    category?: { name: string } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = parseImages(product.images);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform p-4"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs text-gray-500 mb-1">{product.category.name}</span>
        )}
        <h3 className="text-sm font-medium line-clamp-2 mb-1 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1 mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}>
              ★
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-[#131921]">{formatPrice(product.price)}</p>
        {product.stock > 0 ? (
          <p className="text-xs text-green-600">متوفر</p>
        ) : (
          <p className="text-xs text-red-500">غير متوفر</p>
        )}
      </div>
    </Link>
  );
}
