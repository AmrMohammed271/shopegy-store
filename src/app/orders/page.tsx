"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import shippingData from "@/lib/shipping";

interface Order {
  id: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  governorate: string;
  shippingMethod: string;
  paymentMethod: string;
  status: string;
  customerName: string;
  items: string;
  createdAt: string;
}

const governorateNames: Record<string, string> = {};
shippingData.forEach(g => { governorateNames[g.id] = g.name; });

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
      setOrders(await res.json());
    } finally { setLoading(false); }
  };

  const statusColors: Record<string, string> = {
    pending: "text-yellow-600 bg-yellow-50", confirmed: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50", delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
  };

  const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار", confirmed: "تم التأكيد", shipped: "تم الشحن", delivered: "تم التوصيل", cancelled: "ملغي",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">طلباتي</h1>
      <form onSubmit={searchOrders} className="flex gap-2 mb-6">
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="ادخل رقم الهاتف للبحث عن طلباتك" className="flex-1 border rounded-lg px-4 py-3" required />
        <button type="submit" disabled={loading}
          className="bg-[#131921] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#232f3e] disabled:bg-gray-400">
          {loading ? "...بحث" : "بحث"}
        </button>
      </form>

      {orders && orders.length === 0 && <p className="text-center text-gray-500 py-8">لا توجد طلبات بهذا الرقم</p>}

      {orders && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-4 border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">طلب #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                  {statusLabels[order.status] || order.status}
                </span>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                {(() => { try { return JSON.parse(order.items).map((i: { name: string; quantity: number }) => `${i.name} x${i.quantity}`).join("، "); } catch { return order.items; } })()}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-2">
                <span>📍 {governorateNames[order.governorate] || order.governorate}</span>
                <span>🚚 {order.shippingMethod === "express" ? "شحن سريع" : "شحن عادي"}</span>
                <span>💳 {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "فوري"}</span>
              </div>

              <div className="flex justify-between items-center border-t pt-2">
                <span className="text-xs text-gray-400">الشحن: {order.shippingCost?.toFixed(2) || "0.00"} EGP</span>
                <p className="font-bold text-lg">{order.total.toFixed(2)} EGP</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!orders && <p className="text-center text-gray-400 py-8">أدخل رقم هاتفك لمشاهدة طلباتك السابقة</p>}
      <div className="text-center mt-8"><Link href="/products" className="text-blue-600 hover:underline">تصفح المنتجات</Link></div>
    </div>
  );
}
