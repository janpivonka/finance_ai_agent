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
        // Odstraníme obrázek ze session, aby hlavičky nebyly příliš velké (Base64)
        // UserContext si ho načte sám z databáze přes /api/user/sync
        session.user.image = null;
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
