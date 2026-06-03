"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import shippingData from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string; total: number; subtotal: number; shippingCost: number;
  governorate: string; shippingMethod: string; paymentMethod: string;
  status: string; customerName: string; customerPhone: string;
  items: string; createdAt: string;
}

const statusMap: Record<string, { label: string; color: string; step: number }> = {
  pending: { label: "قيد الانتظار", color: "text-yellow-400", step: 1 },
  confirmed: { label: "تم التأكيد", color: "text-blue-400", step: 2 },
  shipped: { label: "تم الشحن", color: "text-purple-400", step: 3 },
  delivered: { label: "تم التوصيل", color: "text-green-400", step: 4 },
  cancelled: { label: "ملغي", color: "text-red-400", step: 0 },
};

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.trim())}`);
    const data = await res.json();
    setOrders(data);
    setSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">🔍 تتبع طلباتك</h1>

      <form onSubmit={searchOrders} className="flex gap-2 mb-8">
        <input
          type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="أدخل رقم الهاتف"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button type="submit" className="gradient-bg text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all">
          بحث
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-12 glass rounded-xl">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-400">لا توجد طلبات بهذا الرقم</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => {
            const st = statusMap[order.status] || statusMap.pending;
            const gov = shippingData.find(g => g.id === order.governorate);
            const items: { name: string; quantity: number; price: number }[] = (() => { try { return JSON.parse(order.items); } catch { return []; } })();

            return (
              <div key={order.id} className="glass rounded-xl p-6 card-hover">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-gray-400 text-sm">رقم الطلب</span>
                    <p className="text-white font-bold">#{order.id.slice(-8)}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${st.color} bg-white/5`}>{st.label}</span>
                </div>

                {/* Progress steps */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full ${st.step >= s ? "gradient-bg" : "bg-white/10"}`} />
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">العميل</span>
                    <p className="text-white">{order.customerName}</p>
                    <p className="text-gray-400">{order.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">المحافظة</span>
                    <p className="text-white">{gov?.name || order.governorate}</p>
                    <p className="text-gray-400">{order.shippingMethod === "express" ? "شحن سريع" : "شحن عادي"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">الدفع</span>
                    <p className="text-white">{order.paymentMethod === "fawry" ? "فوري" : "كاش"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">الإجمالي</span>
                    <p className="text-lg font-bold gradient-text">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="text-purple-400 cursor-pointer hover:text-purple-300">المنتجات</summary>
                  <div className="mt-2 space-y-1 text-gray-400">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
