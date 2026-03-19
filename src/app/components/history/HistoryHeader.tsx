import React from "react";
import { History, Search, X, ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { SortField, SortOrder } from "@/types";

interface HistoryHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSort
}) => (
  <header className="mb-12 relative z-10 reveal text-left">
    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 ring-1 ring-indigo-500/30 backdrop-blur-md">
      <History size={12} className="text-cyan-400" />
      Data Archive Protocol
    </div>
    <h1 className="text-4xl font-black tracking-tight text-white italic md:text-5xl mb-6">
      Moje <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] animate-gradient-text not-italic">Historie</span>
    </h1>

    <div className="border-l border-indigo-500/40 pl-6 py-1 mb-10">
       <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-xl">
         Kompletní přehled vašich finančních analýz. Data jsou ukládána lokálně a synchronizována pro okamžitý přístup.
       </p>
    </div>

    <div className="flex flex-col md:flex-row gap-4 mb-2">
      <div className="relative flex-1 group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-400 transition-colors z-10" />
        <input
          type="text"
          placeholder="Hledat v archivu..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 pl-12 pr-10 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500/40 backdrop-blur-xl transition-all"
        />
        {searchQuery && (
          <X 
            size={16} 
            onClick={() => onSearchChange("")} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer" 
          />
        )}
      </div>

      <div className="flex bg-slate-900/40 p-1 rounded-2xl border border-white/5 backdrop-blur-xl">
        {(['date', 'uspora', 'name'] as SortField[]).map((field) => {
          const isActive = sortBy === field;
          return (
            <button
              key={field}
              onClick={() => onSort(field)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/20' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {field === 'date' ? 'Datum' : field === 'uspora' ? 'Úspora' : 'Název'}
              {isActive && (
                sortOrder === 'asc' ? <ArrowUpNarrowWide size={14} /> : <ArrowDownWideNarrow size={14} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </header>
);
