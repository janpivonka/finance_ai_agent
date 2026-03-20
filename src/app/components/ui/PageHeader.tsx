import React from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "./Badge";

interface PageHeaderProps {
  badgeIcon?: LucideIcon;
  badgeText?: string;
  badgeVariant?: "indigo" | "fuchsia" | "cyan" | "rose" | "emerald";
  title: React.ReactNode;
  description?: string;
  rightElement?: React.ReactNode;
  className?: string;
  withReveal?: boolean;
  revealType?: "on-load" | "on-scroll";
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  badgeIcon, 
  badgeText, 
  badgeVariant = "indigo",
  title, 
  description, 
  rightElement,
  className = "",
  withReveal = true,
  revealType = "on-load"
}) => {
  const revealClass = withReveal 
    ? (revealType === "on-load" ? "reveal-header" : "reveal") 
    : "";

  return (
    <header className={`mb-12 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 ${revealClass} ${className}`}>
      <div className="text-left flex-1 min-w-0">
        {badgeText && (
          <div className="mb-4">
            <Badge icon={badgeIcon} text={badgeText} variant={badgeVariant} animate />
          </div>
        )}
        <h1 className="text-4xl font-black tracking-tight text-[color:var(--foreground)] italic md:text-5xl">
          {title}
        </h1>
        {description && (
          <div className="mt-6 border-l border-[color:var(--panel-border)] pl-6 py-1">
            <p className="text-[color:var(--muted)] text-sm leading-relaxed font-medium max-w-xl">
              {description}
            </p>
          </div>
        )}
      </div>
      {rightElement && (
        <div className="shrink-0">
          {rightElement}
        </div>
      )}
    </header>
  );
};
