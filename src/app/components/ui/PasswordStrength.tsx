"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = "" }) => {
  if (!password) return null;

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const checkItems = [
    { label: "8+ znaků", met: checks.length },
    { label: "Velké písmeno", met: checks.upper },
    { label: "Číslice", met: checks.number },
    { label: "Speciální znak", met: checks.special },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3"
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-relaxed">
        Bezpečnostní požadavky:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {checkItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${
              item.met ? "text-green-500" : "text-red-400"
            }`}
          >
            {item.met ? (
              <Check size={12} strokeWidth={3} className="shrink-0" />
            ) : (
              <X size={12} strokeWidth={3} className="shrink-0" />
            )}
            {item.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
