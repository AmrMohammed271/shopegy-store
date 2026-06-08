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

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    return (
      <span className="text-[#ffa41c] text-sm" dir="ltr">
        {"★".repeat(full)}{half ? "★" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      </span>
    );
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="aspect-square bg-white overflow-hidden relative flex items-center justify-center p-4">
        <img
          src={images[0] || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <span className="absolute top-2 right-2 bg-[#febd69] text-[#0f1111] text-[11px] px-2 py-0.5 rounded font-bold">
            مميز
          </span>
        )}
      </div>
      <div className="p-3 pt-1">
        <h3 className="text-sm text-[#0f1111] line-clamp-2 mb-1 leading-snug hover:text-[#c7511f] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-1">
          {renderStars(product.rating)}
          <span className="text-xs text-[#007185] mr-1">{product.rating}</span>
        </div>
        <p className="text-lg font-bold text-[#0f1111]">
          <span className="text-xs align-super">ج.م</span> {formatPrice(product.price).replace("ج.م", "").trim()}
        </p>
        {product.stock > 20 && (
          <p className="text-xs text-[#067d62] mt-1">توصيل مجاني غداً</p>
        )}
      </div>
    </Link>
  );
}
