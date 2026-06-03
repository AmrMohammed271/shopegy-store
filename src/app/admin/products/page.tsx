"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  featured: boolean;
  category?: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products").then(r => r.json()).then(setProducts);
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("متأكد من حذف هذا المنتج؟")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p.id !== id));
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المنتجات</h1>
        <Link href="/admin/products/new" className="bg-[#febd69] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#f3a847]">
          + إضافة منتج
        </Link>
      </div>
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-sm font-medium">الاسم</th>
              <th className="p-3 text-sm font-medium">السعر</th>
              <th className="p-3 text-sm font-medium">المخزون</th>
              <th className="p-3 text-sm font-medium">القسم</th>
              <th className="p-3 text-sm font-medium">مميز</th>
              <th className="p-3 text-sm font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price.toFixed(2)} EGP</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 text-sm text-gray-500">{p.category?.name || "-"}</td>
                <td className="p-3">{p.featured ? "⭐" : "-"}</td>
                <td className="p-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline text-sm ml-3">
                    تعديل
                  </Link>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:underline text-sm">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  لا توجد منتجات. <Link href="/admin/products/new" className="text-blue-600">أضف أول منتج</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
