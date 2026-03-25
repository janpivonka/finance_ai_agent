import React from "react";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";

interface ConsultationInputProps {
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isCalling: boolean;
}

export const ConsultationInput: React.FC<ConsultationInputProps> = ({ 
  inputValue, 
  onInputChange, 
  onSendMessage, 
  isCalling 
}) => {
  const { activeId, handleInteraction } = useMobileInteraction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInteraction('send-message', () => onSendMessage(e), 350);
  };

  return (
    <div className="shrink-0 pt-4 md:pt-6">
      <form onSubmit={handleSubmit} className="relative flex gap-2 md:gap-4">
        <div className="relative flex-1 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[1.5rem] md:rounded-[2rem] opacity-0 group-focus-within:opacity-20 transition duration-500 blur" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={!isCalling}
            placeholder={isCalling ? "Zadejte dotaz..." : "Aktivujte chat..."}
            className="relative w-full rounded-[1.5rem] md:rounded-[2rem] border border-[color:var(--panel-border)] bg-[var(--panel-strong)] px-5 py-3.5 md:px-8 md:py-5 text-[13px] md:text-[14px] font-bold text-[color:var(--foreground)] outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 placeholder:text-[color:var(--muted-2)] shadow-xl"
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || !isCalling}
          className={`group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[var(--button-primary-bg)] text-[color:var(--button-primary-text)] px-6 md:px-12 py-3.5 md:py-5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all enabled:hover:scale-105 enabled:hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--panel-strong)] disabled:text-[color:var(--muted)] active:scale-95 shadow-xl cursor-not-allowed enabled:cursor-pointer border border-[color:var(--panel-border)] ${activeId === 'send-message' ? 'scale-105 bg-[var(--button-primary-hover-bg)]' : ''}`}
        >
          <span className="relative z-10">Send</span>
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer ${activeId === 'send-message' ? 'animate-shimmer' : ''}`} />
        </button>
      </form>
    </div>
  );
};
