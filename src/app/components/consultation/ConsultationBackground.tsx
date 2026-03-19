import React from "react";

interface ConsultationBackgroundProps {
  isCalling: boolean;
}

export const ConsultationBackground: React.FC<ConsultationBackgroundProps> = ({ isCalling }) => (
  <>
    <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isCalling ? 'bg-fuchsia-600/20 animate-pulse' : 'bg-indigo-500/10'}`} />
    <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${isCalling ? 'bg-cyan-500/20 animate-pulse' : 'bg-cyan-500/5'}`} />
  </>
);
