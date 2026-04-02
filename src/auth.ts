import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }: any) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.isGuest = token.isGuest as boolean;
      }
      return session;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.isGuest = user.isGuest;
      }
      return token;
    }
  },
});
