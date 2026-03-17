// hooks/useIntersectionObserver.ts
import { useLayoutEffect } from 'react';

/**
 * @param className - Třída, kterou mají animované prvky
 * @param dependency - Stav (např. history.length), při jehož změně se má observer restartovat
 */
export const useIntersectionObserver = (className = '.reveal', dependency: any = null) => {
  useLayoutEffect(() => {
    // 1. Najdeme všechny prvky s danou třídou
    const elements = document.querySelectorAll(className);
    
    // Pokud na stránce zatím žádné prvky nejsou (historie se ještě nenačetla),
    // nebudeme nic startovat a počkáme na změnu dependency.
    if (elements.length === 0) return;

    // 2. Definujeme observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // Když je prvek vidět alespoň z 30%, spustíme animaci
            el.style.opacity = "1";
            el.style.transform = 'translateY(0)';
          } else if (!entry.isIntersecting && entry.intersectionRatio < 0.2) {
            // Skryjeme až když je méně než 20% viditelnosti
            el.style.opacity = "0";
            el.style.transform = 'translateY(20px)';
          }
        });
      },
      { 
        threshold: [0, 0.3, 0.7, 1], // Vyšší threshold pro méně časté změny
        rootMargin: '0px 0px -100px 0px' // Větší rezerva - aktivuje se 100px dříve
      }
    );

    // 3. Příprava prvků a spuštění sledování
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      
      // Nastavíme počáteční stav (skrytý), pokud už není zobrazený
      if (htmlEl.style.opacity !== "1") {
        htmlEl.style.opacity = "0";
        htmlEl.style.transform = 'translateY(20px)';
        // Nastavení plynulého přechodu
        htmlEl.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      
      observer.observe(el);
    });

    // 4. Cleanup - odpojení observeru při unmountu nebo restartu
    return () => observer.disconnect();

    // DŮLEŽITÉ: Přidali jsme dependency. Když se změní počet položek v historii, 
    // celý tento kód se spustí znovu a najde nové karty v DOMu.
  }, [className, dependency]); 
};
