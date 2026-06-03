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
    featured?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const images = parseImages(product.images);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group glass rounded-2xl overflow-hidden card-hover"
    >
      <div className="aspect-square bg-white/5 overflow-hidden relative">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-6"
        />
        {product.featured && (
          <span className="absolute top-2 right-2 gradient-bg text-white text-xs px-2 py-1 rounded-full font-bold">
            مميز
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="text-xs text-purple-400 mb-1 font-medium">{product.category.name}</span>
        )}
        <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 flex-1 group-hover:text-purple-300 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-600"}`}>
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 mr-1">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold gradient-text">{formatPrice(product.price)}</p>
          {product.stock > 0 ? (
            <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">متوفر</span>
          ) : (
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">نفذ</span>
          )}
        </div>
      </div>
    </Link>
  );
}
