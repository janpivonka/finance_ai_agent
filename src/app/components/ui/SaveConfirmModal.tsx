"use client";

import React from "react";
import { Modal } from "./Modal";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface SaveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "success";
}

export const SaveConfirmModal: React.FC<SaveConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Ano, uložit",
  cancelText = "Zrušit",
  type = "warning"
}) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} hideHeader maxWidth="max-w-md">
      <div className="p-8 text-center">
        <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
          type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
        }`}>
          {type === "warning" ? <AlertCircle size={32} /> : <CheckCircle2 size={32} />}
        </div>
        
        <h3 className="text-xl font-black text-white italic uppercase tracking-wider mb-3">
          {title}
        </h3>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          {description}
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg ${
              type === "warning" 
                ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
            }`}
          >
            {confirmText}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
