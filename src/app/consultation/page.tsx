"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";

// Komponenta pro obsah, která využívá useSearchParams (vyžaduje Suspense v Next.js)
function ConsultationContent() {
  const searchParams = useSearchParams();
  const usporaParam = searchParams.get("uspora");
  const fixaceParam = searchParams.get("fixace");

  const uspora = usporaParam && usporaParam.trim() !== "" ? usporaParam : "0";
  const fixace = fixaceParam && fixaceParam.trim() !== "" ? fixaceParam : "neuvedena";

  const [starting, setStarting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  const vapiRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
      await vapiRef.current.start("4c32087f-c5e7-48db-b775-10a47b12e912", {
        variableValues: { uspora, fixace },
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
            AI Financial Advisor
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 truncate">
            Konzultace s bankéřem
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
          <span className={`h-2 w-2 rounded-full ${isCalling ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
          {isCalling ? "Hovor probíhá" : "Systém připraven"}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
        {/* LEVÁ ČÁST: DETAIL ANALÝZY */}
        <section className="flex-1 lg:flex-[0.4] flex flex-col gap-4 min-w-0">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Detail analýzy
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-2 uppercase tracking-tight">Možná měsíční úspora</p>
                <p className="text-xl font-black text-emerald-600 leading-[1.2] break-words">
                  {uspora} Kč
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-tight">Fixace smlouvy</p>
                <p className="text-slate-900 font-semibold break-words leading-relaxed">{fixace}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto lg:mt-0">
            {!isCalling ? (
              <button
                onClick={handleStartCall}
                disabled={starting}
                className="w-full rounded-2xl bg-slate-950 py-4 font-bold text-white shadow-xl transition hover:bg-slate-800 disabled:opacity-50 active:scale-[0.98]"
              >
                {starting ? "Připojování..." : "Zahájit hlasový hovor"}
              </button>
            ) : (
              <button
                onClick={handleStopCall}
                className="w-full rounded-2xl bg-red-50 py-4 font-bold text-red-600 border border-red-200 transition hover:bg-red-100 active:scale-[0.98]"
              >
                Ukončit hovor
              </button>
            )}
          </div>
        </section>

        {/* PRAVÁ ČÁST: CHAT */}
        <section className="flex-1 lg:flex-[0.6] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden min-w-0 min-h-[400px] lg:min-h-0">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Záznam komunikace</span>
            {isCalling && <span className="text-[10px] text-blue-600 font-bold animate-pulse">LIVE TRANSCRIPT</span>}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white to-slate-50/30">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-30">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-sm font-bold tracking-tighter italic">fs</span>
                </div>
                <p className="text-[11px] max-w-[180px] leading-relaxed">
                  Zatím žádná aktivita. Jakmile začnete mluvit, uvidíte zde živý přepis.
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-all ${
                  message.role === "user" 
                    ? "bg-slate-900 text-slate-50 rounded-tr-none" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={!isCalling}
                placeholder={isCalling ? "Napište zprávu asistentovi..." : "Pro chat musíte zahájit hovor"}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:bg-white disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || !isCalling}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none active:scale-[0.95]"
              >
                Odeslat
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

// Hlavní export s Suspense obalem (nutné pro useSearchParams v Next.js App Routeru)
export default function AdvisorPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500">Načítání konzultace...</div>}>
      <ConsultationContent />
    </Suspense>
  );
}