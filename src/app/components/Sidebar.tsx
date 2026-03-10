"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, FileSearch, Mic2, History } from "lucide-react";

const navItems = [
  { label: "Domů", href: "/", icon: LayoutDashboard },
  { label: "Analýza", href: "/analysis", icon: FileSearch },
  { label: "Konzultace", href: "/consultation", icon: Mic2 },
  { label: "Historie", href: "/history", icon: History },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-20 flex-col items-center border-r border-slate-800 bg-slate-950 py-8 shrink-0 z-50">
      <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-500/30">
        FS
      </div>
      
      <nav className="flex flex-1 flex-col items-center gap-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.label}
              onClick={() => item.href !== "#" && router.push(item.href)}
              className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                  : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="pointer-events-none absolute left-16 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-2xl transition-all group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
        JD
      </div>
    </aside>
  );
}