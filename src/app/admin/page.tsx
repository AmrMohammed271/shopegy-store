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
      <h1 className="text-2xl font-bold text-white mb-6">لوحة المعلومات</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "إجمالي المنتجات", value: stats.products, icon: "📦", color: "from-purple-500 to-pink-500" },
          { label: "إجمالي الطلبات", value: stats.orders, icon: "📋", color: "from-blue-500 to-cyan-500" },
          { label: "الإيرادات", value: formatPrice(stats.revenue), icon: "💰", color: "from-green-500 to-emerald-500" },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-6 card-hover">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-bold text-lg text-white mb-4">أحدث الطلبات</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="text-right py-2 px-3">العميل</th>
                  <th className="text-right py-2 px-3">الحالة</th>
                  <th className="text-right py-2 px-3">الإجمالي</th>
                  <th className="text-right py-2 px-3">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-3 text-white">{o.customerName}</td>
                    <td className="py-3 px-3">
                      <span className="text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full text-xs">{o.status}</span>
                    </td>
                    <td className="py-3 px-3 gradient-text font-bold">{formatPrice(o.total)}</td>
                    <td className="py-3 px-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
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
