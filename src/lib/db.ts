type Row = Record<string, unknown>;

async function sqliteQuery(sql: string, params: unknown[] = []): Promise<Row[]> {
  const Database = (await import("better-sqlite3")).default;
  const path = (await import("path")).default;
  const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));
  db.pragma("journal_mode = WAL");
  const stmt = db.prepare(sql);
  return stmt.all(...params) as Row[];
}

async function sqliteGet(sql: string, params: unknown[] = []): Promise<Row | null> {
  const Database = (await import("better-sqlite3")).default;
  const path = (await import("path")).default;
  const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));
  db.pragma("journal_mode = WAL");
  const stmt = db.prepare(sql);
  return (stmt.get(...params) as Row) || null;
}

async function sqliteRun(sql: string, params: unknown[] = []): Promise<void> {
  const Database = (await import("better-sqlite3")).default;
  const path = (await import("path")).default;
  const db = new Database(path.join(process.cwd(), "prisma", "dev.db"));
  db.pragma("journal_mode = WAL");
  db.prepare(sql).run(...params);
}

let pgPool: any = null;
async function getPgPool() {
  if (!pgPool) {
    const { Pool } = await import("@neondatabase/serverless");
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pgPool;
}

async function pgQuery(sql: string, params: unknown[] = []): Promise<Row[]> {
  const pool = await getPgPool();
  const r = await pool.query(sql, params);
  return r.rows;
}

async function pgGet(sql: string, params: unknown[] = []): Promise<Row | null> {
  const rows = await pgQuery(sql, params);
  return rows[0] || null;
}

async function pgRun(sql: string, params: unknown[] = []): Promise<void> {
  const pool = await getPgPool();
  await pool.query(sql, params);
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

export async function getAdminUser(username: string): Promise<Row | null> {
  return get("SELECT * FROM admin_users WHERE username = ?", [username]);
}
