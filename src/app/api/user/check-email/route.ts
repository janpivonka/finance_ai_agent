import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, currentUserId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    // Email je dostupný pokud neexistuje žádný uživatel s tímto emailem,
    // nebo pokud patří aktuálně přihlášenému uživateli.
    const isAvailable = !existingUser || existingUser.id === currentUserId;

    return NextResponse.json({ available: isAvailable });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
