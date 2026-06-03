"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/products?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header>
      <div className="bg-[#131921] text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4 flex-wrap">
          <Link href="/" className="text-2xl font-bold text-[#febd69] shrink-0">
            Shop<span className="text-white">Egy</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full px-3 py-2 text-black rounded-r-md focus:outline-none"
            />
            <button type="submit" className="bg-[#febd69] text-black px-4 py-2 rounded-l-md font-bold hover:bg-[#f3a847]">
              بحث
            </button>
          </form>

          <div className="flex items-center gap-4 text-sm">
            <Link href="/orders" className="hover:text-[#febd69]">طلباتي</Link>
            <Link href="/cart" className="relative hover:text-[#febd69]">
              🛒 سلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#febd69] text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-[#232f3e] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-4 overflow-x-auto">
          <Link href="/products" className="hover:text-[#febd69] whitespace-nowrap">الكل</Link>
          <Link href="/products?cat=electronics" className="hover:text-[#febd69] whitespace-nowrap">إلكترونيات</Link>
          <Link href="/products?cat=fashion" className="hover:text-[#febd69] whitespace-nowrap">موضة</Link>
          <Link href="/products?cat=home" className="hover:text-[#febd69] whitespace-nowrap">منزل</Link>
          <Link href="/products?cat=beauty" className="hover:text-[#febd69] whitespace-nowrap">جمال</Link>
          <Link href="/products?cat=auto" className="hover:text-[#febd69] whitespace-nowrap">سيارات</Link>
          <Link href="/products?cat=sports" className="hover:text-[#febd69] whitespace-nowrap">رياضة</Link>
        </div>
      </nav>
    </header>
  );
}
