"use client";

import React from "react";
import { 
  Home, 
  Mic, 
  FolderOpen, 
  ShieldCheck,
  Coins,
  Zap
} from "lucide-react";

// Import komponent a hooků
import { ScrollToTop } from "../../components/ScrollToTop";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useDashboard } from "@/hooks/useDashboard";

import { ActionCard } from "../../components/dashboard/ActionCard";
import { MainInsightBanner } from "../../components/dashboard/MainInsightBanner";
import { FutureModuleCard } from "../../components/dashboard/FutureModuleCard";
import { useMobileInteraction } from "@/hooks/useMobileInteraction";

// Shared UI Components
import { PageBackground } from "../../components/ui/PageBackground";
import { PageHeader } from "../../components/ui/PageHeader";
import DashboardLoading from "./loading";

export default function DashboardPage() {
  const { 
    lastAnalysis, 
    isLoaded, 
    goToConsultation, 
    goToHistory, 
    goToAnalysis 
  } = useDashboard();

  const { activeId, handleInteraction } = useMobileInteraction();

  // Aktivace animací a sledování scrollu
  useScrollDirection();
  useIntersectionObserver('.reveal', isLoaded);

  if (!isLoaded) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 pt-16 pb-24 relative overflow-x-hidden selection:bg-cyan-500/30 no-scrollbar">
      
      <PageBackground 
        glows={[
          { position: "top-left", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
          { position: "bottom-right", color: "bg-fuchsia-600", size: "w-[600px] h-[600px]", opacity: "opacity-5" }
        ]}
        withNoise
      />

      <div className={`mx-auto max-w-6xl relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        <PageHeader 
          badgeIcon={Zap}
          badgeText="Neural Financial Ecosystem 2.0"
          title={
            <>
              Vítejte,{" "}
              <span className="inline-block align-baseline pb-1 pr-1 animate-gradient-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-[length:200%_auto] bg-clip-text text-transparent">
                Peony
              </span>
            </>
          }
          description="Váš inteligentní kokpit je online. Synchronizovali jsme data z trhu a připravili analýzu vašich aktiv."
        />

        {/* HLAVNÍ AKČNÍ KARTY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 reveal">
          
          <ActionCard 
            onClick={() => handleInteraction('analysis', goToAnalysis)}
            isActive={activeId === 'analysis'}
            activeVariant="indigo"
            icon={Home}
            title="Analýza hypotéky"
            description="Odhalte skryté poplatky a prostor pro úsporu ve vaší smlouvě."
            badge="Active Scan"
            className="hover:border-indigo-500/50 hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]"
            iconBgClass="bg-indigo-500/10 text-indigo-400 ring-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white"
            badgeClass="text-cyan-400 bg-cyan-500/10 ring-cyan-500/20"
            arrowClass="group-hover:text-indigo-400"
          />

          <ActionCard 
            onClick={() => handleInteraction('consultation', goToConsultation)}
            isActive={activeId === 'consultation'}
            activeVariant="emerald"
            icon={Mic}
            title="Hlasový AI Bankéř"
            description="Proberte výsledky analýzy přirozeně hlasem v reálném čase."
            badge="Live Connection"
            className="hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            iconBgClass="bg-emerald-500/10 text-emerald-400 ring-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white"
            badgeClass="text-emerald-400 bg-emerald-500/10 ring-emerald-500/20"
            arrowClass="group-hover:text-emerald-400"
          />

          <ActionCard 
            onClick={() => handleInteraction('history', goToHistory)}
            isActive={activeId === 'history'}
            activeVariant="fuchsia"
            icon={FolderOpen}
            title="Moje historie"
            description="Kompletní archiv vašich dokumentů a vygenerovaných reportů."
            badge="Cloud Archive"
            className="hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_rgba(217,70,219,0.2)]"
            iconBgClass="bg-fuchsia-500/10 text-fuchsia-400 ring-fuchsia-500/20 group-hover:bg-fuchsia-500 group-hover:text-white"
            badgeClass="text-fuchsia-400 bg-fuchsia-500/10 ring-fuchsia-500/20"
            arrowClass="group-hover:text-fuchsia-400"
          />
        </div>

        {/* HLAVNÍ INSIGHT BANNER */}
        <MainInsightBanner 
          lastAnalysis={lastAnalysis} 
          onAction={() => handleInteraction('insight', lastAnalysis ? goToConsultation : goToAnalysis)}
          isActive={activeId === 'insight'}
        />

        {/* SEKCE: BUDOUCÍ MODULY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
          <FutureModuleCard 
            onClick={() => handleInteraction('insurance', () => {})}
            isActive={activeId === 'insurance'}
            variant="indigo"
            icon={ShieldCheck}
            title="Pojištění 2.0"
            description="Automatické hlídání podpojištění a optimalizace pojistného krytí pomocí AI."
          />

          <FutureModuleCard 
            onClick={() => handleInteraction('wealth', () => {})}
            isActive={activeId === 'wealth'}
            variant="fuchsia"
            icon={Coins}
            title="Wealth Management"
            description="Sledujte své investice, kryptoměny a majetek v jednom inteligentním feedu."
          />
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
