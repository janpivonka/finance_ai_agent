// src/app/components/ui/DuplicateNameModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { AlertCircle, Copy, Edit3, Check } from "lucide-react";

interface DuplicateNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  originalName: string;
  suggestedName: string;
}

export const DuplicateNameModal: React.FC<DuplicateNameModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  originalName,
  suggestedName,
}) => {
  const [mode, setMode] = useState<"choice" | "edit">("choice");
  const [customName, setCustomName] = useState(originalName);

  useEffect(() => {
    if (isOpen) {
      setMode("choice");
      setCustomName(originalName);
    }
  }, [isOpen, originalName]);

  if (!isOpen) return null;

  return (
    <Modal
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
            <AlertCircle size={18} />
          </div>
          <h3 className="text-sm md:text-base font-black text-[color:var(--foreground)] italic uppercase tracking-widest">
            Duplicitní název
          </h3>
        </div>
      }
      maxWidth="max-w-md"
    >
      <div className="p-6 space-y-6">
        <p className="text-[13px] md:text-[14px] font-bold leading-relaxed text-[color:var(--foreground-muted)]">
          Analýza s názvem <span className="text-indigo-500 italic">"{originalName}"</span> již v historii existuje. Jak si přejete pokračovat?
        </p>

        {mode === "choice" ? (
          <div className="grid gap-3">
            <button
              onClick={() => onConfirm(suggestedName)}
              className="group flex items-center justify-between p-4 rounded-[1.5rem] border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
                  <Copy size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-widest text-indigo-500 mb-1">Automatický index</span>
                  <span className="text-[13px] font-bold text-[color:var(--foreground)]">{suggestedName}</span>
                </div>
              </div>
              <Check size={18} className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setMode("edit")}
              className="group flex items-center justify-between p-4 rounded-[1.5rem] border border-[color:var(--panel-border)] bg-[var(--panel-strong)] hover:border-indigo-500/30 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[var(--background)] text-[color:var(--muted)] group-hover:text-indigo-500 group-hover:bg-indigo-500/10 transition-all">
                  <Edit3 size={20} />
                </div>
                <div>
                  <span className="block text-[11px] font-black uppercase tracking-widest text-[color:var(--muted)] mb-1">Vlastní název</span>
                  <span className="text-[13px] font-bold text-[color:var(--foreground)] italic">Zadat ručně...</span>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="relative group">
              <input
                autoFocus
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && customName.trim() && onConfirm(customName.trim())}
                className="w-full rounded-2xl border border-indigo-500/30 bg-[var(--background)] px-5 py-4 text-[14px] font-bold text-[color:var(--foreground)] outline-none ring-2 ring-transparent focus:ring-indigo-500/20 transition-all"
                placeholder="Zadejte nový název..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("choice")}
                className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] hover:text-white transition-colors cursor-pointer"
              >
                Zpět
              </button>
              <button
                onClick={() => customName.trim() && onConfirm(customName.trim())}
                disabled={!customName.trim()}
                className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                Potvrdit název
              </button>
            </div>
          </div>
        )}
      </div>

      {mode === "choice" && (
        <div className="p-6 border-t border-[color:var(--panel-border)] bg-[var(--panel)]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] hover:text-rose-500 transition-colors cursor-pointer"
          >
            Zrušit ukládání
          </button>
        </div>
      )}
    </Modal>
  );
};
