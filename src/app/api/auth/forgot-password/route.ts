import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email je povinný" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    // Z bezpečnostních důvodů neříkáme, zda uživatel existuje nebo ne
    if (!user || !user.email) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hodina

    console.log(`Updating reset token for user ${user.id}`);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expires
      }
    });

    console.log(`Sending reset email to ${user.email}`);
    const emailResult = await sendPasswordResetEmail(user.email, token);

    if (!emailResult.success) {
      console.error("Gmail send error:", emailResult.error);
      return NextResponse.json({ error: "Nepodařilo se odeslat e-mail" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("CRITICAL: Forgot password error:", error.message || error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ error: "Chyba serveru" }, { status: 500 });
  }
}
