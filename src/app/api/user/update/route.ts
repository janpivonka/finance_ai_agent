import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/auth-service";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { userId, currentPassword, ...data } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Pokud se mění heslo, musíme ověřit to stávající
    if (data.password) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { password: true }
      });

      if (user?.password) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return NextResponse.json({ error: "Současné heslo není správné." }, { status: 401 });
        }
      }
    }

    const user = await updateProfile(userId, data);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
