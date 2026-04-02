"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Check, X, ArrowRight } from "lucide-react";
import { PageBackground } from "../../components/ui/PageBackground";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import AuthLoading from "../loading";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validace síly hesla
  const passChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  const isPassStrong = Object.values(passChecks).every(Boolean);
  const passwordsMatch = confirmPassword !== "" && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Chybí platný odkaz pro obnovu.");
      return;
    }
    if (!isPassStrong) {
      setError("Heslo nesplňuje požadavky.");
      return;
    }
    if (!passwordsMatch) {
      setError("Hesla se neshodují.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.error || "Při obnově hesla došlo k chybě.");
      }
    } catch (err) {
      setError("Při obnově hesla došlo k chybě.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return <AuthLoading />;

  return (
    <div className="bg-[var(--panel)] backdrop-blur-2xl border border-[color:var(--panel-border)] rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-fuchsia-500/20 mb-6 group hover:rotate-12 transition-transform duration-500">
          {isSuccess ? <CheckCircle2 className="text-white" size={36} /> : <ShieldCheck className="text-white" size={36} />}
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-[color:var(--foreground)] mb-2">
          {isSuccess ? "Heslo změněno!" : "Nové heslo"}
        </h1>
        <p className="text-slate-500 font-medium text-sm leading-relaxed">
          {isSuccess 
            ? "Vaše heslo bylo úspěšně aktualizováno. Přesměrováváme vás na přihlášení..." 
            : "Zadejte své nové bezpečné heslo."}
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

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nové heslo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-fuchsia-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
                    password && isPassStrong ? "border-green-500/50" : password ? "border-red-500/50" : "border-white/10"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {password && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 ml-1"
                >
                  <div className="grid grid-cols-1 gap-1.5">
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${passChecks.length ? "text-green-500" : "text-red-400"}`}>
                      {passChecks.length ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                      8+ znaků
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${passChecks.upper ? "text-green-500" : "text-red-400"}`}>
                      {passChecks.upper ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                      Velké písmeno
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${passChecks.number ? "text-green-500" : "text-red-400"}`}>
                      {passChecks.number ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                      Číslice
                    </div>
                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${passChecks.special ? "text-green-500" : "text-red-400"}`}>
                      {passChecks.special ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                      Speciální znak
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Potvrzení hesla</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-fuchsia-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
                    confirmPassword && passwordsMatch ? "border-green-500/50" : confirmPassword ? "border-red-500/50" : "border-white/10"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isPassStrong || !passwordsMatch}
            className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] cursor-pointer mt-4 overflow-hidden disabled:opacity-50"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? "Ukládání..." : "Změnit heslo"}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden flex flex-col items-center justify-center p-6">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-fuchsia-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true }
        ]}
        withNoise
      />

      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <Suspense fallback={<AuthLoading />}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
