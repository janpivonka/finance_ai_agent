"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { PasswordStrength } from "./PasswordStrength";

interface PasswordFieldsProps {
  passwordValue: string;
  confirmPasswordValue: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  showStrength?: boolean;
  accentColor?: "indigo" | "fuchsia" | "cyan";
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  passwordValue,
  confirmPasswordValue,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordPlaceholder = "••••••••",
  confirmPasswordPlaceholder = "••••••••",
  passwordLabel = "Heslo",
  confirmPasswordLabel = "Potvrzení hesla",
  showStrength = true,
  accentColor = "fuchsia"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = confirmPasswordValue !== "" && passwordValue === confirmPasswordValue;
  const passwordsDoNotMatch = confirmPasswordValue !== "" && passwordValue !== confirmPasswordValue;

  const getAccentClass = () => {
    switch (accentColor) {
      case "indigo": return "focus:border-indigo-500/50 focus:ring-indigo-500/10 group-focus-within:text-indigo-400";
      case "cyan": return "focus:border-cyan-500/50 focus:ring-cyan-500/10 group-focus-within:text-cyan-400";
      default: return "focus:border-fuchsia-500/50 focus:ring-fuchsia-500/10 group-focus-within:text-fuchsia-400";
    }
  };

  const accentClass = getAccentClass();

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{passwordLabel}</label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 transition-colors ${accentClass.split(' ').pop()}`}>
            <Lock size={18} />
          </div>
          <input 
            type={showPassword ? "text" : "password"} 
            value={passwordValue}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={passwordPlaceholder}
            className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] border-white/10 ${accentClass}`}
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
        {showStrength && <PasswordStrength password={passwordValue} />}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">{confirmPasswordLabel}</label>
        <div className="relative group">
          <div className={`absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 transition-colors ${accentClass.split(' ').pop()}`}>
            <Lock size={18} />
          </div>
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            value={confirmPasswordValue}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder={confirmPasswordPlaceholder}
            className={`w-full bg-white/5 border rounded-2xl py-3.5 pl-14 pr-12 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
              passwordsDoNotMatch 
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10" 
                : passwordsMatch
                ? "border-green-500/50 focus:border-green-500 focus:ring-green-500/10"
                : `border-white/10 ${accentClass}`
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
        {confirmPasswordValue !== "" && (
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-1.5 ml-4 ${passwordsMatch ? "text-green-500" : "text-red-500"}`}>
            {passwordsMatch ? "Hesla se shodují" : "Hesla se neshodují"}
          </p>
        )}
      </div>
    </div>
  );
};
