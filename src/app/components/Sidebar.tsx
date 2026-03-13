"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, FileSearch, Mic2, History } from "lucide-react";

const navItems = [
  { label: "Domů", href: "/", icon: LayoutDashboard },
  { label: "Analýza", href: "/analysis", icon: FileSearch },
  { label: "Konzultace", href: "/consultation", icon: Mic2 },
  { label: "Historie", href: "/history", icon: History },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* --- DESKTOP SIDEBAR (od md: nahoru) --- */}
      <aside className="hidden md:flex h-screen w-24 flex-col items-center border-r border-white/5 bg-[#020617] py-8 shrink-0 z-50">
        
        {/* LOGO BOX */}
        <div className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/50 p-2.5 ring-1 ring-white/10 shadow-inner group cursor-pointer hover:border-indigo-500/50 transition-all">
          <img 
            src="/logo.png" 
            alt="Logo"
            className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110" 
          />
        </div>
        
        {/* NAVIGACE */}
        <nav className="flex flex-1 flex-col items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] transition-all duration-300 ${
                  isActive 
                    ? "bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] ring-1 ring-white/20" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                
                {/* TOOLTIP (zobrazí se při hoveru) */}
                <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white opacity-0 shadow-2xl transition-all group-hover:opacity-100 ring-1 ring-white/10 z-[60]">
                  {item.label}
                </span>

                {/* AKTIVNÍ INDIKÁTOR (linka u okraje) */}
                {isActive && (
                  <div className="absolute -left-0 h-6 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* UŽIVATELSKÝ AVATAR */}
        <div className="mt-auto relative group cursor-pointer">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-white/10 shadow-inner group-hover:border-indigo-500/50 transition-all">
            JD
          </div>
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION (jen mobil) --- */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-[#020617]/80 backdrop-blur-2xl rounded-[2.2rem] border border-white/10 flex items-center justify-around px-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isActive ? "text-cyan-400 scale-110" : "text-slate-500"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              
              {/* Indikátor pod ikonou */}
              {isActive && (
                <>
                  <div className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                  <div className="absolute inset-0 bg-cyan-400/10 blur-xl rounded-full" />
                </>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}