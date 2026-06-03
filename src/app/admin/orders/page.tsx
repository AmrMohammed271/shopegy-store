"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import shippingData from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string; total: number; subtotal: number; shippingCost: number;
  governorate: string; shippingMethod: string; paymentMethod: string;
  status: string; customerName: string; customerEmail: string;
  customerPhone: string; customerAddress: string; items: string; createdAt: string;
}

const statusList = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">الطلبات</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500 glass rounded-xl p-6">لا توجد طلبات بعد</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const gov = shippingData.find(g => g.id === order.governorate);
            const items: { name: string; quantity: number; price: number }[] = (() => { try { return JSON.parse(order.items); } catch { return []; } })();
            return (
              <div key={order.id} className="glass rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-gray-500 text-xs">#{order.id.slice(-8)}</span>
                    <p className="text-white font-bold">{order.customerName}</p>
                    <p className="text-gray-400 text-sm">{order.customerPhone} · {order.customerEmail}</p>
                  </div>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                    {statusList.map(s => (
                      <option key={s} value={s} className="bg-gray-900">{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">العنوان</span>
                    <p className="text-white">{gov?.name || order.governorate}</p>
                    <p className="text-gray-400">{order.customerAddress}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">الشحن</span>
                    <p className="text-white">{order.shippingMethod === "express" ? "سريع" : "عادي"}</p>
                    <p className="text-gray-400">{formatPrice(order.shippingCost)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">الدفع</span>
                    <p className="text-white">{order.paymentMethod === "fawry" ? "فوري" : "كاش"}</p>
                    <p className="text-gray-400">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">التاريخ</span>
                    <p className="text-white">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>
                <details className="text-sm">
                  <summary className="text-purple-400 cursor-pointer">المنتجات ({items.length})</summary>
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
