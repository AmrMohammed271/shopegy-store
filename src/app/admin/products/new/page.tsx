"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "10",
    images: "", categoryId: "", featured: false, rating: "0",
  });

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : ["/placeholder.svg"];
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      if (res.ok) router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">إضافة منتج جديد</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border space-y-4">
        <input required placeholder="اسم المنتج" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded-lg px-3 py-2" />
        <textarea placeholder="وصف المنتج" value={form.description} rows={4}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2" />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" step="0.01" placeholder="السعر (EGP)" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="border rounded-lg px-3 py-2" />
          <input type="number" placeholder="المخزون" value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            className="border rounded-lg px-3 py-2" />
        </div>
        <input placeholder="صور (روابط مفصولة بفاصلة)" value={form.images}
          onChange={e => setForm({ ...form, images: e.target.value })}
          className="w-full border rounded-lg px-3 py-2" />
        <div className="grid grid-cols-2 gap-4">
          <select value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            className="border rounded-lg px-3 py-2">
            <option value="">بدون قسم</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" step="0.1" max="5" placeholder="التقييم (0-5)" value={form.rating}
            onChange={e => setForm({ ...form, rating: e.target.value })}
            className="border rounded-lg px-3 py-2" />
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.featured}
            onChange={e => setForm({ ...form, featured: e.target.checked })} />
          <span>منتج مميز (يظهر في الرئيسية)</span>
        </label>
        <button type="submit" disabled={loading}
          className="bg-[#febd69] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#f3a847] disabled:bg-gray-300">
          {loading ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
      </form>
    </div>
  );
}
