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
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-bold text-[#0f1111] mb-2">سلتك فارغة</h1>
        <p className="text-[#565959] mb-8">أضف منتجات إلى سلتك وارجع لإتمام الشراء</p>
        <Link href="/products" className="bg-[#febd69] text-[#0f1111] px-8 py-3 rounded-lg font-bold text-lg inline-block hover:bg-[#f3a847] transition-colors">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0f1111] mb-6">
        سلّة التسوق <span className="text-[#565959]">({itemCount})</span>
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4 items-center">
              <img
                src={(() => { try { return JSON.parse(item.images)[0]; } catch { return item.images || "/placeholder.svg"; } })()}
                alt={item.name}
                className="w-20 h-20 object-contain rounded"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="text-sm text-[#0f1111] hover:text-[#c7511f] transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-base font-bold text-[#0f1111] mt-1">
                  <span className="text-xs align-super">ج.م</span> {formatPrice(item.price).replace("ج.م", "").trim()}
                </p>
              </div>
              <div className="flex items-center gap-1 border border-[#d5d9d9] rounded">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 hover:bg-gray-100 text-[#0f1111] transition-colors">−</button>
                <span className="w-8 text-center text-sm text-[#0f1111]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 hover:bg-gray-100 text-[#0f1111] transition-colors">+</button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-[#0f1111]">
                  <span className="text-xs align-super">ج.م</span> {formatPrice(item.price * item.quantity).replace("ج.م", "").trim()}
                </p>
                <button onClick={() => removeItem(item.id)} className="text-[#007185] text-sm hover:text-[#c7511f] transition-colors">حذف</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
          <h3 className="font-bold text-lg text-[#0f1111] mb-4">ملخص الطلب</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[#565959]">
              <span>المنتجات ({itemCount})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-[#565959]">
              <span>الشحن</span>
              <span className="text-[#067d62]">مجاني</span>
            </div>
            <div className="border-t border-[#d5d9d9] pt-3 flex justify-between font-bold text-lg text-[#0f1111]">
              <span>الإجمالي</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block text-center mt-6 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] py-3 rounded-lg font-bold transition-colors"
          >
            إتمام الشراء
          </Link>
          <Link
            href="/products"
            className="block text-center mt-2 text-[#007185] text-sm hover:text-[#c7511f] transition-colors"
          >
            متابعة التسوق
          </Link>
        </div>
      </div>
    </div>
  );
}
