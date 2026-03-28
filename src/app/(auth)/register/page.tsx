"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, ArrowLeft, ArrowRight, Github, Chrome } from "lucide-react";
import { PageBackground } from "../../components/ui/PageBackground";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import AuthLoading from "../loading";
import { useUser } from "../../components/UserContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useUser();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use the new login logic from UserContext
    try {
      await login({ 
        name: formData.name || "Uživatel", 
        email: formData.email 
      });
      router.push("/dashboard");
    } catch (err) {
      console.error("Chyba při registraci:", err);
    }
  };

  if (!mounted) return <AuthLoading />;

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col items-center justify-center p-6 py-12">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-fuchsia-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true }
        ]}
        withNoise
      />

      <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--panel-strong)] border border-[color:var(--panel-border)] rounded-xl text-sm font-bold text-[color:var(--foreground)] hover:bg-[var(--panel)] transition-all cursor-pointer group shadow-xl"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Zpět
        </button>
      </div>

      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[var(--panel)] backdrop-blur-2xl border border-[color:var(--panel-border)] rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-fuchsia-500/20 mb-6 group hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="text-white" size={36} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-[color:var(--foreground)] mb-2">Vytvořit účet</h1>
            <p className="text-slate-500 font-medium text-sm">Začněte šetřit s AI finančním agentem</p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <Github size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
            </button>
            <button 
              onClick={() => loginWithGoogle()}
              className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer"
            >
              <Chrome size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Google</span>
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <span className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5"></div>
            </span>
            <span className="relative z-10 bg-[var(--panel)] px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Nebo e-mailem</span>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Celé jméno</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Jan Novák"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[color:var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">E-mailová adresa</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="jmeno@priklad.cz"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-[color:var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Heslo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-fuchsia-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-[color:var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-4 py-2">
              <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/50 transition-all cursor-pointer" required />
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Souhlasím s <a href="#" className="text-indigo-400 hover:text-white transition-colors">podmínkami služby</a>
              </label>
            </div>

            <button 
              type="submit"
              className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] cursor-pointer mt-2 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                Založit účet
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Již máte účet?{" "}
            <button 
              type="button"
              onClick={() => router.push("/login")}
              className="text-indigo-400 hover:text-white font-black transition-colors cursor-pointer"
            >
              Přihlaste se
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
