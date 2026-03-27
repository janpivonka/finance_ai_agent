import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const userData = await req.json();
    const user = await getOrCreateUser(userData);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
