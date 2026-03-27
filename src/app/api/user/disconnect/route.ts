import { NextResponse } from "next/server";
import { disconnectAccount } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const { userId, provider } = await req.json();
    const user = await disconnectAccount(userId, provider);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Disconnect account error:", error);
    return NextResponse.json({ error: "Failed to disconnect account" }, { status: 500 });
  }
}
