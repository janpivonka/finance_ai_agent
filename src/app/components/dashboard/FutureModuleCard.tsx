import React from "react";
import { LucideIcon } from "lucide-react";

interface FutureModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  variant?: 'indigo' | 'fuchsia';
}

export const FutureModuleCard: React.FC<FutureModuleCardProps> = ({ 
  icon: Icon, 
  title, 
  description,
  isActive = false,
  onClick,
  variant = 'fuchsia'
}) => {
  const activeStyles = {
    fuchsia: {
      bg: '!bg-fuchsia-500',
      text: '!text-white',
      border: 'hover:border-fuchsia-500/30',
      activeBorder: 'border-fuchsia-500/30'
    },
    indigo: {
      bg: '!bg-indigo-500',
      text: '!text-white',
      border: 'hover:border-indigo-500/30',
      activeBorder: 'border-indigo-500/30'
    }
  }[variant];

  return (
    <div 
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border border-[color:var(--card-border)] bg-[var(--card-bg)] p-6 transition-all hover:bg-[var(--card-hover-bg)] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 bg-tint-pink ${activeStyles.border} ${isActive ? `bg-[var(--card-hover-bg)] grayscale-0 opacity-100 scale-[0.98] ${activeStyles.activeBorder}` : ''}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--panel-strong)] text-[color:var(--muted)] transition-all duration-500 group-hover:bg-fuchsia-500 group-hover:text-white ${isActive ? `${activeStyles.bg} ${activeStyles.text}` : ''}`}>
          <Icon size={20} />
        </div>
        <h3 className="font-bold text-[color:var(--foreground)]">{title}</h3>
      </div>
      <p className="text-xs text-[color:var(--muted)] leading-relaxed">{description}</p>
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[var(--panel-strong)] border border-[color:var(--panel-border)] text-[8px] font-black uppercase tracking-widest text-[color:var(--muted-2)]">Soon</div>
    </div>
  );
};
