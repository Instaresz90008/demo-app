
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarBrandHeaderProps {
  isCollapsed: boolean;
}

export const SidebarBrandHeader: React.FC<SidebarBrandHeaderProps> = ({ isCollapsed }) => {
  const toggleSidebar = () => {
    // This will be handled by parent component
  };

  return (
    <div className="flex items-center justify-between p-4">
      {!isCollapsed && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg hover:shadow-primary/25 transition-all duration-200 hover:shadow-xl">
              <span className="text-xs">JB</span>
            </div>
            <span className="font-semibold text-lg text-foreground">JusBook</span>
          </div>
        </div>
      )}
      {isCollapsed && (
        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm mx-auto shadow-lg hover:shadow-primary/25 transition-all duration-200 hover:shadow-xl">
          <span className="text-xs">JB</span>
        </div>
      )}
    </div>
  );
};
