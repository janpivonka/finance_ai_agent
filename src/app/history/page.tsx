"use client";

import React, { useEffect, useState } from "react";
import { FileText, Calendar, TrendingUp, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
    setHistory(saved);
  }, []);

  const deleteEntry = (id: number) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem("finance_history", JSON.stringify(newHistory));
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
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{item.fileName}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <TrendingUp size={12}/> Úspora: {item.uspora} Kč
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => deleteEntry(item.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}