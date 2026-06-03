import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const orders = await getOrders(phone || undefined);
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    await createOrder({
      id,
      items: JSON.stringify(body.items),
      total: body.total,
      subtotal: body.subtotal || body.total,
      shippingCost: body.shippingCost || 0,
      governorate: body.governorate || "",
      shippingMethod: body.shippingMethod || "standard",
      paymentMethod: body.paymentMethod || "cod",
      customerName: body.customerName,
      customerEmail: body.customerEmail || "",
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
    });
    const order = (await getOrders()).find(o => o.id === id);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
