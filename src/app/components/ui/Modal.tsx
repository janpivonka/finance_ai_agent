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
        className="absolute inset-0 bg-[color:var(--background)]/80 backdrop-blur-md" 
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
        className={`bg-[var(--panel-strong)] border border-[color:var(--panel-border-strong)] w-full ${maxWidth} max-h-[85vh] md:max-h-[90vh] rounded-[2rem] relative z-10 shadow-2xl overflow-hidden flex flex-col ring-1 ring-[color:var(--panel-border)]`}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {!hideHeader && (
          <div className="px-6 py-5 border-b border-[color:var(--panel-border)] flex items-center justify-between bg-[var(--panel)] backdrop-blur-xl">
            {typeof title === 'string' ? (
              <h3 className="text-lg font-black text-[color:var(--foreground)] italic uppercase tracking-widest">{title}</h3>
            ) : (
              title || <div />
            )}
            <button 
              onClick={onClose} 
              className="h-9 w-9 flex items-center justify-center bg-[var(--panel)] hover:bg-rose-500/20 hover:text-rose-500 rounded-xl transition-all text-[color:var(--muted)] cursor-pointer shrink-0 ml-4 border border-[color:var(--panel-border)]"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto scrollbar-hide custom-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-[color:var(--panel-border)] bg-[var(--panel-strong)] backdrop-blur-xl">
            {footer}
          </div>
        )}
      </motion.div>
    </div>
  );
};
