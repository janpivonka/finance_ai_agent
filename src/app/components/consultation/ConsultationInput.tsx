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
  <div className="shrink-0 border-t border-white/5 bg-[#020617]/80 p-6 backdrop-blur-md">
    <form onSubmit={onSendMessage} className="relative flex gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={!isCalling}
          placeholder={isCalling ? "Zadejte dotaz pro AI agenta..." : "Pro aktivaci chatu zahajte spojení"}
          className="w-full rounded-2xl border border-white/10 bg-[#020617] px-6 py-4 text-sm font-medium text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-30 placeholder:text-slate-600 shadow-inner"
        />
      </div>
      <button
        type="submit"
        disabled={!inputValue.trim() || !isCalling}
        className="group rounded-2xl bg-white text-slate-950 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-700 active:scale-95 shadow-lg cursor-pointer"
      >
        Send
      </button>
    </form>
  </div>
);
