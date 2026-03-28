import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

// Explicitní export jako "proxy" i jako default pro maximální kompatibilitu
export const proxy = auth;
export default auth;
