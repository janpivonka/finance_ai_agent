import React from "react";

interface GlowProps {
  color?: string;
  position?: "top-right" | "bottom-left" | "top-left" | "bottom-right" | "center";
  size?: string;
  opacity?: string;
  animate?: boolean;
  delay?: string;
}

interface PageBackgroundProps {
  glows?: GlowProps[];
  withNoise?: boolean;
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ 
  glows = [
    { position: "top-right", color: "bg-indigo-600", size: "w-[500px] h-[500px]", opacity: "opacity-10", animate: true },
    { position: "bottom-left", color: "bg-cyan-600", size: "w-[500px] h-[500px]", opacity: "opacity-5", animate: true, delay: "2s" }
  ],
  withNoise = false
}) => {
  const getPositionClasses = (position: string) => {
    switch (position) {
      case "top-right": return "top-0 right-0";
      case "top-left": return "top-0 left-1/4";
      case "bottom-left": return "bottom-0 left-0";
      case "bottom-right": return "bottom-0 right-1/4";
      case "center": return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {glows.map((glow, i) => (
        <div 
          key={i}
          className={`absolute rounded-full blur-[120px] transition-colors duration-1000 
            ${glow.color || "bg-indigo-600"} 
            ${glow.size || "w-96 h-96"} 
            ${glow.opacity || "opacity-10"}
            ${getPositionClasses(glow.position || "")}
            ${glow.animate ? "animate-pulse-slow" : ""}
          `}
          style={glow.delay ? { animationDelay: glow.delay } : {}}
        />
      ))}
      {withNoise && (
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      )}
    </div>
  );
};
