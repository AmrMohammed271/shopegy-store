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

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a1a]/95 backdrop-blur-lg shadow-lg shadow-purple-900/20" : ""}`}>
      <div className="hero-gradient">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap relative z-10">
          <Link href="/" className="text-2xl font-bold shrink-0">
            <span className="gradient-text">Nexora</span>
            <span className="text-white"> E-Shop</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full px-4 py-2.5 bg-white/10 text-white placeholder-gray-400 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10 backdrop-blur-sm"
            />
            <button type="submit" className="gradient-bg text-white px-5 py-2.5 rounded-l-xl font-bold hover:opacity-90 transition-opacity">
              بحث
            </button>
          </form>

          <div className="flex items-center gap-5 text-sm">
            <Link href="/orders" className="text-gray-300 hover:text-purple-400 transition-colors">طلباتي</Link>
            <Link href="/cart" className="relative text-gray-300 hover:text-purple-400 transition-colors">
              <svg className="w-6 h-6 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 gradient-bg text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse-glow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="glass border-t-0">
        <div className="max-w-7xl mx-auto px-4 py-2 flex gap-6 overflow-x-auto text-sm">
          <Link href="/products" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap font-medium">الكل</Link>
          <Link href="/products?cat=electronics" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">إلكترونيات</Link>
          <Link href="/products?cat=fashion" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">موضة</Link>
          <Link href="/products?cat=home-kitchen" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">منزل</Link>
          <Link href="/products?cat=beauty-care" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">جمال</Link>
          <Link href="/products?cat=automotive" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">سيارات</Link>
          <Link href="/products?cat=sports" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">رياضة</Link>
          <Link href="/products?cat=kids" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">أطفال</Link>
          <Link href="/products?cat=health" className="text-gray-300 hover:text-purple-400 transition-colors whitespace-nowrap">صحة</Link>
        </div>
      </nav>
    </header>
  );
}
