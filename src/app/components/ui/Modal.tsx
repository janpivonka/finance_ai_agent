// src/app/components/ui/Modal.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface ModalProps {
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  hideHeader?: boolean;
}

const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const contentVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: 20, scale: 0.98 },
};

export const Modal: React.FC<ModalProps> = ({ 
  onClose, 
  title, 
  children, 
  footer,
  maxWidth = "max-w-2xl",
  hideHeader = false
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" aria-modal="true" role="dialog">
      {/* Overlay */}
      <motion.div 
        key="modal-overlay"
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md" 
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={onClose} 
      />
      
      {/* Content */}
      <motion.div 
        key="modal-content"
        className={`bg-[#0f172a]/95 border border-white/10 w-full ${maxWidth} max-h-[85vh] md:max-h-[90vh] rounded-[2rem] relative z-10 shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {!hideHeader && (
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl">
            {typeof title === 'string' ? (
              <h3 className="text-lg font-black text-white italic uppercase tracking-widest">{title}</h3>
            ) : (
              title || <div />
            )}
            <button 
              onClick={onClose} 
              className="h-9 w-9 flex items-center justify-center bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-xl transition-all text-slate-400 cursor-pointer shrink-0 ml-4 border border-white/5"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto scrollbar-hide custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-xl">
            {footer}
          </div>
        )}
      </motion.div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};
