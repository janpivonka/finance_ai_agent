"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "../UserContext";

export const LeadCaptureCard: React.FC = () => {
  const router = useRouter();
  const { updateUser } = useUser();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update user in context and DB
      await updateUser({ email, phone });
      
      // Navigate to register/onboarding
      router.push("/register");
    } catch (err) {
      console.error("Lead capture error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="mt-12 p-8 md:p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-600 to-indigo-900 border border-white/20 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full mb-6">
            <Sparkles size={16} className="text-cyan-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Získejte kompletní report</span>
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
            Chcete ušetřit těchto <br />
            <span className="text-cyan-300 italic">peníze okamžitě?</span>
          </h3>
          
          <p className="text-indigo-100/80 font-medium mb-8">
            Zanechte nám svůj kontakt a my vám zašleme detailní srovnání všech bank a postup, jak úsporu získat do 24 hodin.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white/60 text-xs font-bold">
              <ShieldCheck size={16} className="text-cyan-400" />
              Vaše data jsou u nás v bezpečí (GDPR compliant)
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60 ml-4">E-mail pro zaslání reportu</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-300 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vas@email.cz"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white placeholder:text-white/20 outline-none focus:border-cyan-400/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60 ml-4">Telefon pro konzultaci</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-300 transition-colors" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+420 777 123 456"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white placeholder:text-white/20 outline-none focus:border-cyan-400/50 transition-all"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full group relative flex items-center justify-center gap-3 py-5 bg-cyan-400 hover:bg-cyan-300 text-indigo-900 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl overflow-hidden cursor-pointer"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
              ) : (
                <>
                  Získat výsledky
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-indigo-200/40 text-[10px] font-bold uppercase tracking-widest">
            Pokračováním souhlasíte se zpracováním údajů.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
