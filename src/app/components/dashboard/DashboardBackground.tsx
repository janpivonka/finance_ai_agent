import React from "react";

export const DashboardBackground = () => (
  <>
    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/5 rounded-full blur-[150px] pointer-events-none" />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
  </>
);
