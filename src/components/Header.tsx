"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((a: number, i: { quantity: number }) => a + i.quantity, 0));
      } catch {
        setCartCount(0);
      }
    };
    updateCart();
    const interval = setInterval(updateCart, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  const categories = [
    { name: "الكل", slug: "" },
    { name: "إلكترونيات", slug: "electronics" },
    { name: "موضة", slug: "fashion" },
    { name: "منزل ومطبخ", slug: "home-kitchen" },
    { name: "جمال وعناية", slug: "beauty-care" },
    { name: "سيارات", slug: "automotive" },
    { name: "رياضة", slug: "sports" },
    { name: "أطفال", slug: "kids" },
    { name: "صحة", slug: "health" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      {/* Main header */}
      <div className="bg-[#131921]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 flex-wrap">
          <Link href="/" className="text-2xl font-bold text-white shrink-0 ml-2">
            Nexora
          </Link>

          <form onSubmit={handleSearch} className="flex-1 min-w-[180px] flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في Nexora"
              className="w-full px-3 py-2 text-sm text-[#0f1111] bg-white rounded-r-lg focus:outline-none"
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] px-4 py-2 rounded-l-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>

          <div className="flex items-center gap-4 text-xs text-white shrink-0">
            <Link href="/orders" className="flex flex-col leading-tight hover:opacity-80 transition-opacity">
              <span className="text-gray-400">الطلبات</span>
              <span className="font-bold">طلباتي</span>
            </Link>
            <Link href="/cart" className="flex items-center gap-1 hover:opacity-80 transition-opacity relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#febd69] text-[#0f1111] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <div className="flex flex-col leading-tight">
                <span className="text-gray-400">السلة</span>
                <span className="font-bold">{cartCount > 0 ? `${cartCount} قطع` : "فارغة"}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary nav */}
      <nav className="bg-[#232f3e]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-4 overflow-x-auto text-sm">
          {categories.map(c => (
            <Link key={c.slug} href={c.slug ? `/products?cat=${c.slug}` : "/products"}
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap font-medium py-1">
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
