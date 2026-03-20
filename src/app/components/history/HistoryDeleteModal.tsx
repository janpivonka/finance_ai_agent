import React from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "../ui/Modal";

interface HistoryDeleteModalProps {
  isBulk: boolean;
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export const HistoryDeleteModal: React.FC<HistoryDeleteModalProps> = ({
  isBulk,
  selectedCount,
  onClose,
  onConfirm
}) => (
  <Modal 
    onClose={onClose}
    maxWidth="max-w-sm"
    hideHeader
  >
    <div className="p-8 flex flex-col items-center text-center">
      <div className="h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6 ring-1 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <AlertTriangle size={32} />
      </div>
      <h3 className="text-xl font-black text-[color:var(--foreground)] italic mb-2">
        {isBulk ? `Smazat ${selectedCount} záznamů?` : "Smazat záznam?"}
      </h3>
      <p className="text-sm text-[color:var(--muted)] leading-relaxed mb-8">
        Tato akce je nevratná. {isBulk ? "Všechny vybrané analýzy budou" : "Analýza bude"} trvale odstraněna.
      </p>
      <div className="flex gap-3 w-full">
        <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] hover:bg-white/5 transition-all cursor-pointer">Zrušit</button>
        <button onClick={onConfirm} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all cursor-pointer">Odstranit</button>
      </div>
    </div>
  </Modal>
);
