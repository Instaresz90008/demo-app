
import React from 'react';
import { Home, Calendar, BarChart3, FileText, Zap, Settings, HelpCircle, Link, Shield, Users } from "lucide-react";
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { useNavigationRedux } from '@/hooks/useNavigationRedux';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const UnifiedSidebar: React.FC = () => {
  const { checkRole, isPlatformAdmin, user, capabilities } = useUnifiedAccessControl();
  const { isActiveRoute, navigateWithTracking } = useNavigationRedux();
  
  // Standard navigation for all non-platform admin users
  const standardNavigation = [
    { href: "/dashboard", icon: <Home className="h-3.5 w-3.5" />, label: "Dashboard" },
    { href: "/smart-service", icon: <Zap className="h-3.5 w-3.5" />, label: "Smart Service", badge: "New" },
    { href: "/calendar", icon: <Calendar className="h-3.5 w-3.5" />, label: "Calendar" },
    { href: "/event-management", icon: <BarChart3 className="h-3.5 w-3.5" />, label: "Event Management" },
    { href: "/reports", icon: <FileText className="h-3.5 w-3.5" />, label: "Reports" },
    { href: "/slot-broadcast", icon: <Zap className="h-3.5 w-3.5" />, label: "Slot Broadcast" },
    { href: "/manage-services", icon: <Settings className="h-3.5 w-3.5" />, label: "Manage Services" },
    { href: "/help", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Get Help" },
    { href: "/booking-links", icon: <Link className="h-3.5 w-3.5" />, label: "Booking Links" },
  ];

  // Platform admin exclusive navigation
  const platformAdminNavigation = [
    { href: "/dashboard", icon: <Home className="h-3.5 w-3.5" />, label: "Dashboard" },
    { href: "/admin/users", icon: <Users className="h-3.5 w-3.5" />, label: "User Management", requiredRole: ['platform_admin'] },
    { href: "/cleanup", icon: <Shield className="h-3.5 w-3.5" />, label: "Cleanup Center", requiredRole: ['platform_admin'] },
    { href: "/duplicate-showcase", icon: <Shield className="h-3.5 w-3.5" />, label: "Duplicate Showcase", requiredRole: ['platform_admin'] },
    { href: "/subscription-management", icon: <Shield className="h-3.5 w-3.5" />, label: "Subscriptions", requiredRole: ['platform_admin'] },
    { href: "/help", icon: <HelpCircle className="h-3.5 w-3.5" />, label: "Help" },
    { href: "/settings", icon: <Settings className="h-3.5 w-3.5" />, label: "Settings" },
  ];
  
  const isActive = (path: string) => isActiveRoute(path);

  const renderNavItem = (item: any) => {
    if (item.requiredRole && !checkRole(item.requiredRole)) return null;
    
    // Check if user has access to smart service
    if (item.href === '/smart-service' && !capabilities?.smartServiceAccess) return null;
    
    return (
      <button
        key={item.href}
        onClick={() => navigateWithTracking(item.href)}
        className={cn(
          "w-full flex items-center gap-1.5 px-2 py-1.5 text-left rounded-md transition-colors text-xs font-medium",
          isActive(item.href) 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        )}
      >
        {item.icon}
        <span className="truncate text-xs">{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto text-[9px] px-1 py-0">
            {item.badge}
          </Badge>
        )}
      </button>
    );
  };

  // Platform Admin gets different layout
  if (isPlatformAdmin) {
    return (
      <Sidebar className="w-48 border-r bg-background h-screen sticky top-0">
        <SidebarContent className="p-3">
          <div className="space-y-0.5">
            {platformAdminNavigation.map(renderNavItem)}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Standard layout for all other users (Free, Advanced, Professional)
  return (
    <Sidebar className="w-48 border-r bg-background h-screen sticky top-0">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">JB</span>
            </div>
            <span className="font-semibold text-sm">JusBook</span>
          </div>
        </div>

        {/* Navigation - Scrollable Middle Section */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-0.5">
            {standardNavigation.map(renderNavItem)}
          </div>
        </div>

        {/* Bottom Section - Stylized and Compact */}
        <div className="flex-shrink-0 p-2 space-y-1.5 border-t border-border bg-gradient-to-t from-muted/20 to-transparent">
          {/* Import Contacts Section */}
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-xs h-7 px-2 hover:bg-accent/50"
            onClick={() => navigateWithTracking('/import-contacts')}
          >
            <Users className="h-3 w-3 mr-1.5" />
            <span className="truncate text-xs">Import Contacts</span>
          </Button>

          {/* Subscription Section */}
          <div className="bg-gradient-to-r from-muted/40 to-muted/30 rounded-md p-2 border border-border/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Settings className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">Plan</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-1.5 leading-tight">Manage subscription</p>
            <Button 
              variant="outline" 
              size="sm"
              className="w-full text-[10px] h-6 px-2 border-border/60 hover:border-border"
              onClick={() => navigateWithTracking('/subscription-management')}
            >
              <FileText className="h-2.5 w-2.5 mr-1" />
              <span className="truncate">Manage</span>
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default UnifiedSidebar;
