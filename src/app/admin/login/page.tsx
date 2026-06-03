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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0a0a1a, #1a1a3e)" }}>
      <form onSubmit={handleLogin} className="glass rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">
          <span className="gradient-text">Nexora</span>
          <span className="text-white"> Admin</span>
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">تسجيل الدخول إلى لوحة التحكم</p>
        {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-500/10 rounded-lg py-2">{error}</p>}
        <div className="space-y-4">
          <input required value={username} onChange={e => setUsername(e.target.value)}
            placeholder="اسم المستخدم"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <input required type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
          <button type="submit" className="w-full gradient-bg text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all">
            دخول
          </button>
        </div>
      </form>
    </div>
  );
}
