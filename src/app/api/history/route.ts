import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "UserId is required" }, { status: 400 });
  }

  try {
    const history = await prisma.analysisHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    // Parse top_nabidky back to JSON
    const parsedHistory = history.map((item: any) => ({
      ...item,
      top_nabidky: JSON.parse(item.top_nabidky)
    }));

    return NextResponse.json(parsedHistory);
  } catch (error) {
    console.error("Fetch history error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, ...data } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "UserId is required" }, { status: 400 });
    }

    // Ensure user exists (especially for guests who might not be in DB yet)
    // but the sync endpoint should have handled this. 
    // If the userId starts with 'guest-' it might be a client-side generated ID
    // that hasn't been synced to DB yet.
    
    let dbUserId = userId;
    
    // Check if user exists in DB
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      // Create a guest user if it doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          name: "Host",
          isGuest: true
        }
      });
      dbUserId = newUser.id;
    }

    const entry = await prisma.analysisHistory.create({
      data: {
        ...data,
        userId: dbUserId,
        top_nabidky: JSON.stringify(data.top_nabidky)
      }
    });

    // Inkrementujeme celkový počet analýz uživatele (toto číslo se nesnižuje při smazání z historie)
    await prisma.user.update({
      where: { id: dbUserId },
      data: { totalAnalyses: { increment: 1 } }
    });

    return NextResponse.json({
      ...entry,
      top_nabidky: JSON.parse(entry.top_nabidky)
    });
  } catch (error) {
    console.error("Create history entry error:", error);
    return NextResponse.json({ error: "Failed to create history entry" }, { status: 500 });
  }
}
