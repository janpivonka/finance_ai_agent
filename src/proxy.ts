import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

// Explicitní export jako "proxy" i jako default pro maximální kompatibilitu
export const proxy = auth;
export default auth;

export const config = {
  // Matcher pro vyloučení statických souborů a API cest z proxy
  // Musíme povolit /api/auth aby proběhl callback
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
