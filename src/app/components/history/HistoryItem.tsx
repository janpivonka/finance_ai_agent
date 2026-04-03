import React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, TrendingUp, Trash2, ChevronRight, CheckSquare, Square } from "lucide-react";
import { HistoryItem as HistoryItemType, SortField } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface HistoryItemProps {
  item: HistoryItemType;
  isHighlighted: boolean;
  isSelected: boolean;
  sortBy: SortField;
  onEntryClick: (item: HistoryItemType) => void;
  onToggleSelect: (id: string) => void;
  onDeleteClick: (id: string | number) => void;
  innerRef?: (el: HTMLDivElement | null) => void;
  isActive?: boolean;
}

export const HistoryItem = ({
  item,
  isHighlighted,
  isSelected,
  sortBy,
  onEntryClick,
  onToggleSelect,
  onDeleteClick,
  innerRef,
  isActive = false
}: HistoryItemProps) => (
  <div ref={innerRef}>
    <div
      onClick={() => onEntryClick(item)}
      className={`relative group flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 cursor-pointer border ${
        isHighlighted 
        ? 'history-highlight bg-fuchsia-500/10 border-fuchsia-500/60 shadow-[0_0_40px_rgba(217,70_219,0.18)] ring-fuchsia-500/40 z-20' 
        : isSelected
        ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.1)] ring-indigo-500/30'
        : isActive
        ? 'scale-[0.98] border-indigo-500/40 bg-[var(--card-hover-bg)] ring-indigo-500/20 shadow-lg'
        : 'bg-[var(--card-bg)] border-[color:var(--card-border)] hover:border-indigo-500/40 hover:bg-[var(--card-hover-bg)] ring-[color:var(--panel-border)] bg-tint-indigo'
      }`}
    >
      <div className="flex items-center gap-5">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(String(item.id));
          }}
          className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl transition-all ${
            isSelected 
            ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
            : 'bg-[var(--panel-strong)] text-[color:var(--muted)] hover:text-indigo-400 ring-1 ring-[color:var(--panel-border)]'
          }`}
        >
          {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
        </button>
        
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-inner duration-500 ${
          isHighlighted 
          ? 'bg-fuchsia-500 text-white ring-2 ring-fuchsia-300/50' 
          : isSelected
          ? 'bg-indigo-600 text-white'
          : isActive
          ? 'ring-cyan-500/50 bg-indigo-600 text-white'
          : 'bg-[var(--panel-strong)] text-indigo-400 ring-1 ring-[color:var(--panel-border)] group-hover:ring-cyan-500/50 group-hover:bg-indigo-600 group-hover:text-white'
        }`}>
          <FileText size={24} />
        </div>
        <div className="text-left">
          <h3 className={`font-black tracking-tight text-lg transition-colors ${
            sortBy === 'name' ? 'text-fuchsia-400' : 'text-[color:var(--foreground)]'
          }`}>
            {item.fileName || "Textová analýza"}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-[10px] text-[color:var(--muted)] mt-1.5 font-bold uppercase tracking-widest">
            <span className={`flex items-center gap-1.5 ${
              sortBy === 'date' ? 'text-fuchsia-400' : ''
            }`}>
              <Calendar size={12} className={sortBy === 'date' ? 'text-fuchsia-400' : 'text-indigo-500'}/> {item.date}
            </span>
            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md ring-1 transition-colors ${
              sortBy === 'uspora' 
                ? 'text-fuchsia-400 bg-fuchsia-500/10 ring-fuchsia-500/20' 
                : 'text-cyan-400 bg-cyan-500/10 ring-cyan-500/20'
            }`}>
              <TrendingUp size={12} className={sortBy === 'uspora' ? 'text-fuchsia-400' : 'text-cyan-400'}/> {formatCurrency(item.uspora)} / měsíc
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(item.id);
          }} 
          className="p-3 text-slate-600 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-500/10 relative z-20 cursor-pointer"
        >
          <Trash2 size={18} />
        </button>
        <div className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${
          isHighlighted ? 'bg-fuchsia-500/20 text-fuchsia-300' : isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10'
        }`}>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  </div>
);
