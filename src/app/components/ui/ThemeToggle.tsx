"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`group flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--panel-border)] bg-[color:var(--panel)] text-[color:var(--foreground)] transition-all hover:brightness-105 active:scale-95 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun size={18} className="text-cyan-300 transition-transform group-hover:rotate-12" />
      ) : (
        <Moon size={18} className="text-indigo-500 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
};
