"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import shippingData from "@/lib/shipping";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

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
          items: cart,
          subtotal,
          shippingCost,
          total,
          governorate: form.governorate,
          shippingMethod: form.shippingMethod,
          paymentMethod: form.paymentMethod,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          customerAddress: form.address,
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
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">تم تقديم الطلب بنجاح!</h1>
        <p className="text-gray-500 mb-2">رقم الطلب: #{orderId.slice(-8)}</p>
        <p className="text-gray-500 mb-6">
          {form.paymentMethod === "fawry"
            ? "هتصلك رسالة على واتساب برقم فوري للدفع. هاتوصلك خلال 3-5 أيام."
            : "هنتواصل معاك لتأكيد الطلب والتوصيل. هاتوصلك خلال 3-5 أيام."}
        </p>
        <button onClick={() => router.push("/")} className="bg-[#febd69] text-black px-6 py-3 rounded-lg font-bold">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">إتمام الشراء</h1>
      <form onSubmit={submitOrder} className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="font-bold text-lg mb-4">📍 عنوان التوصيل</h2>
            <div className="space-y-3">
              <input required placeholder="الاسم الكامل" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2" />

              <div className="grid grid-cols-2 gap-3">
                <input required type="tel" placeholder="رقم الهاتف" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="border rounded-lg px-3 py-2" />
                <input type="email" placeholder="البريد الإلكتروني (اختياري)" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="border rounded-lg px-3 py-2" />
              </div>

              <select required value={form.governorate}
                onChange={e => setForm({ ...form, governorate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2">
                <option value="">اختر المحافظة</option>
                {shippingData.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <textarea required placeholder="العنوان بالتفصيل (الشارع، المنطقة، رقم المبنى)" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 h-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <h2 className="font-bold text-lg mb-4">🚚 طريقة الشحن</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${form.shippingMethod === "standard" ? "border-[#febd69] bg-yellow-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="shipping" value="standard" checked={form.shippingMethod === "standard"}
                  onChange={e => setForm({ ...form, shippingMethod: e.target.value as "standard" })} />
                <div className="flex-1">
                  <p className="font-medium">شحن عادي</p>
                  <p className="text-sm text-gray-500">التوصيل خلال 3-5 أيام عمل</p>
                </div>
                <span className="font-bold">{governorate ? `${governorate.standard} EGP` : "—"}</span>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${form.shippingMethod === "express" ? "border-[#febd69] bg-yellow-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="shipping" value="express" checked={form.shippingMethod === "express"}
                  onChange={e => setForm({ ...form, shippingMethod: e.target.value as "express" })} />
                <div className="flex-1">
                  <p className="font-medium">شحن سريع</p>
                  <p className="text-sm text-gray-500">التوصيل خلال 1-2 يوم عمل</p>
                </div>
                <span className="font-bold">{governorate ? `${governorate.express} EGP` : "—"}</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <h2 className="font-bold text-lg mb-4">💳 طريقة الدفع</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${form.paymentMethod === "cod" ? "border-[#febd69] bg-yellow-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="payment" value="cod" checked={form.paymentMethod === "cod"}
                  onChange={e => setForm({ ...form, paymentMethod: e.target.value as "cod" })} />
                <div>
                  <p className="font-medium">💰 الدفع عند الاستلام</p>
                  <p className="text-sm text-gray-500">ادفع كاش لما تستلم الطلب</p>
                </div>
              </label>
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${form.paymentMethod === "fawry" ? "border-[#febd69] bg-yellow-50" : "hover:bg-gray-50"}`}>
                <input type="radio" name="payment" value="fawry" checked={form.paymentMethod === "fawry"}
                  onChange={e => setForm({ ...form, paymentMethod: e.target.value as "fawry" })} />
                <div>
                  <p className="font-medium">🏧 فوري (Fawry)</p>
                  <p className="text-sm text-gray-500">ادفع عبر أي فرع فوري أو محفظة</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-6 border sticky top-4">
            <h2 className="font-bold text-lg mb-4">ملخص الطلب</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>المنتجات ({cart.reduce((a, i) => a + i.quantity, 0)})</span>
                <span>{subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span>الشحن</span>
                <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} EGP` : "—"}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>الإجمالي</span>
                <span>{total.toFixed(2)} EGP</span>
              </div>
            </div>

            <hr className="my-4" />
            <div className="space-y-1 text-xs text-gray-500">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate">{item.name} x{item.quantity}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
                </div>
              ))}
            </div>

            <button type="submit" disabled={submitting}
              className="w-full mt-4 bg-[#febd69] text-black py-3 rounded-lg font-bold text-lg hover:bg-[#f3a847] transition-colors disabled:bg-gray-300">
              {submitting ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
