"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./UserContext";
import { ThemeProvider } from "./ui/ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <UserProvider>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </UserProvider>
    </SessionProvider>
  );
}
