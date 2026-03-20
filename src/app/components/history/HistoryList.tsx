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
  itemsRef
}) => (
  <motion.div layout layoutScroll key="history-list" className="flex flex-col gap-6 relative z-10 overflow-anchor-none">
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-3 right-3 bottom-24 md:bottom-auto md:top-6 md:left-auto md:right-6 md:w-[420px] flex items-center justify-between p-4 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl backdrop-blur-xl z-[80] shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={onToggleSelectAll}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors cursor-pointer"
            >
              {selectedIds.length === items.length ? <CheckSquare size={16} /> : <Square size={16} />}
              {selectedIds.length === items.length ? "Zrušit vše" : "Vybrat vše"}
            </button>
            <span className="h-4 w-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
              Vybráno: <span className="text-white">{selectedIds.length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClearSelection}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              Zrušit
            </button>
            <button 
              onClick={onBulkDelete}
              className="flex items-center gap-2 px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <Trash2 size={14} /> Smazat vybrané
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    <motion.div layout layoutScroll className="grid gap-4 overflow-anchor-none">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            isHighlighted={highlightedId === String(item.id)}
            isSelected={selectedIds.includes(String(item.id))}
            sortBy={sortBy}
            onEntryClick={onEntryClick}
            onToggleSelect={onToggleSelect}
            onDeleteClick={onDeleteClick}
            innerRef={(el) => { itemsRef.current[String(item.id)] = el; }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  </motion.div>
);
