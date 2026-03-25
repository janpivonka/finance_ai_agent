"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PageBackground } from "../components/ui/PageBackground";
import { ArrowRight, ShieldCheck, Zap, Sparkles, BarChart3, MessageSquare } from "lucide-react";
import { ThemeToggle } from "../components/ui/ThemeToggle";

export default function WelcomePage() {
  const router = useRouter();

  const features = [
    {
      icon: BarChart3,
      title: "Chytrá analýza",
      description: "Nahrajte své smlouvy a nechte AI najít skryté úspory během vteřin.",
      color: "text-cyan-400"
    },
    {
      icon: MessageSquare,
      title: "AI Konzultant",
      description: "Ptejte se na cokoliv ohledně vašich financí. Náš agent zná odpovědi.",
      color: "text-indigo-400"
    },
    {
      icon: Zap,
      title: "Okamžité výsledky",
      description: "Žádné čekání na bankéře. Vše máte k dispozici hned teď.",
      color: "text-fuchsia-400"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[600px] h-[600px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-[700px] h-[700px]", opacity: "opacity-10", animate: true, delay: "2s" }
        ]}
        withNoise
      />

      {/* Navigation Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-[color:var(--foreground)] italic">FINANCE<span className="text-cyan-400">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => router.push("/login")}
            className="hidden md:block px-6 py-2.5 text-sm font-bold text-[color:var(--foreground)] hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Přihlásit se
          </button>
          <button 
            onClick={() => router.push("/register")}
            className="px-6 py-2.5 bg-[var(--panel-strong)] border border-[color:var(--panel-border)] hover:border-cyan-500/50 rounded-xl text-sm font-bold text-[color:var(--foreground)] transition-all hover:scale-105 cursor-pointer shadow-xl"
          >
            Registrace
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <Sparkles size={16} className="text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Nová generace finančního poradenství</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-[color:var(--foreground)] mb-8 leading-[0.9]">
            Vaše finance pod kontrolou <br />
            <span className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">díky umělé inteligenci</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            Analyzujte smlouvy, hledejte úspory a konzultujte své finanční plány s nejmodernějším AI asistentem v Česku.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
            <button 
              onClick={() => router.push("/dashboard")}
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg tracking-tight transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] cursor-pointer overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                Vyzkoušet zdarma
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
            
            <button className="px-8 py-4 bg-[var(--panel-strong)] border border-[color:var(--panel-border)] text-[color:var(--foreground)] rounded-2xl font-bold transition-all hover:bg-[var(--panel)] cursor-pointer">
              Jak to funguje?
            </button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                className="p-8 bg-[var(--panel)] backdrop-blur-xl border border-[color:var(--panel-border)] rounded-[2.5rem] text-left hover:border-white/10 transition-all group shadow-2xl"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-[color:var(--foreground)] mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 py-12 border-t border-white/5 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck size={20} />
            <span className="text-sm font-bold tracking-tight">© 2026 FINANCE AI AGENT</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Soukromí</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Podmínky</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
