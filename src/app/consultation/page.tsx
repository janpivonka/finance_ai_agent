"use client";

import React, { Suspense } from "react";
import { useConsultation } from "@/hooks/useConsultation";

// Import modular components
import { ConsultationBackground } from "../components/consultation/ConsultationBackground";
import { ConsultationLoading } from "../components/consultation/ConsultationLoading";
import { ConsultationHeader } from "../components/consultation/ConsultationHeader";
import { ConsultationContext } from "../components/consultation/ConsultationContext";
import { ConsultationChat } from "../components/consultation/ConsultationChat";
import { ConsultationInput } from "../components/consultation/ConsultationInput";

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
      
      <ConsultationBackground isCalling={isCalling} />

      <ConsultationLoading 
        starting={starting} 
        awaitingFirstTranscript={awaitingFirstTranscript} 
        onStop={handleStopCall} 
      />

      <ConsultationHeader 
        isCalling={isCalling} 
        onToHistory={handleToHistory} 
        onBackToAnalysis={handleBackToAnalysis} 
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
