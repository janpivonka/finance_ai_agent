import React from "react";

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
}) => (
  <div className="shrink-0 pt-6">
    <form onSubmit={onSendMessage} className="relative flex gap-4">
      <div className="relative flex-1 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-[2rem] opacity-0 group-focus-within:opacity-20 transition duration-500 blur" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isCalling}
          placeholder={isCalling ? "Zadejte dotaz pro AI agenta..." : "Pro aktivaci chatu zahajte spojení"}
          className="relative w-full rounded-[2rem] border border-[color:var(--panel-border)] bg-[var(--panel-strong)] px-8 py-5 text-[14px] font-bold text-[color:var(--foreground)] outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 placeholder:text-[color:var(--muted-2)] shadow-xl"
        />
      </div>
      <button
        type="submit"
        disabled={!inputValue.trim() || !isCalling}
        className="group relative overflow-hidden rounded-[2rem] bg-[var(--button-primary-bg)] text-[color:var(--button-primary-text)] px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] transition-all enabled:hover:scale-105 enabled:hover:bg-[var(--button-primary-hover-bg)] disabled:bg-[var(--panel-strong)] disabled:text-[color:var(--muted)] active:scale-95 shadow-xl cursor-not-allowed enabled:cursor-pointer border border-[color:var(--panel-border)]"
      >
        <span className="relative z-10">Send</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </button>
    </form>
  </div>
);
