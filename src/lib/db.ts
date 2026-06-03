type Row = Record<string, unknown>;

let pgPool: any = null;
async function getPgPool() {
  if (!pgPool) {
    const { Pool } = await import("@neondatabase/serverless");
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pgPool;
}

let pgInitialized = false;

async function ensurePgInit() {
  if (pgInitialized) return;
  const pool = await getPgPool();
  try {
    // Check if lowercase columns exist (new schema)
    await pool.query("SELECT categoryid FROM products LIMIT 1");
    pgInitialized = true;
    return;
  } catch {
    // old schema or missing tables — recreate
  }
  // Drop old tables if they have wrong column casing, then recreate
  await pool.query("DROP TABLE IF EXISTS orders");
  await pool.query("DROP TABLE IF EXISTS products");
  await pool.query("DROP TABLE IF EXISTS categories");
  await pool.query("DROP TABLE IF EXISTS admin_users");
  const schema = `
    CREATE TABLE categories (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, image TEXT
    );
    CREATE TABLE products (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '', price REAL NOT NULL,
      images TEXT DEFAULT '["/placeholder.svg"]', stock INTEGER DEFAULT 0,
      categoryid TEXT, featured INTEGER DEFAULT 0, rating REAL DEFAULT 0,
      createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (categoryid) REFERENCES categories(id)
    );
    CREATE TABLE orders (
      id TEXT PRIMARY KEY, items TEXT NOT NULL, total REAL NOT NULL,
      subtotal REAL DEFAULT 0, shippingcost REAL DEFAULT 0,
      governorate TEXT DEFAULT '', shippingmethod TEXT DEFAULT 'standard',
      paymentmethod TEXT DEFAULT 'cod', status TEXT DEFAULT 'pending',
      customername TEXT NOT NULL, customeremail TEXT DEFAULT '',
      customerphone TEXT NOT NULL, customeraddress TEXT NOT NULL,
      createdat TIMESTAMP DEFAULT NOW(), updatedat TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE admin_users (
      id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL
    );
    INSERT INTO admin_users (id, username, password) VALUES
      (gen_random_uuid()::text, 'admin', '$2b$10$dcTAx3v.wBNjHkMH8tJdk.yi56WUvqNUoXiWnpsdQAXbTm032ngHa')
      ON CONFLICT (username) DO NOTHING;
    INSERT INTO categories (id, name, slug, image) VALUES
      ('cat-1','إلكترونيات','electronics',NULL),('cat-2','سيارات ودراجات','automotive',NULL),
      ('cat-3','المنزل والمطبخ','home-kitchen',NULL),('cat-4','الجمال والعناية','beauty-care',NULL),
      ('cat-5','أزياء','fashion',NULL),('cat-6','الصحة','health',NULL),
      ('cat-7','أطفال','kids',NULL),('cat-8','رياضة','sports',NULL)
      ON CONFLICT (id) DO NOTHING;
    INSERT INTO products (id,name,slug,description,price,images,stock,categoryid,featured,rating) VALUES
      ('p-1','ساعة ذكية ابل واتش سيريس 9','apple-watch-series-9','ساعة ذكية من ابل - أحدث إصدار',24999,'["https://picsum.photos/seed/watch1/400/400"]',50,'cat-1',1,4.8),
      ('p-2','سماعات لاسلكية ابل ايربودز برو 2','airpods-pro-2','سماعات لاسلكية مع خاصية إلغاء الضوضاء',12499,'["https://picsum.photos/seed/airpods/400/400"]',100,'cat-1',1,4.7),
      ('p-3','موبايل سامسونج جالاكسي S24 الترا','samsung-s24-ultra','هاتف ذكي بشاشة 6.8 بوصة',51999,'["https://picsum.photos/seed/s24/400/400"]',30,'cat-1',1,4.9),
      ('p-4','لابتوب لينوفو ثينك باد X1 كاربون','lenovo-x1-carbon','لابتوب خفيف الوزن للأعمال',69999,'["https://picsum.photos/seed/laptop/400/400"]',20,'cat-1',0,4.6),
      ('p-5','تابلت سامسونج جالاكسي Tab S9','samsung-tab-s9','جهاز لوحي بشاشة 11 بوصة',32999,'["https://picsum.photos/seed/tablet/400/400"]',25,'cat-1',0,4.5),
      ('p-6','كاميرا كانون EOS R50','canon-eos-r50','كاميرا بدون مرآة بدقة 24.2 ميجابكسل',45999,'["https://picsum.photos/seed/camera/400/400"]',15,'cat-1',1,4.7),
      ('p-7','شاحن متنقل انكر 20000mAh','anker-powerbank-20000','بطارية خارجية سريعة الشحن',1499,'["https://picsum.photos/seed/powerbank/400/400"]',200,'cat-1',0,4.4),
      ('p-8','سماعة رأس لاسلكية سوني WH-1000XM5','sony-wh-1000xm5','سماعة عازلة للضوضاء',12999,'["https://picsum.photos/seed/headphones/400/400"]',40,'cat-1',0,4.8),
      ('p-9','مسجل فيديو للسيارة','car-dashcam','كاميرا سيارة دقيقة 4K',2499,'["https://picsum.photos/seed/dashcam/400/400"]',150,'cat-2',0,4.3),
      ('p-10','زيت محرك شل هيليكس 5W-30','shell-helix-5w30','زيت محرك تخليقي بالكامل',899,'["https://picsum.photos/seed/oil/400/400"]',300,'cat-2',0,4.5),
      ('p-13','دراجة هوائية جينيس','genesis-bicycle','دراجة هوائية رياضية',8999,'["https://picsum.photos/seed/bike/400/400"]',30,'cat-2',1,4.2),
      ('p-14','مكنسة روبوت رومبا','roomba-robot','مكنسة كهربائية روبوت ذكية',15999,'["https://picsum.photos/seed/roomba/400/400"]',20,'cat-3',1,4.6),
      ('p-17','طقم قدور جرانيت','granite-pots-set','طقم قدور جرانيت 12 قطعة',3599,'["https://picsum.photos/seed/pots/400/400"]',60,'cat-3',1,4.7),
      ('p-20','عطر ديور سوفاج','dior-sauvage','عطر رجالي عالمي',2999,'["https://picsum.photos/seed/perfume/400/400"]',100,'cat-4',1,4.8),
      ('p-24','حذاء رياضي نايك','nike-sneakers','حذاء رياضي كلاسيك أبيض',4999,'["https://picsum.photos/seed/sneakers/400/400"]',80,'cat-5',1,4.6),
      ('p-27','مكمل غذائي بروتين واي','whey-protein','بروتين مصل اللبن 2.27 كجم',2299,'["https://picsum.photos/seed/protein/400/400"]',100,'cat-6',1,4.7),
      ('p-31','ألعاب تركيب ليغو','lego-building-set','لعبة تركيب أطفال 500 قطعة',1499,'["https://picsum.photos/seed/lego/400/400"]',100,'cat-7',1,4.8),
      ('p-37','ترابيزة بلياردو','pool-table','طاولة بلياردو منزلية',12999,'["https://picsum.photos/seed/pool/400/400"]',10,'cat-8',1,4.7)
      ON CONFLICT (id) DO NOTHING;
  `;
  await pool.query(schema);
  pgInitialized = true;
}

// Convert ? to $1,$2,... for PostgreSQL
function toPgSql(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function pgQuery(sql: string, params: unknown[] = []): Promise<Row[]> {
  const pool = await getPgPool();
  await ensurePgInit();
  const r = await pool.query(toPgSql(sql), params);
  return r.rows;
}

async function pgGet(sql: string, params: unknown[] = []): Promise<Row | null> {
  const rows = await pgQuery(sql, params);
  return rows[0] || null;
}

async function pgRun(sql: string, params: unknown[] = []): Promise<void> {
  const pool = await getPgPool();
  await ensurePgInit();
  await pool.query(toPgSql(sql), params);
}

// ====== SQLite functions (local dev) — lazy imports ======
async function getSqliteDb() {
  const { default: Database } = await import("better-sqlite3");
  const path = await import("path");
  const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));
  db.pragma("journal_mode = WAL");
  return db;
}

