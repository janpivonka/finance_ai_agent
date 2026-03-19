import React from "react";

interface ConsultationLoadingProps {
  starting: boolean;
  awaitingFirstTranscript: boolean;
  onStop: () => void;
}

export const ConsultationLoading: React.FC<ConsultationLoadingProps> = ({ 
  starting, 
  awaitingFirstTranscript, 
  onStop 
}) => {
  if (!starting && !awaitingFirstTranscript) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020617]/85 backdrop-blur-md">
      <div className="mx-6 w-full max-w-md rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 shadow-2xl ring-1 ring-white/10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-fuchsia-500/10 ring-1 ring-fuchsia-500/20 shadow-[0_0_40px_rgba(217,70,219,0.12)]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-fuchsia-500/30 border-t-fuchsia-400" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">
            Navazuji spojení…
          </p>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Hovor začne každou chvíli. Jakmile se objeví první přepis, pokračujeme.
          </p>
          <button
            type="button"
            onClick={onStop}
            className="mt-8 inline-flex items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-950/20 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-200 hover:bg-fuchsia-500/10 transition-all cursor-pointer"
          >
            Zrušit připojení
          </button>
        </div>
      </div>
    </div>
  );
};
