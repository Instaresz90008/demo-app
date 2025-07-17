
import React from 'react';
import { useSmartFooter } from '@/hooks/useSmartFooter';
import { cn } from '@/lib/utils';

interface FooterProps {
  organizationName?: string;
}

const Footer: React.FC<FooterProps> = ({ organizationName }) => {
  const { isSticky } = useSmartFooter();

  return (
    <footer className={cn(
      "py-3 px-4 bg-background text-foreground border-t border-border",
      isSticky 
        ? "mt-auto shadow-sm" 
        : ""
    )}>
      <div className="flex items-center justify-between text-xs text-muted-foreground max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {organizationName ? (
            <span className="text-sm font-semibold text-foreground">
              {organizationName}
            </span>
          ) : (
            <div className="flex items-center justify-center bg-primary text-primary-foreground font-bold px-3 py-1.5 rounded-xl">
              <span className="text-sm font-bold">JusBook</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">© 2024 All Rights Reserved</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Powered by</span>
          <span className="text-sm font-bold text-primary">
            JusBook
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
