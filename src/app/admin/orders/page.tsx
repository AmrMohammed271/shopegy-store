"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import shippingData from "@/lib/shipping";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  governorate: string;
  shippingMethod: string;
  paymentMethod: string;
  items: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: string;
}

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const governorateNames: Record<string, string> = {};
shippingData.forEach(g => { governorateNames[g.id] = g.name; });

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    router.refresh();
  };

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800", delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[s] || "bg-gray-100";
  };

  const getPaymentLabel = (m: string) => {
    const labels: Record<string, string> = { cod: "💰 الدفع عند الاستلام", fawry: "🏧 فوري" };
    return labels[m] || m;
  };

  const getShippingLabel = (m: string) => {
    return m === "express" ? "🚀 شحن سريع" : "🚚 شحن عادي";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">الطلبات ({orders.length})</h1>
      <div className="space-y-3">
        {orders.length === 0 && <p className="text-gray-500">لا توجد طلبات</p>}
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full text-right p-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-500">طلب #{order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
                <div className="flex gap-2 mt-1 text-xs">
                  <span className="text-gray-400">{getPaymentLabel(order.paymentMethod)}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">{getShippingLabel(order.shippingMethod)}</span>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold">{order.total.toFixed(2)} EGP</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                  {order.status === "pending" && "قيد الانتظار"}
                  {order.status === "confirmed" && "تم التأكيد"}
                  {order.status === "shipped" && "تم الشحن"}
                  {order.status === "delivered" && "تم التوصيل"}
                  {order.status === "cancelled" && "ملغي"}
                </span>
              </div>
            </button>
            {expanded === order.id && (
              <div className="px-4 pb-4 border-t pt-3 text-sm space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">👤 العميل</p>
                    <p>{order.customerName}</p>
                    <p dir="ltr">{order.customerPhone}</p>
                    {order.customerEmail && <p>{order.customerEmail}</p>}
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">📍 التوصيل</p>
                    <p>{governorateNames[order.governorate] || order.governorate}</p>
                    <p className="text-gray-600">{order.customerAddress}</p>
                    <p className="text-xs text-gray-400">{getShippingLabel(order.shippingMethod)}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">💳 الدفع</p>
                  <p>{getPaymentLabel(order.paymentMethod)}</p>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">📦 المنتجات</p>
                  {(() => {
                    try {
                      return JSON.parse(order.items).map((i: { name: string; quantity: number; price: number }, idx: number) => (
                        <p key={idx} className="text-gray-600">{i.name} x{i.quantity} — {(i.price * i.quantity).toFixed(2)} EGP</p>
                      ));
                    } catch { return <p className="text-gray-600">{order.items}</p>; }
                  })()}
                </div>

                <div className="flex justify-between text-sm border-t pt-2">
                  <span>المجموع الفرعي: {order.subtotal?.toFixed(2) || "—"} EGP</span>
                  <span>الشحن: {order.shippingCost?.toFixed(2) || "0.00"} EGP</span>
                  <span className="font-bold">الإجمالي: {order.total.toFixed(2)} EGP</span>
                </div>

                <div>
                  <p className="font-medium text-gray-700 mb-1">تحديث الحالة</p>
                  <div className="flex gap-2 flex-wrap">
                    {statuses.map((s) => (
                      <button key={s}
                        onClick={() => updateStatus(order.id, s)}
                        className={`px-3 py-1 rounded text-xs font-medium border ${order.status === s ? "bg-[#131921] text-white border-[#131921]" : "hover:bg-gray-100"}`}>
                        {s === "pending" && "قيد الانتظار"} {s === "confirmed" && "تأكيد"}
                        {s === "shipped" && "شحن"} {s === "delivered" && "توصيل"} {s === "cancelled" && "إلغاء"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
