"use client";

import React, { Suspense } from "react";
import { useConsultation } from "@/hooks/useConsultation";

import { ConsultationContext } from "../components/consultation/ConsultationContext";
import { ConsultationChat } from "../components/consultation/ConsultationChat";
import { ConsultationInput } from "../components/consultation/ConsultationInput";

// Shared UI Components
import { PageBackground } from "../components/ui/PageBackground";
import { PageHeader } from "../components/ui/PageHeader";
import { LoadingOverlay } from "../components/ui/LoadingOverlay";
import { Zap, History, Search } from "lucide-react";

function ConsultationContent() {
  const {
    isMounted,
    starting,
    isCalling,
    messages,
    inputValue,
    setInputValue,
    awaitingFirstTranscript,
    usporaParam,
    fixaceParam,
    scrollContainerRef,
    handleScroll,
    handleStartCall,
    handleStopCall,
    handleSendMessage,
    handleBackToAnalysis,
    handleToHistory
  } = useConsultation();

  if (!isMounted) return <div className="bg-[#020617] min-h-screen" />;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col h-[calc(100vh-40px)] px-6 py-6 md:px-10 overflow-hidden bg-[#020617] relative">
      
      <PageBackground 
        glows={[
          { position: "top-left", color: isCalling ? 'bg-fuchsia-600' : 'bg-indigo-500', size: "w-96 h-96", opacity: isCalling ? "opacity-20" : "opacity-10", animate: isCalling },
          { position: "bottom-right", color: isCalling ? 'bg-cyan-500' : 'bg-cyan-500', size: "w-96 h-96", opacity: isCalling ? "opacity-20" : "opacity-5", animate: isCalling }
        ]}
      />

      <LoadingOverlay 
        isVisible={starting || awaitingFirstTranscript}
        title="Navazuji spojení…"
        description="Hovor začne každou chvíli. Jakmile se objeví první přepis, pokračujeme."
        onCancel={handleStopCall}
        variant="fuchsia"
      />

      <PageHeader 
        badgeIcon={Zap}
        badgeText="Neural Consultation 2.0"
        badgeVariant={isCalling ? "fuchsia" : "indigo"}
        title={
          <>
            AI{" "}
            <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent italic">
              Bankovní
            </span>{" "}
            specialista
          </>
        }
        description="Na základě vašich dat probereme možnosti optimalizace, poskytneme podrobnější informace vyplývající ze smlouvy a detaily související s vaším konkrétním produktem."
        rightElement={
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleToHistory}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <History size={14} />
                <span className="hidden md:inline">Archiv</span>
              </button>
              <button 
                onClick={handleBackToAnalysis}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
              >
                <Search size={14} />
                <span className="hidden md:inline">Analýza</span>
              </button>
            </div>

            <div className={`flex items-center gap-3 rounded-2xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all duration-500 ring-1 ${
              isCalling ? 'bg-fuchsia-950/30 text-fuchsia-400 ring-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,219,0.3)]' : 'bg-slate-900/50 text-cyan-400 ring-cyan-500/30'
            }`}>
              <div className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalling ? 'animate-ping bg-fuchsia-400' : 'bg-cyan-400'}`}></span>
                <span className={`relative inline-flex h-2 w-2 rounded-full ${isCalling ? 'bg-fuchsia-500' : 'bg-cyan-500'}`}></span>
              </div>
              <span className="hidden sm:inline">{isCalling ? "Live Uplink Active" : "Link Standby"}</span>
              <span className="sm:hidden">{isCalling ? "Live" : "Ready"}</span>
            </div>
          </div>
        }
        className="shrink-0"
      />

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-6 min-h-0 lg:flex-row overflow-hidden mb-4 relative z-10">
        <ConsultationContext 
          usporaParam={usporaParam} 
          fixaceParam={fixaceParam} 
          isCalling={isCalling} 
          starting={starting}
          onStart={handleStartCall}
          onStop={handleStopCall}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <ConsultationChat 
            messages={messages} 
            isCalling={isCalling} 
            scrollContainerRef={scrollContainerRef} 
            onScroll={handleScroll} 
          />

          <ConsultationInput 
            inputValue={inputValue} 
            onInputChange={setInputValue} 
            onSendMessage={handleSendMessage} 
            isCalling={isCalling} 
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes visualizer { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-visualizer { animation: visualizer 0.5s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
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
    <div className="bg-[#020617] min-h-screen flex items-center justify-center">
      <Suspense fallback={null}>
        <ConsultationContent />
      </Suspense>
    </div>
  );
}
