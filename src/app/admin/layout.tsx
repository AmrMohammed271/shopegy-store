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

  if (pathname === "/admin/login") return <>{children}</>;

  if (!authed) return null;

  const logout = () => {
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(135deg, #0a0a1a, #1a1a3e)" }}>
      <aside className="w-56 glass p-4 shrink-0 border-l border-white/10">
        <Link href="/admin" className="text-xl font-bold block mb-6">
          <span className="gradient-text">Nexora</span>
          <span className="text-white"> Admin</span>
        </Link>
        <nav className="space-y-1">
          <Link href="/admin" className="block px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">لوحة المعلومات</Link>
          <Link href="/admin/products" className="block px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">المنتجات</Link>
          <Link href="/admin/orders" className="block px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-all">الطلبات</Link>
          <hr className="border-white/10 my-2" />
          <Link href="/" className="block px-3 py-2.5 rounded-xl hover:bg-white/5 text-sm text-gray-500 hover:text-white transition-all">→ المتجر</Link>
          <button onClick={logout} className="w-full text-right px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-sm text-red-400 transition-all">
            تسجيل خروج
          </button>
        </nav>
      </aside>
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
