"use client";

import React, { useEffect, useState } from "react";
import { FileText, Calendar, TrendingUp, Trash2, ChevronRight, Info, X } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
    setHistory(saved);
  }, []);

  const deleteEntry = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Zabrání otevření detailu při mazání
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("finance_history", JSON.stringify(newHistory));
    if (selectedEntry?.id === id) setSelectedEntry(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-black text-slate-900 mb-8">Moje Historie</h1>
      
      {history.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Zatím nemáte žádné uložené analýzy.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedEntry(item)}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-400 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.fileName || "Textová analýza"}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <TrendingUp size={12}/> Úspora: {item.uspora} Kč
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => deleteEntry(item.id, e)}
                  className="p-2 text-slate-300 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODÁLNÍ OKNO S DETAILEM ANALÝZY */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <Info className="text-blue-600" />
                <h2 className="font-bold text-xl text-slate-900">Detail analýzy</h2>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-slate-200 rounded-full transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6 text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <p className="text-xs text-emerald-600 font-bold uppercase">Měsíční úspora</p>
                  <p className="text-2xl font-black text-emerald-700">{selectedEntry.uspora} Kč</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-xs text-blue-600 font-bold uppercase">Konec fixace</p>
                  <p className="text-2xl font-black text-blue-700">{selectedEntry.fixace}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Briefing pro hlasového asistenta:</h4>
                <div className="bg-slate-50 p-4 rounded-2xl text-sm italic border-l-4 border-blue-500">
                  "{selectedEntry.analyticky_duvod}"
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Obsah odeslaného reportu:</h4>
                {/* Zde renderujeme HTML, které nám poslala Gemini */}
                <div 
                  className="prose prose-slate prose-sm max-w-none bg-white border border-slate-100 p-4 rounded-2xl shadow-inner"
                  dangerouslySetInnerHTML={{ __html: selectedEntry.textovy_obsah }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}