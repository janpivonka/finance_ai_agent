import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Square, Trash2 } from "lucide-react";
import { HistoryItem as HistoryItemType, SortField } from "@/types";
import { HistoryItem } from "./HistoryItem";

interface HistoryListProps {
  items: HistoryItemType[];
  selectedIds: string[];
  highlightedId: string | null;
  sortBy: SortField;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onEntryClick: (item: HistoryItemType) => void;
  onDeleteClick: (id: string | number) => void;
  itemsRef: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  activeEntryId?: string | null;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  items,
  selectedIds,
  highlightedId,
  sortBy,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  onBulkDelete,
  onEntryClick,
  onDeleteClick,
  itemsRef,
  activeEntryId = null
}) => (
  <motion.div 
    layout 
    key="history-list" 
    className="flex flex-col gap-6 relative z-10"
  >
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-24 right-4 left-auto bottom-auto md:top-6 md:right-6 md:w-auto md:min-w-[480px] flex flex-col md:flex-row items-stretch md:items-center justify-between p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl backdrop-blur-xl z-[150] shadow-[0_20px_40px_rgba(0,0,0,0.3)] gap-4 md:gap-8"
        >
          <div className="flex items-center justify-between md:justify-start gap-6">
            <button 
              onClick={onToggleSelectAll}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              {selectedIds.length === items.length ? <CheckSquare size={16} /> : <Square size={16} />}
              {selectedIds.length === items.length ? "Zrušit vše" : "Vybrat vše"}
            </button>
            <span className="hidden md:block h-4 w-px bg-white/10 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 whitespace-nowrap">
              Vybráno: <span className="text-white">{selectedIds.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={onClearSelection}
              className="flex-1 md:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Zrušit
            </button>
            <button 
              onClick={onBulkDelete}
              className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Trash2 size={14} /> Smazat vybrané
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    <div className="grid gap-4">
      <AnimatePresence initial={false}>
        {items.map((item, index) => (
          <HistoryItem
            key={item.id}
            item={item}
            isHighlighted={highlightedId === String(item.id)}
            isSelected={selectedIds.includes(String(item.id))}
            isActive={activeEntryId === String(item.id)}
            sortBy={sortBy}
            onEntryClick={(item) => onEntryClick(item)}
            onToggleSelect={onToggleSelect}
            onDeleteClick={onDeleteClick}
            innerRef={(el) => { itemsRef.current[String(item.id)] = el; }}
          />
        ))}
      </AnimatePresence>
    </div>
  </motion.div>
);
