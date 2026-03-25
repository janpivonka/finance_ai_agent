"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileSearch, Mic2, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useTheme } from "./ui/ThemeProvider";

const navItems = [
  { label: "Domů", href: "/", icon: LayoutDashboard },
  { label: "Analýza", href: "/analysis", icon: FileSearch },
  { label: "Konzultace", href: "/consultation", icon: Mic2 },
  { label: "Historie", href: "/history", icon: History },
];

export default function Sidebar() {
  const { goToHome, goToAnalysis, goToConsultation, goToHistory } = useAppNavigation();
  const { toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { activeId, handleInteraction } = useMobileInteraction();

  const handleNavigate = (href: string) => {
    if (href === "/") goToHome();
    else if (href === "/analysis") goToAnalysis();
    else if (href === "/consultation") goToConsultation();
    else if (href === "/history") goToHistory();
    else goToHome();
  };

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Vrátíme placeholder se stejnou šířkou, aby obsah neposkočil při hydrataci
  if (!mounted) {
    return <aside className="hidden md:flex h-screen w-24 border-r border-[color:var(--panel-border)] bg-[var(--background)] shrink-0" />;
  }

  return (
    <>
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex h-screen w-24 flex-col items-center border-r border-[color:var(--panel-border)] bg-[var(--background)] py-8 shrink-0 z-50">
        
        {/* LOGO BOX */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ rotate: 5, scale: 1.05 }}
          onClick={() => goToHome()}
          className="mb-12 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--panel)] p-2.5 ring-1 ring-[color:var(--panel-border)] shadow-inner group cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/50 transition-all"
        >
          <img 
            src="/logo.png" 
            alt="Logo"
            className="max-h-full max-w-full object-contain" 
          />
        </motion.div>

        <ThemeToggle className="mb-10 hover:bg-[var(--panel)]" />
        
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
                  onClick={() => handleNavigate(item.href)}
                  className={`group relative flex h-12 w-12 items-center justify-center rounded-[1.25rem] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
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

                  {/* IKONA S ANIMACÍ (HOVER: SCALE, CLICK: ROTATE) */}
                  <motion.div
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ rotate: 15 }}
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
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[460px] h-16 bg-[color:var(--panel)] backdrop-blur-2xl rounded-[2.2rem] border border-[color:var(--panel-border)] flex items-center justify-around px-4 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] ring-1 ring-white/5"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isButtonActive = activeId === `nav-${item.label}`;

          return (
            <button
              key={item.label}
              onClick={() => handleInteraction(`nav-${item.label}`, () => handleNavigate(item.href), 350)}
              className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all duration-300 ${isButtonActive ? 'scale-110' : ''}`}
            >
              {/* POZADÍ PŘI AKTIVACI (Simulace hover/active z PC) */}
              {isButtonActive && (
                <motion.div
                  layoutId="activePillMobile"
                  className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-indigo-500/40 to-cyan-400/40 rounded-2xl shadow-[0_0_15px_rgba(79,70,229,0.3)] ring-1 ring-white/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                />
              )}

              {isActive && !isButtonActive && (
                <motion.div
                  layoutId="activeNavMobile"
                  className="absolute inset-0 bg-white/5 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* IKONA S ANIMACÍ PRO MOBIL (CLICK: SCALE + ROTATE) */}
              <motion.div
                animate={isButtonActive ? { rotate: 15, scale: 1.35 } : { rotate: 0, scale: 1 }}
                whileTap={{ rotate: 15, scale: 1.35 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className={`relative z-10 transition-colors ${isActive ? "text-cyan-400" : isButtonActive ? "text-white" : "text-slate-500"}`}
              >
                <Icon size={22} strokeWidth={isActive || isButtonActive ? 2.5 : 2} />
              </motion.div>
              
              {(isActive || isButtonActive) && (
                <motion.div 
                  layoutId="activeIndicatorMobile"
                  className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee] z-10" 
                />
              )}
            </button>
          );
        })}

        <ThemeToggle 
          className={`h-12 w-12 transition-all duration-300 ${activeId === 'theme-toggle' ? 'scale-110 bg-indigo-600/20' : ''}`} 
          onClick={() => handleInteraction('theme-toggle', toggleTheme, 350)} 
        />
      </motion.nav>
    </>
  );
}
