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
      <h1 className="text-xl font-bold text-[#0f1111] mb-6">الطلبات</h1>
      {orders.length === 0 ? (
        <p className="text-[#565959] bg-white rounded-lg shadow-sm p-6">لا توجد طلبات بعد</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const gov = shippingData.find(g => g.id === order.governorate);
            const items: { name: string; quantity: number; price: number }[] = (() => { try { return JSON.parse(order.items); } catch { return []; } })();
            return (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <span className="text-[#565959] text-xs">#{order.id.slice(-8)}</span>
                    <p className="text-[#0f1111] font-bold">{order.customerName}</p>
                    <p className="text-[#565959] text-sm">{order.customerPhone} · {order.customerEmail}</p>
                  </div>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                    className="border border-[#d5d9d9] rounded-lg px-3 py-2 text-sm text-[#0f1111] focus:outline-none focus:border-[#007185]">
                    {statusList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <span className="text-[#565959]">العنوان</span>
                    <p className="text-[#0f1111]">{gov?.name || order.governorate}</p>
                    <p className="text-[#565959]">{order.customerAddress}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">الشحن</span>
                    <p className="text-[#0f1111]">{order.shippingMethod === "express" ? "سريع" : "عادي"}</p>
                    <p className="text-[#565959]">{formatPrice(order.shippingCost)}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">الدفع</span>
                    <p className="text-[#0f1111]">{order.paymentMethod === "fawry" ? "فوري" : "كاش"}</p>
                    <p className="text-[#565959]">{formatPrice(order.total)}</p>
                  </div>
                  <div>
                    <span className="text-[#565959]">التاريخ</span>
                    <p className="text-[#0f1111]">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                </div>
                <details className="text-sm">
                  <summary className="text-[#007185] cursor-pointer hover:text-[#c7511f]">المنتجات ({items.length})</summary>
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
