import { prisma } from "./prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getOrCreateUser(userData?: { 
  email?: string; 
  name?: string; 
  phone?: string; 
  id?: string; 
  image?: string | null; 
  password?: string | null 
}, isLogin: boolean = false): Promise<User> {
  if (!userData) {
    throw new Error("User data is required");
  }

  // 1. If email is provided, try to fetch by email first (important for OAuth sync)
  if (userData.email) {
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { accounts: true }
    });
    
    if (user) {
      // If user exists and we are trying to login with password
      if (userData.password && user.password) {
        const isValid = await bcrypt.compare(userData.password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
      } else if (userData.password && !user.password) {
        // If user exists (e.g. from Google) but has no password set
        throw new Error("Account has no password set. Please login via Google.");
      }

      // If user exists but image is missing, update it
      if (userData.image && !user.image) {
        return await prisma.user.update({
          where: { id: user.id },
          data: { image: userData.image },
          include: { accounts: true }
        });
      }
      return user;
    } else if (isLogin) {
      // If we are in login mode and user was not found by email
      throw new Error("User not found");
    }
  }

  // 2. If ID is provided, try to fetch
  if (userData.id) {
    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      include: { accounts: true }
    });
    if (user) return user;
  }

  // 3. Create new user (Guest or Full)
  // If we reach here and isLogin is true, it means no email was provided or user not found
  if (isLogin) {
    throw new Error("User not found");
  }

  // Check if user with this email already exists before creating (strict registration)
  if (userData.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    if (existingUser) {
      throw new Error("Uživatel s tímto e-mailem již existuje.");
    }
  }

  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : null;

  return await prisma.user.create({
    data: {
      email: userData.email || null,
      name: userData.name || "Uživatel",
      phone: userData.phone || null,
      image: userData.image || null,
      password: hashedPassword,
      isGuest: !userData.email,
    },
    include: { accounts: true }
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

  console.log(`Starting migration: ${guestId} -> ${userId}`);

  // 1. Move analysis history
  const historyResult = await prisma.analysisHistory.updateMany({
    where: { userId: guestId },
    data: { userId }
  });

  console.log(`Migrated ${historyResult.count} history items`);

  // 2. Optionally delete the guest user if it's a "pure" guest (no email)
  const guestUser = await prisma.user.findUnique({
    where: { id: guestId }
  });

  if (guestUser && guestUser.isGuest && !guestUser.email) {
    try {
      await prisma.user.delete({
        where: { id: guestId }
      });
      console.log(`Deleted guest user ${guestId}`);
    } catch (e) {
      console.error(`Could not delete guest user ${guestId}:`, e);
    }
  }

  return historyResult;
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
