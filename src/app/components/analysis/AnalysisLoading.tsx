import React from "react";
import { Zap } from "lucide-react";

interface AnalysisLoadingProps {
  progress: number;
}

export const AnalysisLoading: React.FC<AnalysisLoadingProps> = ({ progress }) => {
  const loadingMessages = [
    "Identifikuji strukturu dokumentu...",
    "Provádím screening bankovního trhu...",
    "Počítám finanční metriky a ROI...",
    "Generuji finální analytický report..."
  ];

  const currentStage = Math.min(Math.floor(progress / 25), 3);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in text-center max-w-md mx-auto">
      <div className="relative mb-12">
        <div className="h-32 w-32 rounded-[2.5rem] border-[3px] border-[color:var(--panel-border)] border-t-cyan-400 animate-spin" />
        <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400 animate-pulse" size={40} />
      </div>
      
      <div className="w-full space-y-8">
        <div className="space-y-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-[color:var(--muted-2)] uppercase tracking-[0.3em] font-black">AI Analysis Progress</span>
            <span className="text-xs font-black text-cyan-400 tracking-tighter">{Math.round(progress)}%</span>
          </div>
          <div className="relative h-2 w-full bg-[var(--panel)] rounded-full overflow-hidden border border-[color:var(--panel-border)]">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-[color:var(--foreground)] tracking-tight h-8 flex items-center justify-center transition-all duration-500">
            {loadingMessages[currentStage]}
          </h3>
          <p className="text-[9px] text-[color:var(--muted)] uppercase tracking-[0.5em] font-bold animate-pulse">Neural Core Processing</p>
        </div>
      </div>
    </div>
  );
};
