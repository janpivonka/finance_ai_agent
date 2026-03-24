// src/hooks/useMobileInteraction.ts
import { useCallback, useState } from "react";

/**
 * Hook for handling interactive elements on mobile.
 * Provides a delayed action to allow animations to complete.
 */
export const useMobileInteraction = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleInteraction = useCallback((id: string, action: () => void, delay = 350) => {
    // Check if we are on a mobile device (touch support)
    const isMobile = typeof window !== 'undefined' && 
                    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    if (isMobile) {
      setActiveId(id);
      // Short delay to let the CSS/Framer-motion active/tap state show
      setTimeout(() => {
        action();
        // Clear active state after navigation/action starts
        setTimeout(() => setActiveId(null), 500);
      }, delay);
    } else {
      // Desktop - direct action
      action();
    }
  }, []);

  return {
    activeId,
    handleInteraction
  };
};
