import { useLayoutEffect } from 'react';

export const useIntersectionObserver = (className = '.reveal') => {
  useLayoutEffect(() => {
    const elements = document.querySelectorAll(className);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = 'translateY(0)';
          } else {
            el.style.opacity = "0";
            el.style.transform = 'translateY(20px)';
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = 'translateY(20px)';
      htmlEl.style.transition = 'opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [className]);
};