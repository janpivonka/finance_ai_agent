"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";
import { 
  Mic, 
  MicOff, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  Activity, 
  PhoneCall,
  Headphones,
  Zap,
  Globe
} from "lucide-react";

function ConsultationContent() {
  const searchParams = useSearchParams();
  
  // Stavy inicializované na základní hodnoty (shodné pro server i klient)
  const [starting, setStarting] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [extraContext, setExtraContext] = useState<string | null>(null);
  
  // Bezpečné získání parametrů - pokud nejsou, použijí se fallbacky
  const usporaParam = searchParams.get("uspora") || "0";
  const fixaceParam = searchParams.get("fixace") || "neuvedena";

  const vapiRef = useRef<any | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. BEZPEČNÉ ČTENÍ LOCALSTORAGE (pouze na klientovi)
  useEffect(() => {
    const historyData = localStorage.getItem("finance_history");
    if (historyData) {
      try {
        const history = JSON.parse(historyData);
        if (history.length > 0 && history[0].analyticky_duvod) {
          setExtraContext(history[0].analyticky_duvod);
        }
      } catch (e) {
        console.error("Chyba při parsování historie:", e);
      }
    }
  }, []);

  // 2. AUTO-SCROLL CHATU
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. INICIALIZACE VAPI
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (vapiRef.current) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("Vapi Public Key chybí v .env souboru");
      return;
    }

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
        variableValues: { 
          uspora: usporaParam, 
          fixace: fixaceParam,
          analyticky_duvod: extraContext || "Klient chce probrat možnosti úspor."
        },
      });
    } catch (error) {
      console.error("Vapi start error:", error);
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
    <div className="mx-auto flex w-full max-w-6xl flex-col h-[calc(100vh-80px)] px-6 py-6 md:px-10 overflow-hidden bg-[#020617] relative">
      
      {/* Background Animated Glows */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isCalling ? 'bg-fuchsia-600/20 animate-pulse' : 'bg-indigo-500/10'}`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isCalling ? 'bg-cyan-500/20 animate-pulse' : 'bg-cyan-500/5'}`} />

      {/* HEADER */}
      <header className="mb-8 flex shrink-0 items-center justify-between gap-4 relative z-10 animate-fade-in">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-400 ring-1 ring-indigo-500/30">
            <Zap size={12} className={`text-cyan-400 ${isCalling ? 'animate-bounce' : 'animate-pulse'}`} />
            Neural Consultation 2.0
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            AI <span className="animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">Bankovní</span> specialista
          </h1>
        </div>
        
        <div className={`hidden sm:flex items-center gap-3 rounded-2xl px-5 py-2.5 text-[10px] font-black tracking-widest uppercase transition-all duration-500 ring-1 ${
          isCalling ? 'bg-fuchsia-950/30 text-fuchsia-400 ring-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,219,0.3)]' : 'bg-slate-900/50 text-cyan-400 ring-cyan-500/30'
        }`}>
          <div className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalling ? 'animate-ping bg-fuchsia-400' : 'bg-cyan-400'}`}></span>
            <span className={`relative inline-flex h-2 w-2 rounded-full ${isCalling ? 'bg-fuchsia-500' : 'bg-cyan-500'}`}></span>
          </div>
          {isCalling ? "Live Uplink Active" : "Link Standby"}
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-6 min-h-0 lg:flex-row overflow-hidden mb-2 relative z-10">
        
        {/* LEVÝ PANEL */}
        <aside className="flex flex-col gap-4 lg:w-80 xl:w-96 shrink-0 overflow-hidden animate-fade-in-left">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl p-6 shadow-2xl flex flex-col min-h-0 ring-1 ring-white/5 group hover:border-indigo-500/20 transition-all">
            <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shrink-0">
              Analytický kontext
            </h2>
            
            <div className="space-y-4 overflow-y-auto pr-1 scrollbar-hide">
              <div className="group/item rounded-[1.5rem] bg-[#020617]/60 p-5 transition-all border border-white/5 hover:border-cyan-500/30 hover:scale-[1.02]">
                <div className="mb-1 flex items-center gap-2 text-cyan-400">
                  <TrendingUp size={14} className="group-hover/item:animate-bounce" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Potenciál úspory</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter">{usporaParam}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase ml-1 text-indigo-400">Kč/m</span>
                </div>
              </div>

              <div className="group/item rounded-[1.5rem] bg-[#020617]/60 p-5 transition-all border border-white/5 hover:border-indigo-500/30 hover:scale-[1.02]">
                <div className="mb-1 flex items-center gap-2 text-indigo-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Fixace do</span>
                </div>
                <span className="text-xl font-black text-white tracking-tight">{fixaceParam}</span>
              </div>

              <div className="mt-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 p-4 animate-pulse-slow">
                 <div className="flex items-center gap-2 mb-2 text-fuchsia-400">
                    <Headphones size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI Hint</span>
                 </div>
                 <p className="text-[11px] leading-relaxed text-slate-400 font-medium italic">
                    "Zkuste se zeptat na možnosti refinancování dříve než skončí fixace."
                 </p>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {!isCalling ? (
              <button
                onClick={handleStartCall}
                disabled={starting}
                className="group relative w-full overflow-hidden rounded-[1.5rem] bg-indigo-600 py-6 text-sm font-black text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:tracking-[0.2em] active:scale-95 disabled:opacity-50 uppercase tracking-widest"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {starting ? <Activity size={20} className="animate-spin" /> : <><span>Zahájit uplink</span><PhoneCall size={18} className="group-hover:rotate-12 transition-transform" /></>}
                </div>
              </button>
            ) : (
              <button
                onClick={handleStopCall}
                className="group w-full rounded-[1.5rem] bg-fuchsia-950/20 py-6 font-black text-fuchsia-500 border border-fuchsia-500/40 transition-all hover:bg-fuchsia-500/10 active:scale-95 uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(217,70,219,0.1)]"
              >
                <div className="flex items-center justify-center gap-3">
                  <MicOff size={18} className="animate-pulse" />
                  Ukončit spojení
                </div>
              </button>
            )}
          </div>
        </aside>

        {/* PRAVÝ PANEL: TRANSCRIPT */}
        <main className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-xl shadow-2xl min-h-0 ring-1 ring-white/5 animate-fade-in-up">
          <div className="flex shrink-0 items-center justify-between border-b border-white/5 bg-white/5 px-8 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#020617] shadow-inner ring-1 ring-white/10">
                <MessageSquare size={16} className={`transition-colors ${isCalling ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">AI Neural Dialogue</span>
                <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Encrypted Stream</span>
              </div>
            </div>
            
            {isCalling && (
              <div className="flex items-center gap-4">
                <div className="flex items-end gap-1 h-4">
                   {[1,2,3,4,5,6].map(i => (
                     <div key={i} className={`w-1 bg-cyan-500 rounded-full animate-visualizer shadow-[0_0_8px_#22d3ee]`} style={{ animationDelay: `${i*0.1}s` }} />
                   ))}
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-fuchsia-500 px-3 py-1 shadow-[0_0_15px_#d946ef] animate-pulse">
                   <span className="text-[9px] font-black text-white uppercase tracking-tighter">Live</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-transparent p-8 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center opacity-20 group">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 rotate-3 group-hover:rotate-12 transition-transform duration-700">
                   <Mic size={40} className="text-indigo-400 animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                  Awaiting Uplink Connection...
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                <div className={`relative max-w-[80%] rounded-[1.8rem] px-6 py-4 text-sm font-medium leading-relaxed shadow-2xl transition-all ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-[#020617] rounded-br-none font-bold shadow-cyan-500/20" 
                    : "bg-slate-800/80 text-white rounded-bl-none border border-white/5 backdrop-blur-sm"
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="shrink-0 border-t border-white/5 bg-[#020617]/80 p-6 backdrop-blur-md">
            <form onSubmit={handleSendMessage} className="relative flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!isCalling}
                  placeholder={isCalling ? "Zadejte dotaz pro AI agenta..." : "Pro aktivaci chatu zahajte spojení"}
                  className="w-full rounded-2xl border border-white/10 bg-[#020617] px-6 py-4 text-sm font-medium text-white outline-none transition-all focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-30 placeholder:text-slate-600 shadow-inner"
                />
                {isCalling && <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/50 animate-spin-slow" />}
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || !isCalling}
                className="group rounded-2xl bg-white text-slate-950 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-700 active:scale-95 shadow-lg"
              >
                Send
              </button>
            </form>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes visualizer {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-visualizer { animation: visualizer 0.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-gradient-text { animation: gradient-text 5s ease infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-left { animation: fadeInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function AdvisorPage() {
  return (
    <div className="bg-[#020617] min-h-screen">
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center text-indigo-400">
          <Activity className="animate-spin mr-3" size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Booting Neural Link...</span>
        </div>
      }>
        <ConsultationContent />
      </Suspense>
    </div>
  );
}