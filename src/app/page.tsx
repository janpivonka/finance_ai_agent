"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  Home, 
  Mic, 
  FolderOpen, 
  TrendingUp,
  Building2,
  CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  useEffect(() => {
    // Načteme historii a vezmeme poslední záznam
    const saved = JSON.parse(localStorage.getItem("finance_history") || "[]");
    if (saved.length > 0) {
      setLastAnalysis(saved[0]);
    }
  }, []);

  // Pomocná funkce pro navigaci do konzultace s daty
  const goToConsultation = () => {
    if (lastAnalysis) {
      router.push(`/consultation?uspora=${lastAnalysis.uspora}&fixace=${lastAnalysis.fixace}`);
    } else {
      router.push('/analysis');
    }
  };

  const cards = [
    { 
      title: "Analýza hypotéky", 
      desc: "Nahrajte smlouvu a nechte AI provést okamžitý screening trhu.", 
      icon: <Home size={28} className="text-blue-600" />, 
      link: "/analysis", 
      tag: "Doporučeno",
      active: true,
      onClick: () => router.push('/analysis')
    },
    { 
      title: "Hlasová konzultace", 
      desc: "Proberte výsledky s AI bankéřem. Rozumí vašim datům.", 
      icon: <Mic size={28} className="text-emerald-600" />, 
      link: "/consultation", 
      tag: "Live",
      active: true,
      onClick: goToConsultation // Tady byla chyba, nyní předává data
    },
    { 
      title: "Moje Historie", 
      desc: "Všechny vaše analýzy a dokumenty na jednom místě.", 
      icon: <FolderOpen size={28} className="text-slate-600" />, 
      link: "/history", 
      tag: "Archiv",
      active: true,
      onClick: () => router.push('/history')
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 pt-16 pb-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-4 shadow-sm ring-1 ring-blue-100">
            <Sparkles size={12} />
            AI Financial Assistant
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Vítejte zpět, Peony
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl leading-relaxed">
            Váš osobní AI ekosystém je připraven. Provedli jsme screening trhu a máme pro vás aktuální data.
          </p>
        </header>

        {/* Hlavní navigační karty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cards.map((item) => (
            <div 
              key={item.title}
              onClick={item.onClick}
              className="group cursor-pointer rounded-[2.5rem] border border-slate-200 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-200"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-blue-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                  item.tag === "Doporučeno" ? "text-blue-600 bg-blue-50" : "text-slate-600 bg-slate-50"
                }`}>
                  {item.tag}
                </span>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamický banner s úsporou a náhledem nabídek */}
        <div className="rounded-[2.5rem] bg-slate-950 p-10 text-white relative overflow-hidden shadow-2xl ring-1 ring-white/10">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  <h2 className="text-blue-400 font-bold uppercase tracking-widest text-xs">
                    {lastAnalysis ? "Váš aktuální potenciál úspor" : "Připraveno k analýze"}
                  </h2>
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black tracking-tighter">
                    {lastAnalysis ? `${Number(lastAnalysis.uspora).toLocaleString()} Kč` : "0 Kč"}
                  </span>
                  <span className="text-slate-400 text-xl">/ měsíčně</span>
                </div>

                {lastAnalysis && (
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {lastAnalysis.top_nabidky?.slice(0, 3).map((offer: any, i: number) => (
                      <div key={i} className="rounded-2xl bg-white/5 p-4 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                          <Building2 size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{offer.banka}</span>
                        </div>
                        <div className="text-lg font-bold">{offer.sazba}</div>
                        <div className="text-[10px] text-slate-400">Úspora {Number(offer.usp).toLocaleString()} Kč</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={goToConsultation} // Opraveno: Nyní používá funkci s parametry
                  className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  <TrendingUp size={20} className="group-hover:scale-110 transition-transform" />
                  {lastAnalysis ? "Pokračovat v konzultaci" : "Spustit analýzu"}
                </button>
                {lastAnalysis && (
                  <p className="text-slate-500 text-[10px] text-center italic font-medium">
                    Analýza ze dne: {lastAnalysis.date.split(',')[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Designové prvky pozadí */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute top-10 right-10 opacity-5">
             <CheckCircle2 size={160} />
          </div>
        </div>
      </div>
    </div>
  );
}