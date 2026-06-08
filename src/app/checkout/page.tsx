"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import shippingData from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

interface CartItem { id: string; name: string; price: number; quantity: number; }

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", governorate: "", shippingMethod: "standard" as "standard" | "express", paymentMethod: "cod" as "cod" | "fawry" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    if (c.length === 0) router.push("/cart");
    setCart(c);
  }, [router]);

  const governorate = shippingData.find(g => g.id === form.governorate);
  const shippingCost = governorate ? (form.shippingMethod === "express" ? governorate.express : governorate.standard) : 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingCost;

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.governorate) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart, subtotal, shippingCost, total,
          governorate: form.governorate, shippingMethod: form.shippingMethod, paymentMethod: form.paymentMethod,
          customerName: form.name, customerEmail: form.email, customerPhone: form.phone, customerAddress: form.address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("cart");
        setOrderId(data.id);
        setDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-7xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-[#0f1111] mb-2">تم تقديم الطلب بنجاح!</h1>
        <p className="text-[#565959] mb-2">رقم الطلب: <span className="text-[#c7511f] font-bold">#{orderId.slice(-8)}</span></p>
        <p className="text-[#565959] mb-8 text-sm">
          {form.paymentMethod === "fawry"
            ? "هتصلك رسالة تفاصيل الدفع عبر فوري. الطلب هاتوصله خلال 3-5 أيام."
            : "هنتواصل معاك لتأكيد الطلب. الطلب هاتوصله خلال 3-5 أيام."}
        </p>
        <button onClick={() => router.push("/")} className="bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] px-8 py-3 rounded-lg font-bold transition-colors">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0f1111] mb-6">إتمام الشراء</h1>
      <form onSubmit={submitOrder} className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-base text-[#0f1111] mb-4">📍 عنوان التوصيل</h2>
            <div className="space-y-3">
              <input required placeholder="الاسم الكامل" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="tel" placeholder="رقم الهاتف" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]" />
                <input type="email" placeholder="البريد الإلكتروني (اختياري)" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]" />
              </div>
              <select required value={form.governorate}
                onChange={e => setForm({ ...form, governorate: e.target.value })}
                className="w-full border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] focus:outline-none focus:border-[#007185]">
                <option value="">اختر المحافظة</option>
                {shippingData.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <textarea required placeholder="العنوان بالتفصيل (الشارع، المنطقة، رقم المبنى)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185] h-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-base text-[#0f1111] mb-4">🚚 طريقة الشحن</h2>
            <div className="space-y-3">
              {(["standard", "express"] as const).map(m => (
                <label key={m} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-all ${form.shippingMethod === m ? "border-[#febd69] bg-[#fef4e4]" : "border-[#d5d9d9] hover:border-gray-400"}`}>
                  <input type="radio" name="shipping" value={m} checked={form.shippingMethod === m}
                    onChange={e => setForm({ ...form, shippingMethod: e.target.value as "standard" | "express" })} className="accent-[#febd69]" />
                  <div className="flex-1">
                    <p className="font-medium text-[#0f1111]">{m === "standard" ? "شحن عادي" : "شحن سريع"}</p>
                    <p className="text-sm text-[#565959]">{m === "standard" ? "التوصيل خلال 3-5 أيام عمل" : "التوصيل خلال 1-2 يوم عمل"}</p>
                  </div>
                  <span className="font-bold text-[#c7511f]">{governorate ? formatPrice(m === "standard" ? governorate.standard : governorate.express) : "—"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-bold text-base text-[#0f1111] mb-4">💳 طريقة الدفع</h2>
            <div className="space-y-3">
              {([["cod", "الدفع عند الاستلام", "ادفع كاش لما تستلم الطلب"], ["fawry", "فوري (Fawry)", "ادفع عبر أي فرع فوري أو محفظة"]] as const).map(([v, title, desc]) => (
                <label key={v} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition-all ${form.paymentMethod === v ? "border-[#febd69] bg-[#fef4e4]" : "border-[#d5d9d9] hover:border-gray-400"}`}>
                  <input type="radio" name="payment" value={v} checked={form.paymentMethod === v}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value as "cod" | "fawry" })} className="accent-[#febd69]" />
                  <div>
                    <p className="font-medium text-[#0f1111]">{title}</p>
                    <p className="text-sm text-[#565959]">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-lg text-[#0f1111] mb-4">ملخص الطلب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#565959]">
                <span>المنتجات ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#565959]">
                <span>الشحن</span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : <span className="text-[#067d62]">مجاني</span>}</span>
              </div>
              <div className="border-t border-[#d5d9d9] pt-3 flex justify-between font-bold text-lg text-[#0f1111]">
                <span>الإجمالي</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="border-t border-[#d5d9d9] my-4 pt-4 space-y-1 text-xs text-[#565959]">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate">{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full mt-4 bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
