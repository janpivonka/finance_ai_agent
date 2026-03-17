import { useState, useEffect } from 'react';

export const useScrollDirection = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Funkce, která zjistí scroll odkudkoliv
    const handleScroll = (e: any) => {
      // Zkusíme vzít scroll z cíle eventu (pokud je to div) nebo z okna
      const target = e.target === document ? document.documentElement : e.target;
      const currentScrollY = target.scrollTop ?? window.scrollY;

      setShowScrollTop(currentScrollY > 100);

      if (currentScrollY > lastScrollY) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    // 'true' na konci je klíčové - zachytí scroll i vnořených prvků
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [lastScrollY]);

  return { showScrollTop, navVisible };
};
