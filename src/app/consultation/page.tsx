"use client";

import React, { Suspense } from "react";
import { useConsultation } from "@/hooks/useConsultation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

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

  useIntersectionObserver('.reveal', isMounted);

  if (!isMounted) return <div className="bg-[var(--background)] min-h-screen" />;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col h-screen px-6 py-4 md:px-10 overflow-hidden bg-[var(--background)] relative">
      
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
        description="Na základě vašich dat probereme možnosti optimalizace a detaily vyplývající ze smlouvy."
        rightElement={
          <div className="flex flex-col md:items-end gap-4">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <button 
                onClick={handleToHistory}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-[var(--panel)] border border-[color:var(--panel-border)] text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[color:var(--muted)] hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer shadow-sm group/archiv"
              >
                <History size={14} className="text-indigo-500 group-hover/archiv:scale-110 transition-transform duration-300" />
                <span>Archiv</span>
              </button>
              <button 
                onClick={handleBackToAnalysis}
                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer shadow-sm"
              >
                <Search size={14} />
                <span>Analýza</span>
              </button>
              
              <div className={`flex items-center gap-2 md:gap-3 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-2.5 text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all duration-500 ring-1 ${
                isCalling 
                  ? 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 ring-fuchsia-500/40 shadow-[0_10px_20px_rgba(217,70,219,0.15)]' 
                  : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 ring-cyan-500/30'
              }`}>
                <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isCalling ? 'animate-ping bg-fuchsia-500' : 'bg-cyan-500'}`}></span>
                  <span className={`relative inline-flex h-2 w-2 md:h-2.5 md:w-2.5 rounded-full ${isCalling ? 'bg-fuchsia-600' : 'bg-cyan-600'}`}></span>
                </div>
                <span>{isCalling ? "Live Uplink Active" : "Link Standby"}</span>
              </div>
            </div>
          </div>
        }
        className="shrink-0 !mb-6"
      />

      {/* BODY */}
      <div className="flex flex-1 flex-col gap-6 min-h-0 lg:flex-row overflow-hidden mb-6 relative z-10">
        <div className={`${isCalling ? 'hidden' : 'flex'} lg:flex lg:w-72 xl:w-80 shrink-0 min-h-0`}>
          <ConsultationContext 
            usporaParam={usporaParam} 
            fixaceParam={fixaceParam} 
            isCalling={isCalling} 
            starting={starting}
            onStart={handleStartCall}
            onStop={handleStopCall}
          />
        </div>

        <div className={`${!isCalling ? 'hidden' : 'flex'} lg:flex flex-1 flex-col overflow-hidden`}>
          <ConsultationChat 
            messages={messages} 
            isCalling={isCalling} 
            scrollContainerRef={scrollContainerRef} 
            onScroll={handleScroll} 
            onStopCall={handleStopCall}
          />

          <ConsultationInput 
            inputValue={inputValue} 
            onInputChange={setInputValue} 
            onSendMessage={handleSendMessage} 
            isCalling={isCalling} 
          />
        </div>
      </div>

    </div>
  );
}

export default function AdvisorPage() {
  return (
    <div className="bg-[var(--background)] min-h-screen flex items-center justify-center">
      <Suspense fallback={null}>
        <ConsultationContent />
      </Suspense>
    </div>
  );
}
