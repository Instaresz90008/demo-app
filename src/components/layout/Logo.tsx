
import React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface LogoProps {
  collapsed?: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed = false }) => {
  const LogoContent = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 animate-pulse">
        <span className="text-primary-foreground font-bold text-xs animate-bounce">JB</span>
      </div>
      {!collapsed && (
        <span className="font-semibold text-foreground transition-all duration-300 hover:scale-105 animate-fade-in">
          JusBook
        </span>
      )}
    </div>
  );

  if (collapsed) {
    return (
      <HoverCard>
        <HoverCardTrigger>
          <LogoContent />
        </HoverCardTrigger>
        <HoverCardContent side="right" className="w-auto p-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">JusBook</span>
            <span className="text-xs text-muted-foreground">– Core Booking Engine</span>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return <LogoContent />;
};

export default Logo;
