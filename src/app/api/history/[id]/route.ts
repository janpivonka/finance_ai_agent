import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.analysisHistory.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete history entry error:", error);
    return NextResponse.json({ error: "Failed to delete history entry" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const entry = await prisma.analysisHistory.update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Update history entry error:", error);
    return NextResponse.json({ error: "Failed to update history entry" }, { status: 500 });
  }
}
