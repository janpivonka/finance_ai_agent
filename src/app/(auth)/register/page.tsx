"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, User, ArrowLeft, ArrowRight, Github, Chrome, Eye, EyeOff, CheckCircle2, AlertCircle, Check, X } from "lucide-react";
import { PageBackground } from "../../components/ui/PageBackground";
import { ThemeToggle } from "../../components/ui/ThemeToggle";
import AuthLoading from "../loading";
import { useUser } from "../../components/UserContext";
import { PasswordFields } from "../../components/ui/PasswordFields";

export default function RegisterPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useUser();
  const [mounted, setMounted] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  // Refs pro validaci a focus
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const agreedRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    agreed: false 
  });
  const [error, setError] = useState("");

  // Základní validace polí
  const isNameValid = formData.name.trim().length >= 6 && formData.name.trim().includes(" ");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordsMatch = formData.confirmPassword !== "" && formData.password === formData.confirmPassword;
  const passwordsDoNotMatch = formData.confirmPassword !== "" && formData.password !== formData.confirmPassword;

  // Validace síly hesla
  const passChecks = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };
  const isPassStrong = Object.values(passChecks).every(Boolean);

  // Debounced email check
  React.useEffect(() => {
    const checkEmail = async () => {
      if (isEmailValid) {
        setIsCheckingEmail(true);
        try {
          const res = await fetch("/api/user/check-email", {
            method: "POST",
            body: JSON.stringify({ email: formData.email }),
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          setEmailExists(data.exists);
        } catch (err) {
          console.error("Error checking email:", err);
        } finally {
          setIsCheckingEmail(false);
        }
      } else {
        setEmailExists(false);
      }
    };

    const timer = setTimeout(checkEmail, 500);
    return () => clearTimeout(timer);
  }, [formData.email, isEmailValid]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Sekvenční validace s focusem na první chybu
    if (!isNameValid) {
      setError("Zadejte prosím své celé jméno.");
      nameRef.current?.focus();
      return;
    }

    if (!isEmailValid) {
      setError("Zadejte prosím platnou e-mailovou adresu.");
      emailRef.current?.focus();
      return;
    }

    if (emailExists) {
      setError("Uživatel s tímto e-mailem již existuje.");
      emailRef.current?.focus();
      return;
    }

    if (!isPassStrong) {
      setError("Heslo musí splňovat všechny bezpečnostní požadavky.");
      passwordRef.current?.focus();
      return;
    }

    if (!passwordsMatch) {
      setError("Hesla se musí shodovat.");
      confirmPasswordRef.current?.focus();
      return;
    }

    if (!formData.agreed) {
      setError("Pro pokračování musíte souhlasit s podmínkami.");
      agreedRef.current?.focus();
      return;
    }

    try {
      await login({ 
        name: formData.name || "Uživatel", 
        email: formData.email,
        password: formData.password
      }, false); // isLogin = false pro registraci
      
      setIsSuccess(true);
      
      // Navigace po 3 sekundách
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

    } catch (err: any) {
      console.error("Chyba při registraci:", err);
      if (err.message.includes("already exists") || err.message.includes("Email already in use")) {
        setError("Uživatel s tímto e-mailem již existuje.");
      } else {
        setError(err.message || "Registrace se nezdařila. Zkuste to prosím znovu.");
      }
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
              {isSuccess ? <CheckCircle2 className="text-white" size={36} /> : <ShieldCheck className="text-white" size={36} />}
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-[color:var(--foreground)] mb-2">
              {isSuccess ? "Účet vytvořen!" : "Vytvořit účet"}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {isSuccess ? "Přesměrováváme vás na dashboard..." : "Začněte šetřit s AI finančním agentem"}
            </p>
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, x: 0 }}
                  animate={{ opacity: 1, y: 0, x: [0, -5, 5, -5, 5, 0] }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold w-full flex items-center gap-2"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold w-full flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Registrace proběhla úspěšně.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Přihlašování...</p>
            </div>
          ) : (
            <>
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
                  ref={nameRef}
                  type="text" 
                  placeholder="Jan Novák"
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const capitalized = val
                      .split(" ")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ");
                    setFormData({...formData, name: capitalized});
                  }}
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
                    formData.name && isNameValid 
                      ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/10" 
                      : formData.name && !isNameValid
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                      : "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/10"
                  }`}
                  required
                />
                <AnimatePresence>
                  {formData.name && isNameValid && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-y-0 right-4 flex items-center text-green-500"
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">E-mailová adresa</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  ref={emailRef}
                  type="email" 
                  placeholder="jmeno@priklad.cz"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
                    formData.email && isEmailValid && !emailExists
                      ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/10" 
                      : (formData.email && !isEmailValid) || emailExists
                      ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                      : "border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/10"
                  }`}
                  required
                />
                <AnimatePresence>
                  {isCheckingEmail && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-y-0 right-4 flex items-center"
                    >
                      <div className="w-4 h-4 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    </motion.div>
                  )}
                  {formData.email && isEmailValid && !emailExists && !isCheckingEmail && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-y-0 right-4 flex items-center text-green-500"
                    >
                      <CheckCircle2 size={18} />
                    </motion.div>
                  )}
                  {emailExists && !isCheckingEmail && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-y-0 right-4 flex items-center text-red-500"
                    >
                      <AlertCircle size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {emailExists && !isCheckingEmail && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-1.5 ml-4">
                  Tento e-mail je již registrován
                </p>
              )}
            </div>

            <PasswordFields 
              passwordValue={formData.password}
              confirmPasswordValue={formData.confirmPassword}
              onPasswordChange={(val) => setFormData({...formData, password: val})}
              onConfirmPasswordChange={(val) => setFormData({...formData, confirmPassword: val})}
              accentColor="fuchsia"
            />

            <div className="flex items-start gap-3 ml-4 py-2">

            <div className="flex items-start gap-3 ml-4 py-2">
              <input 
                ref={agreedRef}
                type="checkbox" 
                id="agreed"
                checked={formData.agreed}
                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                className={`mt-1 w-4 h-4 rounded-md border transition-all cursor-pointer ${
                  formData.agreed 
                    ? "bg-indigo-600 border-indigo-600" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                required 
              />
              <label htmlFor="agreed" className={`text-[10px] font-black uppercase tracking-widest leading-relaxed transition-colors cursor-pointer ${formData.agreed ? "text-[color:var(--foreground)]" : "text-slate-500"}`}>
                Souhlasím s <span className="text-indigo-400 hover:underline">podmínkami služby</span> a <span className="text-indigo-400 hover:underline">ochranou osobních údajů</span>.
              </label>
            </div>

            <button 
              type="submit"
              disabled={isSuccess}
              className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] cursor-pointer mt-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                Vytvořit účet
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
          </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
