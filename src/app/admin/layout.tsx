"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (!user && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else if (user) {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (pathname === "/admin/login") return children;

  if (!authed) return null;

  const logout = () => {
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-56 bg-[#131921] text-white p-4 shrink-0">
        <Link href="/admin" className="text-xl font-bold text-[#febd69] block mb-6">لوحة التحكم</Link>
        <nav className="space-y-2">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-[#232f3e] text-sm">لوحة المعلومات</Link>
          <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-[#232f3e] text-sm">المنتجات</Link>
          <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-[#232f3e] text-sm">الطلبات</Link>
          <hr className="border-gray-700 my-2" />
          <Link href="/" className="block px-3 py-2 rounded hover:bg-[#232f3e] text-sm text-gray-400">→ المتجر</Link>
          <button onClick={logout} className="w-full text-right px-3 py-2 rounded hover:bg-red-800 text-sm text-red-400">
            تسجيل خروج
          </button>
        </nav>
      </aside>
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
