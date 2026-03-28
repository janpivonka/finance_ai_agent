import { NextResponse } from "next/server";
import { getOrCreateUser, migrateGuestHistory } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    const { guestId, ...userData } = await req.json();
    const user = await getOrCreateUser(userData);

    // If we have a guestId and it's different from the new userId, migrate data
    if (guestId && user.id !== guestId) {
      console.log(`Migrating history from guest ${guestId} to user ${user.id}`);
      await migrateGuestHistory(guestId, user.id);
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Sync user error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json({ 
      error: "Failed to sync user", 
      details: error.message 
    }, { status: 500 });
  }
}
