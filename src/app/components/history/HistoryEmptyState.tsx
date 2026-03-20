import React from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

interface HistoryEmptyStateProps {
  searchQuery: string;
}

export const HistoryEmptyState: React.FC<HistoryEmptyStateProps> = ({ searchQuery }) => (
  <motion.div 
    key="empty-state"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="text-center py-24 bg-[var(--panel)] backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-[color:var(--panel-border)] flex flex-col items-center relative z-10 reveal"
  >
    <div className="h-20 w-20 rounded-3xl bg-[var(--panel-strong)] flex items-center justify-center mb-6 text-[color:var(--muted-2)]">
      <Layers size={32} />
    </div>
    <p className="text-[color:var(--muted)] font-bold uppercase tracking-widest text-xs">
      {searchQuery ? "Nebylo nic nalezeno" : "Archiv je prázdný"}
    </p>
  </motion.div>
);
