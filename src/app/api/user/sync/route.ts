import { NextResponse } from "next/server";
import { getOrCreateUser, migrateGuestHistory } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }
    const { guestId, isLogin, ...userData } = await req.json();
    const user = await getOrCreateUser(userData, !!isLogin);

    // If we have a guestId and it's different from the new userId, migrate data
    if (guestId && user.id !== guestId) {
      console.log(`Migrating history from guest ${guestId} to user ${user.id}`);
      await migrateGuestHistory(guestId, user.id);
    }

    return NextResponse.json(user);
  } catch (error: any) {
    const isKnownError = [
      "User not found", 
      "Invalid password", 
      "Account has no password set. Please login via Google.",
      "Invalid login attempt",
      "Uživatel s tímto e-mailem již existuje."
    ].includes(error.message);

    if (!isKnownError) {
      console.error("Sync user server error:", {
        message: error.message,
        stack: error.stack
      });
    }

    return NextResponse.json({ 
      error: isKnownError ? error.message : "Failed to sync user", 
      details: error.message 
    }, { status: isKnownError ? 401 : 500 });
  }
}
