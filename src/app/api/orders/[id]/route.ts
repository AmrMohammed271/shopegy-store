import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  await updateOrderStatus(id, body.status);
  return NextResponse.json({ success: true });
}