async function sqliteQuery(sql: string, params: unknown[] = []): Promise<Row[]> {
  const db = await getSqliteDb();
  return db.prepare(sql).all(...params) as Row[];
}

async function sqliteGet(sql: string, params: unknown[] = []): Promise<Row | null> {
  const db = await getSqliteDb();
  return (db.prepare(sql).get(...params) as Row) || null;
}

async function sqliteRun(sql: string, params: unknown[] = []): Promise<void> {
  const db = await getSqliteDb();
  db.prepare(sql).run(...params);
}

const isDev = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:");

export const query = isDev ? sqliteQuery : pgQuery;
export const get = isDev ? sqliteGet : pgGet;
export const run = isDev ? sqliteRun : pgRun;

export async function getCategories() {
  return query("SELECT * FROM categories");
}

export async function getProducts(where: string = "", params: unknown[] = []): Promise<Row[]> {
  const sql = `SELECT p.*, c.name as categoryName, c.slug as categorySlug
    FROM products p LEFT JOIN categories c ON p.categoryId = c.id ${where} ORDER BY p.createdAt DESC`;
  return query(sql, params);
}

export async function getProductBySlug(slug: string): Promise<Row | null> {
  const sql = `SELECT p.*, c.name as categoryName, c.slug as categorySlug
    FROM products p LEFT JOIN categories c ON p.categoryId = c.id WHERE p.slug = ?`;
  return get(sql, [slug]);
}

