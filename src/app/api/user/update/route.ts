import { NextResponse } from "next/server";
import { updateProfile } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const { userId, ...data } = await req.json();
    const user = await updateProfile(userId, data);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
