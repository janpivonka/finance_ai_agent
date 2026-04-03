"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Github, 
  Chrome, 
  Facebook, 
  Camera,
  Save,
  Smartphone,
  Globe,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { PageBackground } from "../../components/ui/PageBackground";
import { PageHeader } from "../../components/ui/PageHeader";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";
import SettingsLoading from "./loading";
import { useUser } from "../../components/UserContext";
import { SaveConfirmModal } from "../../components/ui/SaveConfirmModal";
import { Modal } from "../../components/ui/Modal";
import { PasswordStrength } from "../../components/ui/PasswordStrength";

// Pomocná komponenta pro avatar s robustním fallbackem (stejná jako v Sidebar)
const UserAvatar = ({ user, className }: { user: any, className?: string }) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [user?.image]);

  if (user?.image && !imgError) {
    return (
      <img
        src={user.image}
        alt={user?.name || "Profil"}
        className={`${className} object-cover`}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className={`${className} bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black`}>
      <User size={className?.includes('w-32') ? 64 : 20} className="text-white/80" />
    </div>
  );
};

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { activeId, handleInteraction } = useMobileInteraction();
  const { user, isLoading, updateUser, connectSocialAccount, disconnectSocialAccount } = useUser();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Local state for the form to avoid lag
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    image: ""
  });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        image: user.image || ""
      });
    }
  }, [user]);

  const validateEmail = async (email: string) => {
    if (email === user?.email) return true;
    
    try {
      const res = await fetch("/api/user/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currentUserId: user?.id })
      });
      const data = await res.json();
      if (!data.available) {
        setEmailError("Tento e-mail již používá jiný uživatel.");
        return false;
      }
      setEmailError("");
      return true;
    } catch (error) {
      console.error("Email validation error:", error);
      return false;
    }
  };

  const handleSaveClick = async () => {
    const isEmailValid = await validateEmail(formData.email);
    if (!isEmailValid) return;
    
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmModalOpen(false);
    handleInteraction('save-settings', async () => {
      setIsSaving(true);
      await updateUser(formData);
      setIsSaving(false);
    }, 350);
  };

  const handlePasswordChange = async () => {
    // Validace hesla (shodná s register page)
    const passChecks = {
      length: passwordData.newPassword.length >= 8,
      upper: /[A-Z]/.test(passwordData.newPassword),
      number: /[0-9]/.test(passwordData.newPassword),
      special: /[^A-Za-z0-9]/.test(passwordData.newPassword)
    };
    const isPassStrong = Object.values(passChecks).every(Boolean);

    if (!isPassStrong) {
      setPasswordError("Heslo musí splňovat všechny bezpečnostní požadavky.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Hesla se neshodují.");
      return;
    }

    // Upozornění pro OAuth uživatele při prvním nastavení hesla
    if (!user?.hasPassword) {
      const confirmSecurity = confirm("Nastavením hesla měníte způsob zabezpečení vašeho účtu. Budete se moci přihlásit jak přes Google, tak pomocí e-mailu a hesla. Přejete si pokračovat?");
      if (!confirmSecurity) return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          password: passwordData.newPassword,
          currentPassword: passwordData.currentPassword 
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Chyba při změně hesla.");
      } else {
        setIsPasswordModalOpen(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordError("");
        alert("Heslo bylo úspěšně změněno.");
      }
    } catch (error) {
      setPasswordError("Nastala neočekávaná chyba.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAccount = async (provider: string, isConnected: boolean) => {
    if (isConnected) {
      await disconnectSocialAccount(provider);
    } else {
      await connectSocialAccount(provider);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kontrola velikosti (např. max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Obrázek je příliš velký. Maximální velikost je 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  if (!mounted || isLoading) return <SettingsLoading />;

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-16 pb-24 relative overflow-x-hidden selection:bg-indigo-500/30 no-scrollbar">
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-cyan-600", size: "w-[600px] h-[600px]", opacity: "opacity-5" }
        ]}
        withNoise
      />

      <div className="mx-auto max-w-5xl relative z-10">
        <PageHeader 
          badgeIcon={ShieldCheck}
          badgeText="User Profile Security"
          revealType="on-load"
          title={
            <>
              Nastavení <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Profilu</span>
            </>
          }
          description="Spravujte své osobní údaje, kontaktní informace a propojené sociální sítě na jednom místě."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* LEFT COLUMN - PROFILE CARD */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-[3rem] bg-[var(--panel)] border border-[color:var(--panel-border)] shadow-2xl relative overflow-hidden group"
            >
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-cyan-400 p-1 shadow-2xl group/avatar relative">
                    <div className="w-full h-full rounded-full bg-[var(--panel-strong)] flex items-center justify-center overflow-hidden relative">
                      <UserAvatar 
                        user={{ ...user, image: formData.image }} 
                        className="w-full h-full" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer border-none outline-none"
                        title="Změnit profilovou fotku"
                      >
                        <Camera size={24} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[var(--panel)] shadow-lg" />
                  
                  {/* Skrytý file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <h3 className="text-2xl font-black text-[color:var(--foreground)] tracking-tight mb-1">{formData.name}</h3>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 italic">Premium Member</p>
                <p className="text-sm text-[color:var(--muted)] font-medium px-4">{formData.bio}</p>
              </div>

              <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[color:var(--muted)]">
                  <span>Členem od</span>
                  <span className="text-[color:var(--foreground)]">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('cs-CZ', { month: 'long', year: 'numeric' }) 
                      : "Březen 2026"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-[color:var(--muted)]">
                  <span>Analýz celkem</span>
                  <span className="text-[color:var(--foreground)]">{user?.totalAnalyses || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* SECURITY BOX */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-500/20 shadow-xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck size={20} className="text-indigo-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Zabezpečení účtu</h4>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mb-4">
                {user?.hasPassword 
                  ? "Váš účet je chráněn heslem. Pro maximální bezpečnost doporučujeme heslo pravidelně měnit."
                  : "Váš účet zatím nemá nastavené heslo (přihlašujete se přes Google). Nastavte si heslo pro alternativní způsob přihlášení."
                }
              </p>
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-500 transition-colors w-full"
              >
                {user?.hasPassword ? "Změnit heslo" : "Nastavit heslo"}
              </button>
            </motion.div>
          </div>

          {/* RIGHT COLUMN - SETTINGS FORM */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 md:p-10 rounded-[3rem] bg-[var(--panel)] border border-[color:var(--panel-border)] shadow-2xl"
            >
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--muted)] mb-8 flex items-center gap-3">
                <Smartphone size={16} /> Osobní informace
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Celé jméno</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-[color:var(--foreground)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">E-mailová adresa</label>
                  <div className="relative group">
                    <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`w-full bg-white/5 border rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:ring-4 transition-all text-[color:var(--foreground)] ${
                        emailError 
                          ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' 
                          : 'border-white/10 focus:border-cyan-500/50 focus:ring-cyan-500/10'
                      }`}
                    />
                  </div>
                  {emailError && <p className="text-[10px] text-rose-500 font-bold ml-4 mt-1">{emailError}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Telefonní číslo</label>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-fuchsia-400 transition-colors" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-fuchsia-500/50 focus:ring-4 focus:ring-fuchsia-500/10 transition-all text-[color:var(--foreground)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Region / Jazyk</label>
                  <div className="relative group">
                    <Globe size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all text-[color:var(--foreground)] appearance-none">
                      <option>Česká republika (CZ)</option>
                      <option>Slovensko (SK)</option>
                      <option>English (Global)</option>
                    </select>
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[color:var(--muted)] mb-8 mt-12 flex items-center gap-3">
                <Globe size={16} /> Propojené účty
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'google', name: 'Google', icon: Chrome, color: 'text-rose-500' },
                  { id: 'github', name: 'GitHub', icon: Github, color: 'text-white' },
                  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' }
                ].map((account) => {
                  const isConnected = user?.connectedAccounts[account.id as keyof typeof user.connectedAccounts];
                  const Icon = account.icon;
                  return (
                    <div key={account.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${account.color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest text-[color:var(--foreground)]">{account.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{isConnected ? 'Propojeno' : 'Nenastaveno'}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleAccount(account.id, !!isConnected)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isConnected 
                            ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                        }`}
                      >
                        {isConnected ? 'Odpojit' : 'Propojit'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-end">
                <button
                  onClick={handleSaveClick}
                  disabled={isSaving}
                  className={`group relative flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(79,70_229,0.3)] cursor-pointer overflow-hidden ${isSaving ? 'opacity-70 scale-95' : ''}`}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    {isSaving ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    {isSaving ? "Ukládám..." : "Uložit změny"}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <SaveConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="Uložit změny?"
        description="Opravdu si přejete uložit provedené změny v profilu? Všechny informace budou aktualizovány v databázi."
      />

      <AnimatePresence>
        {isPasswordModalOpen && (
          <Modal onClose={() => setIsPasswordModalOpen(false)} title={user?.hasPassword ? "Změna hesla" : "Nastavení hesla"} maxWidth="max-w-md">
            <div className="p-8 space-y-6">
              {user?.hasPassword && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Současné heslo</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-12 text-sm font-medium focus:outline-none focus:border-indigo-500/50 transition-all text-white"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              <PasswordFields 
                passwordValue={passwordData.newPassword}
                confirmPasswordValue={passwordData.confirmPassword}
                onPasswordChange={(val) => setPasswordData({...passwordData, newPassword: val})}
                onConfirmPasswordChange={(val) => setPasswordData({...passwordData, confirmPassword: val})}
                passwordLabel={user?.hasPassword ? "Nové heslo" : "Heslo"}
                confirmPasswordLabel={user?.hasPassword ? "Potvrzení nového hesla" : "Potvrzení hesla"}
                accentColor="indigo"
              />

              {passwordError && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold text-center">
                  {passwordError}
                </div>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={isSaving}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70"
              >
                {isSaving 
                  ? (user?.hasPassword ? "Měním heslo..." : "Nastavuji heslo...") 
                  : (user?.hasPassword ? "Změnit heslo" : "Nastavit heslo")
                }
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
