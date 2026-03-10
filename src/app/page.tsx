"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-8 pt-16 pb-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-4">
            <Sparkles size={12} />
            AI Financial Assistant
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Vítejte zpět, Jakube
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl leading-relaxed">
            Váš osobní AI ekosystém je připraven. Analyzujte smlouvy, konzultujte úspory a spravujte své portfolio na jednom místě.
          </p>
        </header>

        {/* Tady jsou ty karty z tvého screenshotu, jen s lepším paddingem a efekty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Analýza hypotéky", desc: "Zjistěte potenciál úspory z vašich smluv.", icon: "🏠", link: "/analysis", tag: "Doporučeno" },
            { title: "Hlasová konzultace", desc: "Proberte detaily s AI specialistou.", icon: "🎙️", link: "/consultation", tag: "Připraveno" },
            { title: "Moje Historie", desc: "Přehled všech vašich dřívějších analýz.", icon: "📂", link: "#", tag: "Brzy" },
          ].map((item) => (
            <div 
              key={item.title}
              onClick={() => item.link !== "#" && router.push(item.link)}
              className="group cursor-pointer rounded-[2rem] border border-slate-200 bg-white p-8 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl group-hover:bg-blue-50 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{item.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {item.tag}
                </span>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Tmavý banner s úsporou */}
        <div className="mt-12 rounded-[2.5rem] bg-slate-950 p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h2 className="text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">Aktuální potenciál úspor</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">1 250 Kč</span>
                <span className="text-slate-400">/ měsíčně</span>
              </div>
            </div>
            <button 
              onClick={() => router.push('/consultation')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Pokračovat v konzultaci
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
      </div>
    </div>
  );
}