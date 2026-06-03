import { NextResponse } from "next/server";
import { query, updateProduct, deleteProduct } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await updateProduct(id, {
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
  return NextResponse.json(product);
}
