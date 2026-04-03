import { useEffect } from 'react';

/**
 * @param className - Třída, kterou mají animované prvky
 * @param dependency - Stav (např. history.length), při jehož změně se má observer restartovat
 */
export const useIntersectionObserver = (
  className = ".reveal",
  dependency: unknown = null,
) => {
  useEffect(() => {
    // Malé zpoždění, aby se zajistilo, že prvky jsou v DOMu po renderu
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(className);
      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const el = entry.target as HTMLElement;
            if (entry.isIntersecting) {
              el.style.opacity = "1";
              el.style.transform = 'translateY(0)';
              // Jakmile je prvek viditelný, přestaneme ho sledovat
              observer.unobserve(el);
            }
          });
        },
        { 
          threshold: 0.01, // Minimální viditelnost pro aktivaci
          rootMargin: '100px' // Aktivovat s předstihem 100px
        }
      );

      elements.forEach(el => {
        const htmlEl = el as HTMLElement;
        // Pokud už prvek není viditelný, připravíme ho na animaci
        if (htmlEl.style.opacity !== "1") {
          htmlEl.style.opacity = "0";
          htmlEl.style.transform = 'translateY(20px)';
          htmlEl.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        }
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [className, dependency]); 
};
