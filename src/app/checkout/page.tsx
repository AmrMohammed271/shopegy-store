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
        <h1 className="text-2xl font-bold text-white mb-2">تم تقديم الطلب بنجاح!</h1>
        <p className="text-gray-400 mb-2">رقم الطلب: <span className="text-purple-400 font-bold">#{orderId.slice(-8)}</span></p>
        <p className="text-gray-500 mb-8 text-sm">
          {form.paymentMethod === "fawry"
            ? "هتصلك رسالة تفاصيل الدفع عبر فوري. الطلب هاتوصله خلال 3-5 أيام."
            : "هنتواصل معاك لتأكيد الطلب. الطلب هاتوصله خلال 3-5 أيام."}
        </p>
        <button onClick={() => router.push("/")} className="gradient-bg text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8">إتمام الشراء</h1>
      <form onSubmit={submitOrder} className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="glass rounded-xl p-6">
            <h2 className="font-bold text-lg text-white mb-4">📍 عنوان التوصيل</h2>
            <div className="space-y-3">
              <input required placeholder="الاسم الكامل" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="tel" placeholder="رقم الهاتف" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
                <input type="email" placeholder="البريد الإلكتروني (اختياري)" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
              </div>
              <select required value={form.governorate}
                onChange={e => setForm({ ...form, governorate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <option value="" className="bg-gray-900">اختر المحافظة</option>
                {shippingData.map(g => (
                  <option key={g.id} value={g.id} className="bg-gray-900">{g.name}</option>
                ))}
              </select>
              <textarea required placeholder="العنوان بالتفصيل (الشارع، المنطقة، رقم المبنى)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 h-20" />
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-bold text-lg text-white mb-4">🚚 طريقة الشحن</h2>
            <div className="space-y-3">
              {(["standard", "express"] as const).map(m => (
                <label key={m} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${form.shippingMethod === m ? "gradient-border bg-white/5" : "bg-white/5 hover:bg-white/10 border border-white/5"}`}>
                  <input type="radio" name="shipping" value={m} checked={form.shippingMethod === m}
                    onChange={e => setForm({ ...form, shippingMethod: e.target.value as "standard" | "express" })} className="accent-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium text-white">{m === "standard" ? "شحن عادي" : "شحن سريع"}</p>
                    <p className="text-sm text-gray-500">{m === "standard" ? "التوصيل خلال 3-5 أيام عمل" : "التوصيل خلال 1-2 يوم عمل"}</p>
                  </div>
                  <span className="font-bold text-purple-400">{governorate ? formatPrice(m === "standard" ? governorate.standard : governorate.express) : "—"}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <h2 className="font-bold text-lg text-white mb-4">💳 طريقة الدفع</h2>
            <div className="space-y-3">
              {([["cod", "💰 الدفع عند الاستلام", "ادفع كاش لما تستلم الطلب"], ["fawry", "🏧 فوري (Fawry)", "ادفع عبر أي فرع فوري أو محفظة"]] as const).map(([v, title, desc]) => (
                <label key={v} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${form.paymentMethod === v ? "gradient-border bg-white/5" : "bg-white/5 hover:bg-white/10 border border-white/5"}`}>
                  <input type="radio" name="payment" value={v} checked={form.paymentMethod === v}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value as "cod" | "fawry" })} className="accent-purple-500" />
                  <div>
                    <p className="font-medium text-white">{title}</p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="glass rounded-xl p-6 sticky top-24">
            <h2 className="font-bold text-lg text-white mb-4">ملخص الطلب</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>المنتجات ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>الشحن</span>
                <span>{shippingCost > 0 ? formatPrice(shippingCost) : <span className="text-green-400">مجاني</span>}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                <span className="text-white">الإجمالي</span>
                <span className="gradient-text">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="border-t border-white/10 my-4 pt-4 space-y-1 text-xs text-gray-500">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate">{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full mt-4 gradient-bg text-white py-3.5 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-glow">
              {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
