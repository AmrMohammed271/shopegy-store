"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-2">سلتك فارغة</h1>
        <p className="text-gray-500 mb-6">أضف منتجات إلى سلتك وارجع لإتمام الشراء</p>
        <Link href="/products" className="inline-block bg-[#febd69] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#f3a847]">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">سلّة التسوق ({cart.length})</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 flex gap-4 items-center border">
              <img
                src={(() => { try { return JSON.parse(item.images)[0]; } catch { return item.images || "/placeholder.svg"; } })()}
                alt={item.name}
                className="w-20 h-20 object-contain rounded"
              />
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-blue-600 line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-lg font-bold mt-1">{item.price.toFixed(2)} EGP</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-full border hover:bg-gray-100 text-lg">−</button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-full border hover:bg-gray-100 text-lg">+</button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold">{(item.price * item.quantity).toFixed(2)} EGP</p>
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline">حذف</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-6 border h-fit">
          <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>المنتجات ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>الشحن</span>
              <span className="text-green-600">مجاني</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي</span>
              <span>{total.toFixed(2)} EGP</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block text-center mt-4 bg-[#febd69] text-black py-3 rounded-lg font-bold hover:bg-[#f3a847] transition-colors"
          >
            إتمام الشراء
          </Link>
        </div>
      </div>
    </div>
  );
}
