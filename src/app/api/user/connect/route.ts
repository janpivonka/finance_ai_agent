import { NextResponse } from "next/server";
import { connectAccount } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const { userId, provider } = await req.json();
    // Simulate social connection logic
    const user = await connectAccount(userId, provider, "mock-id-" + Date.now());
    return NextResponse.json(user);
  } catch (error) {
    console.error("Connect account error:", error);
    return NextResponse.json({ error: "Failed to connect account" }, { status: 500 });
  }
}
