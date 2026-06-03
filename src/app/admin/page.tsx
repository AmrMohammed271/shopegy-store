"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<{ id: string; total: number; status: string; customerName: string; createdAt: string }[]>([]);

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(data => {
      setStats(prev => ({ ...prev, products: data.length }));
    });
    fetch("/api/orders").then(r => r.json()).then(data => {
      setStats(prev => ({
        ...prev,
        orders: data.length,
        revenue: data.reduce((s: number, o: { total: number }) => s + o.total, 0),
      }));
      setRecentOrders(data.slice(0, 5));
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة المعلومات</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">إجمالي المنتجات</p>
          <p className="text-3xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">إجمالي الطلبات</p>
          <p className="text-3xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-gray-500 text-sm">إجمالي الإيرادات</p>
          <p className="text-3xl font-bold">{stats.revenue.toFixed(2)} EGP</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Link href="/admin/products/new" className="bg-[#febd69] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#f3a847]">
          + إضافة منتج
        </Link>
        <Link href="/admin/orders" className="bg-[#131921] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#232f3e]">
          عرض الطلبات
        </Link>
      </div>

      <h2 className="font-bold text-lg mb-3">آخر الطلبات</h2>
      {recentOrders.length === 0 ? (
        <p className="text-gray-500">لا توجد طلبات بعد</p>
      ) : (
        <div className="bg-white rounded-lg border">
          {recentOrders.map((order) => (
            <div key={order.id} className="p-3 border-b last:border-0 flex justify-between items-center">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-500">#{order.id.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.total.toFixed(2)} EGP</p>
                <span className="text-xs text-gray-500">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
