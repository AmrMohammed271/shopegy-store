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

  const navItems = [
    { href: "/admin", label: "لوحة المعلومات" },
    { href: "/admin/products", label: "المنتجات" },
    { href: "/admin/orders", label: "الطلبات" },
  ];

  return (
    <div className="flex min-h-screen bg-[#eaeded]">
      <aside className="w-56 bg-[#232f3e] p-4 shrink-0 border-l border-white/10">
        <Link href="/admin" className="text-xl font-bold block mb-6 text-white">
          Nexora Admin
        </Link>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                pathname === item.href ? "bg-white/10 text-[#febd69]" : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}>
              {item.label}
            </Link>
          ))}
          <hr className="border-white/10 my-2" />
          <Link href="/" className="block px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-white/5 hover:text-white transition-colors">→ المتجر</Link>
          <button onClick={logout} className="w-full text-right px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            تسجيل خروج
          </button>
        </nav>
      </aside>
      <div className="flex-1 p-6 overflow-auto">{children}</div>
    </div>
  );
}
