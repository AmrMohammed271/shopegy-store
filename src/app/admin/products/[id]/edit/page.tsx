"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", stock: "0",
    images: "", categoryId: "", featured: false, rating: "0",
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetch(`/api/products`).then(r => r.json()).then(products => {
      const p = products.find((x: { id: string }) => x.id === params.id);
      if (p) {
        setForm({
          name: p.name, description: p.description,
          price: String(p.price), stock: String(p.stock),
          images: (() => { try { return JSON.parse(p.images).join(", "); } catch { return p.images || ""; } })(),
          categoryId: p.categoryId || "", featured: p.featured, rating: String(p.rating),
        });
      }
    });
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => {});
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const images = form.images ? form.images.split(",").map((s: string) => s.trim()).filter(Boolean) : ["/placeholder.svg"];
      await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">تعديل المنتج</h1>
      <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
        <input required placeholder="اسم المنتج" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        <textarea placeholder="وصف المنتج" value={form.description} rows={4}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" step="0.01" placeholder="السعر" value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <input type="number" placeholder="المخزون" value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <input placeholder="صور (روابط مفصولة بفاصلة)" value={form.images}
          onChange={e => setForm({ ...form, images: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        <div className="grid grid-cols-2 gap-4">
          <select value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
            <option value="" className="bg-gray-900">بدون قسم</option>
            {categories.map(c => <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>)}
          </select>
          <input type="number" step="0.1" max="5" placeholder="التقييم" value={form.rating}
            onChange={e => setForm({ ...form, rating: e.target.value })}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
        </div>
        <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
          <input type="checkbox" checked={form.featured}
            onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-purple-500" />
          <span>منتج مميز</span>
        </label>
        <div className="flex gap-3">
          <button type="submit" disabled={loading}
            className="gradient-bg text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50">
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
          <button type="button" onClick={() => router.push("/admin/products")}
            className="glass text-gray-300 px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
