import React from "react";
import { Zap, Check, X, Pencil, Search } from "lucide-react";
import { Modal } from "../ui/Modal";
import { ModalSkeleton } from "../ui/ModalSkeleton";
import { HistoryItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface HistoryDetailModalProps {
  item: HistoryItem | null;
  isEditingName: boolean;
  tempName: string;
  isLoading?: boolean;
  onClose: () => void;
  onRename: (id: string, name: string) => void;
  onEditToggle: (editing: boolean) => void;
  onTempNameChange: (name: string) => void;
  onReturnToAnalysis: (item: HistoryItem) => void;
  onConsultation: (item: HistoryItem) => void;
}

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({
  item,
  isEditingName,
  tempName,
  isLoading = false,
  onClose,
  onRename,
  onEditToggle,
  onTempNameChange,
  onReturnToAnalysis,
  onConsultation
}) => {
  if (isLoading || !item) {
    return (
      <Modal onClose={onClose} title="Načítám detaily...">
        <ModalSkeleton />
      </Modal>
    );
  }

  return (
    <Modal
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
            <Zap size={20} className="text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => onTempNameChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRename(String(item.id), tempName);
                      } else if (e.key === 'Escape') {
                        onEditToggle(false);
                        onTempNameChange(item.fileName || "");
                      }
                    }}
                    autoFocus
                    className="bg-[var(--panel-strong)] border border-indigo-500/50 rounded-lg px-2 py-1 text-xs font-black text-[color:var(--foreground)] uppercase tracking-widest outline-none focus:border-indigo-400 w-32 md:w-48"
                  />
                  <button
                    onClick={() => onRename(String(item.id), tempName)}
                    className="h-6 w-6 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded transition-colors"
                  >
                    <Check size={14} className="text-white" />
                  </button>
                  <button
                    onClick={() => {
                      onEditToggle(false);
                      onTempNameChange(item.fileName || "");
                    }}
                    className="h-6 w-6 flex items-center justify-center bg-rose-600 hover:bg-rose-500 rounded transition-colors"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-black text-[color:var(--foreground)] uppercase tracking-widest text-xs md:text-sm truncate max-w-[150px] md:max-w-[300px]">
                    {item.fileName || "Textová analýza"}
                  </h2>
                  <button
                    onClick={() => {
                      onEditToggle(true);
                      onTempNameChange(item.fileName || "");
                    }}
                    className="h-6 w-6 flex items-center justify-center text-[color:var(--muted)] hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[9px] text-[color:var(--muted)] font-bold tracking-[0.2em]">{item.date}</p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition-colors cursor-pointer">Zavřít</button>
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            <button onClick={() => onReturnToAnalysis(item)} className="flex-1 px-6 py-3 bg-[var(--background)] border border-indigo-500/30 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500/10 hover:border-indigo-500/60 transition-all flex items-center justify-center gap-2 group cursor-pointer"><Search size={14} className="group-hover:scale-110 transition-transform duration-300" /> Zobrazit analýzu</button>
            <button
              onClick={() => onConsultation(item)}
              className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Zap size={14} className="fill-white" /> AI Konzultace
            </button>
          </div>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-[1.8rem] bg-white/5 border border-white/5 flex flex-col gap-1 shadow-inner">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Měsíční úspora</span>
          <span className="text-2xl font-black text-cyan-400">{formatCurrency(Number(item.uspora))}</span>
        </div>
        <div className="p-6 rounded-[1.8rem] bg-white/5 border border-white/5 flex flex-col gap-1 shadow-inner">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Roční úspora</span>
          <span className="text-2xl font-black text-indigo-400">{formatCurrency(Number(item.uspora) * 12)}</span>
        </div>
        <div className="p-6 rounded-[1.8rem] bg-white/5 border border-white/5 flex flex-col gap-1 shadow-inner">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Fixace do</span>
          <span className="text-2xl font-black text-white">{item.fixace || "Není uvedeno"}</span>
        </div>
        <div className="p-6 rounded-[1.8rem] bg-white/5 border border-white/5 flex flex-col gap-1 shadow-inner">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Tržní sazba</span>
          <span className="text-2xl font-black text-fuchsia-400">{item.aktualni_trzni_sazba || "---"}</span>
        </div>
      </div>

      <div className="mt-6 p-6 rounded-[2rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Hlavní doporučení</h4>
        <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
          "{item.analyticky_duvod || "Na základě vaší smlouvy doporučujeme zvážit refinancování u konkurenční banky pro dosažení maximální úspory."}"
        </p>
      </div>
    </Modal>
  );
};
