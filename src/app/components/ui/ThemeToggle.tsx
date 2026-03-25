"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  onClick?: () => void;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "", onClick }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    toggleTheme();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`group flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-[color:var(--panel)] active:scale-95 cursor-pointer ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ rotate: 15 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun size={18} className="text-cyan-300 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
          ) : (
            <Moon size={18} className="text-indigo-500 filter drop-shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};