export async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Row[]> {
  return query("SELECT * FROM products WHERE categoryId = ? AND id != ? LIMIT 4", [categoryId, excludeId]);
}

export async function getFeaturedProducts(): Promise<Row[]> {
  return getProducts("WHERE p.featured = 1");
}

export async function getLatestProducts(): Promise<Row[]> {
  return getProducts("", []);
}

export async function createProduct(data: {
  id: string; name: string; slug: string; description: string; price: number;
  images: string; stock: number; categoryId: string | null; featured: boolean; rating: number;
}): Promise<void> {
  await run(
    `INSERT INTO products (id, name, slug, description, price, images, stock, categoryId, featured, rating)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.id, data.name, data.slug, data.description, data.price, data.images, data.stock, data.categoryId, data.featured ? 1 : 0, data.rating]
  );
}

export async function updateProduct(id: string, data: {
  name: string; slug: string; description: string; price: number;
  images: string; stock: number; categoryId: string | null; featured: boolean; rating: number;
}): Promise<void> {
  await run(
    `UPDATE products SET name=?, slug=?, description=?, price=?, images=?, stock=?, categoryId=?, featured=?, rating=?, updatedAt=datetime('now') WHERE id=?`,
    [data.name, data.slug, data.description, data.price, data.images, data.stock, data.categoryId, data.featured ? 1 : 0, data.rating, id]
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await run("DELETE FROM products WHERE id = ?", [id]);
}

export async function getOrders(phone?: string): Promise<Row[]> {
  if (phone) return query("SELECT * FROM orders WHERE customerPhone = ? ORDER BY createdAt DESC", [phone]);
  return query("SELECT * FROM orders ORDER BY createdAt DESC");
}

export async function createOrder(data: {
  id: string; items: string; total: number; subtotal: number; shippingCost: number;
  governorate: string; shippingMethod: string; paymentMethod: string;
  customerName: string; customerEmail: string; customerPhone: string; customerAddress: string;
}): Promise<void> {
  const sql = `INSERT INTO orders (id, items, total, subtotal, shippingCost, governorate, shippingMethod, paymentMethod, status, customerName, customerEmail, customerPhone, customerAddress)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)`;
  await run(sql, [data.id, data.items, data.total, data.subtotal, data.shippingCost, data.governorate, data.shippingMethod, data.paymentMethod, data.customerName, data.customerEmail, data.customerPhone, data.customerAddress]);
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await run("UPDATE orders SET status=?, updatedAt=datetime('now') WHERE id=?", [status, id]);
}

let adminEnsured = false;

async function ensureAdminUser() {
  if (adminEnsured) return;
  adminEnsured = true;
  const hash = "$2b$10$dcTAx3v.wBNjHkMH8tJdk.yi56WUvqNUoXiWnpsdQAXbTm032ngHa";
  if (isDev) {
    try {
      await run("CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)", []);
    } catch {}
    try {
      const existing = await get("SELECT id FROM admin_users WHERE username = ?", ["admin"]);
      if (!existing) {
        const crypto = await import("crypto");
        await run("INSERT INTO admin_users (id, username, password) VALUES (?, ?, ?)", [crypto.randomUUID(), "admin", hash]);
      } else {
        await run("UPDATE admin_users SET password = ? WHERE username = ?", [hash, "admin"]);
      }
    } catch {}
  } else {
    try {
      const pool = await getPgPool();
      await ensurePgInit();
      await pool.query(
        "INSERT INTO admin_users (id, username, password) VALUES (gen_random_uuid()::text, $1, $2) ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password",
        ["admin", hash]
      );
    } catch {}
  }
}

export async function getAdminUser(username: string): Promise<Row | null> {
  await ensureAdminUser();
  return get("SELECT * FROM admin_users WHERE username = ?", [username]);
}
