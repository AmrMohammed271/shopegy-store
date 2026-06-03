"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string; name: string; price: number; stock: number;
  featured: boolean; slug: string; categoryName?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">المنتجات</h1>
        <Link href="/admin/products/new" className="gradient-bg text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
          + إضافة منتج
        </Link>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-white/10">
              <th className="text-right py-3 px-4">المنتج</th>
              <th className="text-right py-3 px-4">السعر</th>
              <th className="text-right py-3 px-4">المخزون</th>
              <th className="text-right py-3 px-4">مميز</th>
              <th className="text-right py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-white">{p.name}</td>
                <td className="py-3 px-4 gradient-text font-bold">{formatPrice(p.price)}</td>
                <td className="py-3 px-4">
                  <span className={p.stock > 0 ? "text-green-400" : "text-red-400"}>{p.stock}</span>
                </td>
                <td className="py-3 px-4">{p.featured ? <span className="text-yellow-400">✓</span> : "—"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                      className="text-purple-400 hover:text-purple-300 transition-colors text-xs font-bold">تعديل</button>
                    <button onClick={() => deleteProduct(p.id)}
                      className="text-red-400 hover:text-red-300 transition-colors text-xs font-bold">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
