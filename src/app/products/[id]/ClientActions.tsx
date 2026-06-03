"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  stock: number;
}

export default function ClientActions({ product }: { product: Product }) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((i: { id: string }) => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: product.id, name: product.name, slug: product.slug, price: product.price, images: product.images, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    router.refresh();
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={addToCart}
        disabled={product.stock === 0}
        className={`flex-1 py-3 rounded-lg font-bold text-lg transition-colors ${
          product.stock === 0
            ? "bg-gray-300 cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-[#febd69] hover:bg-[#f3a847]"
        }`}
      >
        {product.stock === 0 ? "غير متوفر" : added ? "✓ تمت الإضافة" : "أضف إلى السلة"}
      </button>
      <button
        onClick={() => {
          addToCart();
          router.push("/cart");
        }}
        disabled={product.stock === 0}
        className="py-3 px-6 rounded-lg font-bold border-2 border-[#febd69] text-[#131921] hover:bg-[#febd69] transition-colors"
      >
        اشتر الآن
      </button>
    </div>
  );
}
