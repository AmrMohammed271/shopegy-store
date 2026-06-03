export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const errors: string[] = [];
  
  // Test 1: Environment variable
  errors.push(`DATABASE_URL موجود: ${!!process.env.DATABASE_URL}`);
  if (process.env.DATABASE_URL) {
    errors.push(`DATABASE_URL يبدأ بـ: ${process.env.DATABASE_URL.substring(0, 20)}...`);
  }

  // Test 2: Import neon
  try {
    const mod = await import("@neondatabase/serverless");
    errors.push(`@neondatabase/serverless: تم الاستيراد بنجاح`);
  } catch (e: any) {
    errors.push(`@neondatabase/serverless خطأ: ${e.message}`);
  }

  // Test 3: Connect to PG
  if (process.env.DATABASE_URL) {
    try {
      const { Pool } = await import("@neondatabase/serverless");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const r = await pool.query("SELECT 1 AS test");
      errors.push(`اتصال PG: نجاح — ${JSON.stringify(r.rows[0])}`);
      
      // Test 4: Try creating table
      try {
        await pool.query("SELECT 1 FROM categories LIMIT 1");
        errors.push(`جدول categories: موجود`);
      } catch {
        errors.push(`جدول categories: مش موجود — هحاول أنشئه`);
        try {
          await pool.query(`CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, image TEXT
          )`);
          errors.push(`إنشاء categories: نجاح`);
        } catch (e2: any) {
          errors.push(`إنشاء categories: خطأ — ${e2.message}`);
        }
      }
    } catch (e: any) {
      errors.push(`اتصال PG خطأ: ${e.message}`);
    }
  }

  return (
    <div dir="ltr" className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-4">🔍 Debug Info</h1>
      <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap">
        {errors.join("\n")}
      </pre>
    </div>
  );
}
