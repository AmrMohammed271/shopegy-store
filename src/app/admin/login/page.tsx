"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }
      localStorage.setItem("admin_user", username);
      router.push("/admin");
    } catch {
      setError("حدث خطأ في الاتصال");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #232f3e, #131921)" }}>
      <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-[#0f1111] mb-1">Nexora Admin</h1>
        <p className="text-[#565959] text-sm text-center mb-6">تسجيل الدخول إلى لوحة التحكم</p>
        {error && <p className="text-red-600 text-sm mb-4 text-center bg-red-50 rounded-lg py-2">{error}</p>}
        <div className="space-y-4">
          <input required value={username} onChange={e => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full border border-[#d5d9d9] rounded-lg px-4 py-3 text-[#0f1111] placeholder-gray-400 focus:outline-none focus:border-[#007185]" />
          <button type="submit" className="w-full bg-[#febd69] hover:bg-[#f3a847] text-[#0f1111] py-3 rounded-lg font-bold transition-colors">
            دخول
          </button>
        </div>
      </form>
    </div>
  );
}
