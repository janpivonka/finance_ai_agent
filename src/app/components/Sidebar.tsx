"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, FileSearch, Mic2, History } from "lucide-react";
import { motion } from "framer-motion";

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
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex h-screen w-24 flex-col items-center border-r border-white/5 bg-[#020617] py-8 shrink-0 z-50">
        
        {/* LOGO BOX */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: 5, scale: 1.05 }}
          onClick={() => router.push("/")}
          className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/50 p-2.5 ring-1 ring-white/10 shadow-inner group cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
        >
          <img 
            src="/logo.png" 
            alt="Logo"
            className="max-h-full max-w-full object-contain" 
          />
        </motion.div>
        
        {/* NAVIGACE */}
        <nav className="flex flex-1 flex-col items-center gap-8">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <button
                  onClick={() => router.push(item.href)}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  {/* ANIMOVANÉ POZADÍ AKTIVNÍHO PRVKU */}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-cyan-400 rounded-[1.25rem] shadow-[0_0_20px_rgba(79,70,229,0.4)] ring-1 ring-white/20"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}

                  {/* IKONA S TVOU NOVOU ANIMACÍ (ROTACE + SCALE) */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ rotate: 15, scale: 1.25 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="relative z-10 flex items-center justify-center"
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  
                  {/* TOOLTIP */}
                  <div className="pointer-events-none absolute left-16 whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white opacity-0 shadow-2xl transition-all group-hover:opacity-100 ring-1 ring-white/10 z-[60] translate-x-[-10px] group-hover:translate-x-0">
                    {item.label}
                  </div>

                  {/* AKTIVNÍ INDIKÁTOR (Linka u okraje) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeLine"
                      className="absolute -left-5 h-6 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" 
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </nav>

        {/* UŽIVATELSKÝ AVATAR */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="mt-auto relative group cursor-pointer"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-t from-slate-900 to-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-white/10 shadow-inner group-hover:border-indigo-500/50 transition-all">
            JD
          </div>
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </motion.div>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-16 bg-[#020617]/80 backdrop-blur-2xl rounded-[2.2rem] border border-white/10 flex items-center justify-around px-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div
                  layoutId="activeNavMobile"
                  className="absolute inset-0 bg-white/5 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* IKONA S ANIMACÍ PRO MOBIL */}
              <motion.div
                whileTap={{ rotate: -15, scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`relative z-10 transition-colors ${isActive ? "text-cyan-400" : "text-slate-500"}`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              
              {isActive && (
                <motion.div 
                  layoutId="activeIndicatorMobile"
                  className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] z-10" 
                />
              )}
            </button>
          );
        })}
      </motion.nav>
    </>
  );
}
