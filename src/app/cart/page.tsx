"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const q = item.quantity + delta;
        return q <= 0 ? null : { ...item, quantity: q };
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    router.refresh();
  };

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    router.refresh();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((a, i) => a + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6 animate-float">🛒</div>
        <h1 className="text-2xl font-bold text-white mb-2">سلتك فارغة</h1>
        <p className="text-gray-400 mb-8">أضف منتجات إلى سلتك وارجع لإتمام الشراء</p>
        <Link href="/products" className="gradient-bg text-white px-8 py-3.5 rounded-xl font-bold text-lg inline-block hover:opacity-90 transition-all">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">
        سلّة التسوق <span className="text-purple-400">({itemCount})</span>
      </h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="glass rounded-xl p-4 flex gap-4 items-center card-hover">
              <img
                src={(() => { try { return JSON.parse(item.images)[0]; } catch { return item.images || "/placeholder.svg"; } })()}
                alt={item.name}
                className="w-20 h-20 object-contain rounded-xl bg-white/5"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium text-white hover:text-purple-400 transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-lg font-bold gradient-text mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 glass rounded-xl p-1">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white text-lg transition-colors">−</button>
                <span className="w-8 text-center font-medium text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg hover:bg-white/10 text-white text-lg transition-colors">+</button>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="font-bold text-white">{formatPrice(item.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.id)} className="text-red-400 text-sm hover:text-red-300 transition-colors">حذف</button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-xl p-6 h-fit">
          <h3 className="font-bold text-lg text-white mb-4">ملخص الطلب</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-300">
              <span>المنتجات ({itemCount})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>الشحن</span>
              <span className="text-green-400">مجاني</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg text-white">
              <span>الإجمالي</span>
              <span className="gradient-text">{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block text-center mt-6 gradient-bg text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all animate-pulse-glow"
          >
            إتمام الشراء
          </Link>
          <Link
            href="/products"
            className="block text-center mt-2 text-gray-400 text-sm hover:text-purple-400 transition-colors"
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
