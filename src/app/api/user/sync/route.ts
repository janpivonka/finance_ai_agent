import { NextResponse } from "next/server";
import { getOrCreateUser, migrateGuestHistory } from "@/lib/auth-service";

export async function POST(req: Request) {
  try {
    const { guestId, ...userData } = await req.json();
    const user = await getOrCreateUser(userData);

    // If we have a guestId and it's different from the new userId, migrate data
    if (guestId && user.id !== guestId) {
      await migrateGuestHistory(guestId, user.id);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Sync user error:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
