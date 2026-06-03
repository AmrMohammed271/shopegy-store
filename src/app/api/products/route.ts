import { NextResponse } from "next/server";
import { query, createProduct } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const cat = searchParams.get("cat");

  let where = "";
  const vals: unknown[] = [];
  if (q) { where = "WHERE (p.name LIKE ? OR p.description LIKE ?)"; vals.push(`%${q}%`, `%${q}%`); }
  if (cat) { where = where ? `${where} AND c.slug = ?` : "WHERE c.slug = ?"; vals.push(cat); }

  const products = await query(
    `SELECT p.*, c.name as categoryName FROM products p LEFT JOIN categories c ON p.categoryId = c.id ${where} ORDER BY p.createdAt DESC`,
    vals
  );
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    await createProduct({
      id,
      name: body.name,
      slug: slugify(body.name),
      description: body.description || "",
      price: parseFloat(body.price),
      images: JSON.stringify(body.images || ["/placeholder.svg"]),
      stock: parseInt(body.stock) || 0,
      categoryId: body.categoryId || null,
      featured: body.featured || false,
      rating: parseFloat(body.rating) || 0,
    });
    const product = (await query("SELECT * FROM products WHERE id = ?", [id]))[0];
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
