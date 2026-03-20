"use client";

import React, { useState } from "react";
import { ChevronUp } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export const ScrollToTop = ({ forceShow }: { forceShow?: boolean }) => {
  const { showScrollTop } = useScrollDirection();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Trigger scroll event after a tiny delay to ensure hook is listening
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Hybrid logic: 
  // If forceShow is provided (History), it MUST be true AND we must be scrolled down.
  // If forceShow is undefined (Dashboard), we just rely on the scroll hook.
  const shouldShow = mounted && (forceShow !== undefined ? (forceShow && showScrollTop) : showScrollTop);

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
      className={`fixed bottom-8 right-8 h-14 w-14 rounded-2xl 
                 bg-[var(--scroll-button-bg)] text-[color:var(--scroll-button-text)] shadow-2xl
                 flex items-center justify-center cursor-pointer
                 transition-all duration-500 hover:bg-[var(--scroll-button-hover-bg)] hover:scale-110 hover:-translate-y-1 active:scale-95
                 ${shouldShow 
                   ? "opacity-100 translate-y-0 z-[9999] pointer-events-auto" 
                   : "opacity-0 translate-y-20 z-[-1] pointer-events-none"
                 }`}
      style={{ isolation: 'isolate' }} 
    >
      <ChevronUp size={28} strokeWidth={3} />
    </button>
  );
};
