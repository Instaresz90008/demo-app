
import React, { useState } from 'react';
import { Home, Calendar, BarChart3, FileText, Zap, Settings, HelpCircle, Link, Users, Bot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import TaraAIModal from '@/components/ai/TaraAIModal';

export const EndUserSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkRole } = useUnifiedAccessControl();
  const currentPath = location.pathname;
  const [isTaraModalOpen, setIsTaraModalOpen] = useState(false);
  
  const navigation = [
    { href: "/dashboard", icon: <Home className="h-5 w-5" />, label: "Dashboard" },
    { href: "/smart-service", icon: <Zap className="h-5 w-5" />, label: "Smart Service" },
    { href: "/calendar", icon: <Calendar className="h-5 w-5" />, label: "Calendar" },
    { href: "/event-management", icon: <BarChart3 className="h-5 w-5" />, label: "Event Management" },
    { href: "/reports", icon: <FileText className="h-5 w-5" />, label: "Reports" },
    { href: "/slot-broadcast", icon: <Zap className="h-5 w-5" />, label: "Slot Broadcast" },
    { href: "/manage-services", icon: <Settings className="h-5 w-5" />, label: "Manage Services" },
    { href: "/help", icon: <HelpCircle className="h-5 w-5" />, label: "Get Help" },
    { href: "/booking-links", icon: <Link className="h-5 w-5" />, label: "Booking Links" },
    { href: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && (currentPath === "/" || currentPath === "/dashboard")) return true;
    if (path !== "/dashboard" && currentPath.startsWith(path)) return true;
    return false;
  };

  const renderNavItem = (item: any) => {
    return (
      <button
        key={item.href}
        onClick={() => navigate(item.href)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors text-sm font-medium group",
          isActive(item.href) 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {item.icon}
        <span className="group-data-[sidebar=collapsed]:hidden">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      <Sidebar className="border-r bg-background transition-all duration-300 data-[sidebar=collapsed]:w-16 data-[sidebar=expanded]:w-64 h-screen sticky top-0">
        <SidebarContent className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">JB</span>
              </div>
              <span className="font-semibold text-lg group-data-[sidebar=collapsed]:hidden">JusBook</span>
            </div>
          </div>

          {/* Navigation - Scrollable Middle Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map(renderNavItem)}
            </div>
          </div>

          {/* Bottom Section - Always at bottom, not scrollable */}
          <div className="flex-shrink-0 p-4 space-y-3 border-t border-border bg-background">
            {/* Tara AI Button */}
            <Button 
              variant="outline" 
              className="w-full justify-start text-sm group-data-[sidebar=collapsed]:justify-center bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
              onClick={() => setIsTaraModalOpen(true)}
            >
              <Bot className="h-4 w-4 group-data-[sidebar=collapsed]:mr-0 group-data-[sidebar=expanded]:mr-2 text-purple-600" />
              <span className="group-data-[sidebar=collapsed]:hidden bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-medium">
                Meet Tara AI
              </span>
            </Button>

            {/* Import Contacts Section */}
            <Button 
              variant="secondary" 
              className="w-full justify-start text-sm group-data-[sidebar=collapsed]:justify-center"
              onClick={() => navigate('/import-contacts')}
            >
              <Users className="h-4 w-4 group-data-[sidebar=collapsed]:mr-0 group-data-[sidebar=expanded]:mr-2" />
              <span className="group-data-[sidebar=collapsed]:hidden">Import Contacts</span>
            </Button>

            {/* Subscription Section */}
            <div className="bg-muted/30 rounded-lg p-3 group-data-[sidebar=collapsed]:hidden">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Subscription</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Manage your plan</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => navigate('/subscription-management')}
              >
                <FileText className="h-3 w-3 mr-2" />
                Manage Plan
              </Button>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Tara AI Modal */}
      <TaraAIModal 
        isOpen={isTaraModalOpen} 
        onClose={() => setIsTaraModalOpen(false)} 
      />
    </>
  );
};
