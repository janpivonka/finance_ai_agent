"use client";

import React from "react";
import { ChevronUp } from "lucide-react";
import { useScrollDirection } from "../hooks/useScrollDirection";

export const ScrollToTop = () => {
  const { showScrollTop } = useScrollDirection();

  const scrollToTop = (e: React.MouseEvent) => {
    // Zastavíme šíření eventu dál, aby se s ničím netloukl
    e.preventDefault();
    e.stopPropagation();
    
    console.log("ScrollToTop: KLIKNUTO!");

    if (typeof window !== "undefined") {
      // Zkusíme všechny známé způsoby, jak vyvolat scroll nahoru
      const options: ScrollToOptions = { top: 0, behavior: "smooth" };
      
      window.scrollTo(options);
      document.documentElement.scrollTo(options);
      document.body.scrollTo(options);
      
      // Pokud by byl scroll v nějakém konkrétním divu (časté u dashboardů)
      const mainContent = document.querySelector('main') || document.querySelector('.overflow-y-auto');
      if (mainContent) {
        mainContent.scrollTo(options);
      }
    }
  };

  return (
    <button
      onClick={scrollToTop}
      type="button"
      // Z-index 99999 a pointer-events-auto jsou klíčové
      className={`fixed bottom-8 right-8 h-14 w-14 rounded-2xl 
                 bg-indigo-600 text-white shadow-2xl
                 flex items-center justify-center cursor-pointer
                 transition-all duration-500 hover:scale-110 active:scale-95
                 ${showScrollTop 
                   ? "opacity-100 translate-y-0 z-[99999] pointer-events-auto" 
                   : "opacity-0 translate-y-20 z-[-1] pointer-events-none"
                 }`}
      style={{ isolation: 'isolate' }} // Vytvoří nový stacking context
    >
      <ChevronUp size={28} strokeWidth={3} />
    </button>
  );
};