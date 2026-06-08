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
        <h1 className="text-xl font-bold text-[#0f1111]">المنتجات</h1>
        <Link href="/admin/products/new" className="bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] px-4 py-2 rounded-lg font-bold text-sm transition-colors">
          + إضافة منتج
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#565959] border-b border-[#d5d9d9]">
              <th className="text-right py-3 px-4">المنتج</th>
              <th className="text-right py-3 px-4">السعر</th>
              <th className="text-right py-3 px-4">المخزون</th>
              <th className="text-right py-3 px-4">مميز</th>
              <th className="text-right py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-[#eaeded] hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-[#0f1111]">{p.name}</td>
                <td className="py-3 px-4 font-bold">{formatPrice(p.price)}</td>
                <td className="py-3 px-4">
                  <span className={p.stock > 0 ? "text-[#067d62]" : "text-red-600"}>{p.stock}</span>
                </td>
                <td className="py-3 px-4">{p.featured ? <span className="text-[#c7511f]">✓</span> : "—"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                      className="text-[#007185] hover:text-[#c7511f] transition-colors text-xs font-bold">تعديل</button>
                    <button onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:text-red-800 transition-colors text-xs font-bold">حذف</button>
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
