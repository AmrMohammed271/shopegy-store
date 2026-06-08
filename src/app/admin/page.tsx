"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<{ id: string; total: number; status: string; customerName: string; createdAt: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/orders").then(r => r.json()),
    ]).then(([products, orders]) => {
      setStats({
        products: products.length,
        orders: orders.length,
        revenue: orders.reduce((s: number, o: any) => s + o.total, 0),
      });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-[#0f1111] mb-6">لوحة المعلومات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "إجمالي المنتجات", value: stats.products, color: "bg-[#fef4e4] text-[#c7511f]" },
          { label: "إجمالي الطلبات", value: stats.orders, color: "bg-[#e8f4f8] text-[#007185]" },
          { label: "الإيرادات", value: formatPrice(stats.revenue), color: "bg-[#e8f8f4] text-[#067d62]" },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-lg p-6 shadow-sm`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-bold text-base text-[#0f1111] mb-4">أحدث الطلبات</h2>
        {recentOrders.length === 0 ? (
          <p className="text-[#565959] text-sm">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#565959] border-b border-[#d5d9d9]">
                  <th className="text-right py-2 px-3">العميل</th>
                  <th className="text-right py-2 px-3">الحالة</th>
                  <th className="text-right py-2 px-3">الإجمالي</th>
                  <th className="text-right py-2 px-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-[#eaeded] hover:bg-gray-50">
                    <td className="py-3 px-3 text-[#0f1111]">{o.customerName}</td>
                    <td className="py-3 px-3">
                      <span className="text-[#c7511f] bg-[#fef4e4] px-2 py-0.5 rounded-full text-xs">{o.status}</span>
                    </td>
                    <td className="py-3 px-3 font-bold">{formatPrice(o.total)}</td>
                    <td className="py-3 px-3 text-[#565959]">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
