"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  bio: string | null;
  image: string | null;
  isGuest: boolean;
  connectedAccounts: {
    github: boolean;
    google: boolean;
    facebook: boolean;
    tiktok: boolean;
  };
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  login: (data: { name: string; email: string; password?: string }, isLogin?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  connectSocialAccount: (provider: string) => Promise<void>;
  disconnectSocialAccount: (provider: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with session or localStorage on mount/session change
  useEffect(() => {
    const initUser = async () => {
      // If Auth.js session is loading, wait
      if (status === "loading") return;

      setIsLoading(true);
      try {
        if (session?.user) {
          // Logged in via Auth.js
          const guestId = localStorage.getItem("finance_user_id");
          
          console.log("Syncing session user:", {
            name: session.user.name,
            email: session.user.email,
            hasImage: !!session.user.image
          });

          const res = await fetch("/api/user/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              email: session.user.email,
              name: session.user.name,
              // NEPŘEDÁVÁME image: session.user.image, pokud je to Base64 (ze session jsme ho smazali)
              guestId: guestId
            })
          });

          if (res.ok) {
            const dbUser = await res.json();
            
            // Pokud došlo k migraci (guestId byl jiný než dbUser.id), 
            // promažeme lokální historii, aby se načetla čerstvá ze serveru
            if (guestId && guestId !== dbUser.id) {
              localStorage.removeItem("finance_history");
            }

            const profile: UserProfile = {
              id: dbUser.id,
              name: dbUser.name || "Uživatel",
              email: dbUser.email,
              phone: dbUser.phone,
              bio: dbUser.bio,
              image: dbUser.image,
              isGuest: false,
              connectedAccounts: {
                github: dbUser.accounts?.some((a: any) => a.provider === "github") || false,
                google: dbUser.accounts?.some((a: any) => a.provider === "google") || false,
                facebook: dbUser.accounts?.some((a: any) => a.provider === "facebook") || false,
                tiktok: dbUser.accounts?.some((a: any) => a.provider === "tiktok") || false,
              }
            };
            setUser(profile);
            localStorage.setItem("finance_user_id", dbUser.id);
            localStorage.setItem("finance_user_name", dbUser.name || "Uživatel");
            if (dbUser.email) localStorage.setItem("finance_user_email", dbUser.email);
            localStorage.setItem("finance_auth_session", "true");
          }
        } else {
          // Guest or not logged in via Auth.js
          const storedUserId = localStorage.getItem("finance_user_id");
          const storedName = localStorage.getItem("finance_user_name") || "Uživatel";
          const storedEmail = localStorage.getItem("finance_user_email");
          const storedPhone = localStorage.getItem("finance_user_phone");

          const res = await fetch("/api/user/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              id: storedUserId, 
              name: storedName, 
              email: storedEmail,
              phone: storedPhone
            })
          });

          if (res.ok) {
            const dbUser = await res.json();
            const profile: UserProfile = {
              id: dbUser.id,
              name: dbUser.name || "Uživatel",
              email: dbUser.email,
              phone: dbUser.phone,
              bio: dbUser.bio,
              image: dbUser.image,
              isGuest: dbUser.isGuest,
              connectedAccounts: {
                github: dbUser.accounts?.some((a: any) => a.provider === "github") || false,
                google: dbUser.accounts?.some((a: any) => a.provider === "google") || false,
                facebook: dbUser.accounts?.some((a: any) => a.provider === "facebook") || false,
                tiktok: dbUser.accounts?.some((a: any) => a.provider === "tiktok") || false,
              }
            };
            setUser(profile);
            localStorage.setItem("finance_user_id", dbUser.id);
            localStorage.setItem("finance_user_name", dbUser.name || "Uživatel");
          } else {
            setUser({
              id: storedUserId || "guest-" + Date.now(),
              name: storedName,
              email: storedEmail || null,
              phone: storedPhone || null,
              bio: null,
              image: null,
              isGuest: !storedEmail,
              connectedAccounts: { github: false, google: false, facebook: false, tiktok: false }
            });
          }
        }
      } catch (err) {
        console.error("User initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, [session, status]);

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...data })
      });
      if (res.ok) {
        const updatedDbUser = await res.json();
        setUser(prev => prev ? { 
          ...prev, 
          ...data,
          name: updatedDbUser.name || prev.name,
          email: updatedDbUser.email || prev.email,
          phone: updatedDbUser.phone || prev.phone,
          image: updatedDbUser.image || prev.image,
          bio: updatedDbUser.bio || prev.bio
        } : null);
        
        // Update localStorage as well
        if (data.name) localStorage.setItem("finance_user_name", data.name);
        if (data.email) localStorage.setItem("finance_user_email", data.email);
        if (data.phone) localStorage.setItem("finance_user_phone", data.phone);
      }
    } catch (err) {
      console.error("Update profile error:", err);
    }
  };

  const login = async (data: { name: string; email: string; password?: string }, isLogin: boolean = false) => {
    try {
      const guestId = user?.id;
      const res = await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          guestId, 
          name: data.name, 
          email: data.email, 
          password: data.password,
          isLogin 
        })
      });
      if (res.ok) {
        const dbUser = await res.json();
        setUser({
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          phone: dbUser.phone,
          bio: dbUser.bio,
          image: dbUser.image,
          isGuest: dbUser.isGuest,
          connectedAccounts: {
            github: dbUser.accounts?.some((a: any) => a.provider === "github") || false,
            google: dbUser.accounts?.some((a: any) => a.provider === "google") || false,
            facebook: dbUser.accounts?.some((a: any) => a.provider === "facebook") || false,
            tiktok: dbUser.accounts?.some((a: any) => a.provider === "tiktok") || false,
          }
        });
        localStorage.setItem("finance_user_id", dbUser.id);
        localStorage.setItem("finance_user_name", dbUser.name);
        localStorage.setItem("finance_user_email", dbUser.email);
        localStorage.setItem("finance_auth_session", "true");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }
    } catch (err) {
      // Pokud je to známá chyba z API, nevyhazujeme ji do konzole (Next.js by ji mohl zachytit jako pád)
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  const logout = () => {
    if (session) {
      signOut({ callbackUrl: "/" });
    }
    setUser(null);
    localStorage.removeItem("finance_user_id");
    localStorage.removeItem("finance_user_name");
    localStorage.removeItem("finance_user_email");
    localStorage.removeItem("finance_user_phone");
    localStorage.removeItem("finance_auth_session");
    if (!session) window.location.href = "/";
  };

  const connectSocialAccount = async (provider: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, provider })
      });
      if (res.ok) {
        setUser(prev => prev ? {
          ...prev,
          connectedAccounts: { ...prev.connectedAccounts, [provider]: true }
        } : null);
      }
    } catch (err) {
      console.error("Connect social error:", err);
    }
  };

  const disconnectSocialAccount = async (provider: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/user/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, provider })
      });
      if (res.ok) {
        setUser(prev => prev ? {
          ...prev,
          connectedAccounts: { ...prev.connectedAccounts, [provider]: false }
        } : null);
      }
    } catch (err) {
      console.error("Disconnect social error:", err);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      updateUser, 
      logout, 
      login, 
      loginWithGoogle,
      connectSocialAccount, 
      disconnectSocialAccount 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
