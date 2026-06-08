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

const statusMap: Record<string, { label: string; color: string; bg: string; step: number }> = {
  pending: { label: "قيد الانتظار", color: "text-[#c7511f]", bg: "bg-[#fef4e4]", step: 1 },
  confirmed: { label: "تم التأكيد", color: "text-[#007185]", bg: "bg-[#e8f4f8]", step: 2 },
  shipped: { label: "تم الشحن", color: "text-purple-600", bg: "bg-purple-50", step: 3 },
  delivered: { label: "تم التوصيل", color: "text-[#067d62]", bg: "bg-[#e8f8f4]", step: 4 },
  cancelled: { label: "ملغي", color: "text-red-600", bg: "bg-red-50", step: 0 },
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
      <h1 className="text-xl md:text-2xl font-bold text-[#0f1111] mb-6">🔍 تتبع طلباتك</h1>

      <form onSubmit={searchOrders} className="flex gap-2 mb-8">
        <input
          type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="أدخل رقم الهاتف"
          className="flex-1 border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]"
        />
        <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] px-6 py-3 rounded-lg font-bold transition-colors">
          بحث
        </button>
      </form>

      {searched && orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-[#565959]">لا توجد طلبات بهذا الرقم</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map(order => {
            const st = statusMap[order.status] || statusMap.pending;
            const gov = shippingData.find(g => g.id === order.governorate);
            const items: { name: string; quantity: number; price: number }[] = (() => { try { return JSON.parse(order.items); } catch { return []; } })();

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[#565959] text-xs">رقم الطلب</span>
                    <p className="text-[#0f1111] font-bold">#{order.id.slice(-8)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${st.color} ${st.bg}`}>{st.label}</span>
                </div>

                {/* Progress */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4].map(s => (
                    <div key={s} className={`flex-1 h-1.5 rounded-full ${st.step >= s ? "bg-[#febd69]" : "bg-gray-200"}`} />
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-[#565959]">العميل</span>
                    <p className="text-[#0f1111]">{order.customerName}</p>
                    <p className="text-[#565959]">{order.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">المحافظة</span>
                    <p className="text-[#0f1111]">{gov?.name || order.governorate}</p>
                    <p className="text-[#565959]">{order.shippingMethod === "express" ? "شحن سريع" : "شحن عادي"}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">الدفع</span>
                    <p className="text-[#0f1111]">{order.paymentMethod === "fawry" ? "فوري" : "كاش"}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">الإجمالي</span>
                    <p className="text-lg font-bold text-[#0f1111]">{formatPrice(order.total)}</p>
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="text-[#007185] cursor-pointer hover:text-[#c7511f]">المنتجات</summary>
                  <div className="mt-2 space-y-1 text-[#565959]">
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
