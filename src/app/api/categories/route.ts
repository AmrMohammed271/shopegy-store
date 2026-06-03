import { NextResponse } from "next/server";
import { run, query } from "@/lib/db";

export async function GET() {
  const categories = await query("SELECT * FROM categories");
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const slug = body.name.toLowerCase().replace(/\s+/g, "-");
    await run("INSERT INTO categories (id, name, slug, image) VALUES (?, ?, ?, ?)", [id, body.name, slug, body.image || null]);
    const category = (await query("SELECT * FROM categories WHERE id = ?", [id]))[0];
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
