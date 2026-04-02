"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { PageBackground } from "../../components/ui/PageBackground";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import AuthLoading from "../loading";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || "Při odesílání e-mailu došlo k chybě.");
        console.error("Error sending reset email:", data.error);
      }
    } catch (err) {
      setError("Při odesílání e-mailu došlo k chybě.");
      console.error("Error sending reset email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <AuthLoading />;

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col items-center justify-center p-6">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-fuchsia-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true }
        ]}
        withNoise
      />

      <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <button 
          onClick={() => router.push("/login")}
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
              {isSubmitted ? <CheckCircle2 className="text-white" size={36} /> : <ShieldCheck className="text-white" size={36} />}
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-[color:var(--foreground)] mb-2">
              {isSubmitted ? "E-mail odeslán!" : "Zapomenuté heslo"}
            </h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed">
              {isSubmitted 
                ? "Pokud u nás máte účet, poslali jsme vám instrukce k obnovení hesla." 
                : "Zadejte svůj e-mail a my vám pošleme odkaz pro vytvoření nového hesla."}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold w-full flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">E-mailová adresa</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jmeno@priklad.cz"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-[color:var(--foreground)]"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] cursor-pointer overflow-hidden disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? "Odesílání..." : "Odeslat instrukce"}
                    {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-500 text-sm font-bold">
                  Zkontrolujte prosím svou schránku.
                </div>
                <button 
                  onClick={() => router.push("/login")}
                  className="text-indigo-400 hover:text-white font-black text-sm uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Zpět na přihlášení
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
