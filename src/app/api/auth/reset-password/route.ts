import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token a heslo jsou povinné" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Odkaz je neplatný nebo již vypršel" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update hesla a zároveň vymazání tokenů přes findFirst (pokud id zlobí)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CRITICAL: Reset password error:", error.message || error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
