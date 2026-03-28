import { prisma } from "./prisma";
import { User } from "@prisma/client";

export async function getOrCreateUser(userData?: { email?: string; name?: string; phone?: string; id?: string }): Promise<User> {
  // 1. If ID is provided, try to fetch
  if (userData?.id) {
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      include: { accounts: true }
    });
    if (user) return user;
  }

  // 2. If email is provided, try to fetch by email
  if (userData?.email) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { accounts: true }
    });
    if (user) return user;
  }

  // 3. Create new user (Guest or Full)
  return await prisma.user.create({
    data: {
      email: userData?.email,
      name: userData?.name || "Uživatel",
      phone: userData?.phone,
      isGuest: !userData?.email,
    }
  });
}

export async function updateProfile(userId: string, data: Partial<User>) {
  return await prisma.user.update({
    where: { id: userId },
    data
  });
}

export async function connectAccount(userId: string, provider: string, providerAccountId: string, type: string = "oauth") {
  return await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId
      }
    },
    update: {},
    create: {
      userId,
      provider,
      providerAccountId,
      type
    }
  });
}

export async function migrateGuestHistory(guestId: string, userId: string) {
  if (!guestId || !userId || guestId === userId) return;

  return await prisma.analysisHistory.updateMany({
    where: { userId: guestId },
    data: { userId }
  });
}

export async function disconnectAccount(userId: string, provider: string) {
  // Find account first to get ID
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider
    }
  });

  if (account) {
    return await prisma.account.delete({
      where: { id: account.id }
    });
  }
}
