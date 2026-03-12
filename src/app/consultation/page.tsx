"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { Mic, MicOff, MessageSquare, ShieldCheck, TrendingUp, Calendar } from "lucide-react";

function ConsultationContent() {
  const searchParams = useSearchParams();
  
  // Primárně bereme data z URL (kvůli odkazům z e-mailu)
  const usporaParam = searchParams.get("uspora");
  const fixaceParam = searchParams.get("fixace");

  const [starting, setStarting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [extraContext, setExtraContext] = useState<string | null>(null);
  
  const vapiRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Načtení hlubšího kontextu z historie pro hlasového asistenta
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("finance_history") || "[]");
    if (history.length > 0) {
      // Pokud data v URL chybí, vezmeme je z poslední analýzy
      // Pokud v URL jsou, přidáme k nim "analyticky_duvod" (seznam bank)
      setExtraContext(history[0].analyticky_duvod);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (vapiRef.current) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) return;

    const vapi = new Vapi(publicKey);

    vapi.on("message", (message: any) => {
      if (message?.type === "transcript" && message?.transcriptType === "final") {
        const role = message.role === "user" ? "user" : "assistant";
        const text = message.transcript || message.text;
        if (text && text.trim() !== "") {
          setMessages((prev) => [...prev, { role, text }]);
        }
      }
    });

    vapi.on("call-start", () => setIsCalling(true));
    vapi.on("call-end", () => setIsCalling(false));

    vapiRef.current = vapi;
    return () => { vapi.stop(); };
  }, []);

  const handleStartCall = async () => {
    if (!vapiRef.current) return;
    try {
      setStarting(true);
      
      // TADY JE TA MAGIE: Posíláme asistentovi kompletní briefing
      await vapiRef.current.start("4c32087f-c5e7-48db-b775-10a47b12e912", {
        variableValues: { 
          uspora: usporaParam || "0", 
          fixace: fixaceParam || "neuvedena",
          analyticky_duvod: extraContext || "Klient chce probrat možnosti úspor."
        },
      });
    } catch (error) {
      console.error(error);
      setIsCalling(false);
    } finally {
      setStarting(false);
    }
  };

  const handleStopCall = () => {
    vapiRef.current?.stop();
    setIsCalling(false);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text || !vapiRef.current) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInputValue("");
    vapiRef.current.send({
      type: "add-message",
      message: { role: "user", content: text },
    });
  };

  return (
    <div className="flex flex-col min-h-full px-6 py-6 md:px-10 max-w-6xl mx-auto w-full">
      <header className="mb-8 flex items-center justify-between gap-4 shrink-0">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Smart Consultation
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 truncate">
            AI Bankovní specialista
          </h1>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-sm ring-1 transition-all ${
          isCalling ? 'bg-red-50 text-red-600 ring-red-200' : 'bg-emerald-50 text-emerald-600 ring-emerald-200'
        }`}>
          {isCalling ? <Mic size={14} className="animate-pulse" /> : <ShieldCheck size={14} />}
          {isCalling ? "Hovor probíhá" : "Zabezpečené spojení"}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-8 min-h-0">
        {/* LEVÁ ČÁST: INFO TABULE */}
        <section className="flex-1 lg:flex-[0.35] flex flex-col gap-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Pracovní data asistenta
            </h2>
            <div className="space-y-8">
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <TrendingUp size={16} />
                  <span className="text-[10px] font-bold uppercase">Měsíční úspora</span>
                </div>
                <p className="text-3xl font-black text-emerald-700">{usporaParam || "0"} Kč</p>
              </div>

              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar size={16} />
                  <span className="text-[10px] font-bold uppercase">Konec fixace</span>
                </div>
                <p className="text-xl font-bold text-blue-900">{fixaceParam || "Nezjištěno"}</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[11px] leading-relaxed text-slate-500 italic">
                "Náš AI bankéř má k dispozici srovnání 10 největších bank a je připraven s vámi probrat detailní postup refinancování."
              </p>
            </div>
          </div>

          <div className="mt-auto">
            {!isCalling ? (
              <button
                onClick={handleStartCall}
                disabled={starting}
                className="group relative w-full overflow-hidden rounded-[1.5rem] bg-slate-900 py-6 font-bold text-white shadow-2xl transition-all hover:bg-blue-600 active:scale-95"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 text-lg">
                  {starting ? "Připojování..." : "Zahájit hovor"}
                  {!starting && <Mic size={20} className="group-hover:animate-bounce" />}
                </div>
              </button>
            ) : (
              <button
                onClick={handleStopCall}
                className="w-full rounded-[1.5rem] bg-white py-6 font-bold text-red-600 border-2 border-red-100 transition-all hover:bg-red-50 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <MicOff size={20} />
                  Ukončit konzultaci
                </div>
              </button>
            )}
          </div>
        </section>

        {/* PRAVÁ ČÁST: TRANSCRIPT */}
        <section className="flex-1 lg:flex-[0.65] flex flex-col rounded-[2.5rem] border border-slate-200 bg-white shadow-xl overflow-hidden min-h-[500px]">
          <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Transcript</span>
            </div>
            {isCalling && <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] text-red-600 font-black">REC</span></div>}
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mb-4 rotate-12">
                   <Mic size={32} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500 max-w-[240px]">
                  Zatím žádná aktivita. Stiskněte tlačítko a začněte mluvit.
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!isCalling}
                placeholder={isCalling ? "Napište asistentovi..." : "Pro aktivaci chatu zahajte hovor"}
                className="flex-1 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-3.5 text-sm outline-none transition focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:opacity-50 shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !isCalling}
                className="rounded-[1.2rem] bg-slate-900 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-600 disabled:bg-slate-300 active:scale-95 shadow-lg shadow-slate-200"
              >
                Poslat
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-slate-400 animate-pulse">Připravuji bankovní linku...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}