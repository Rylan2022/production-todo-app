import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/authorization";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Admin access required" },
      { status: 403 },
    );
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { todos: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: users });
}
