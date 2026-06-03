import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const admin = await getAdminUser(username);
    if (!admin || !bcrypt.compareSync(password, admin.password as string)) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }
    return NextResponse.json({ success: true, username: admin.username });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
