import React from 'react';
import { Home, Users, Building, Shield, Settings, FileText, AlertTriangle, Monitor, File } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export const PlatformAdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const navigation = [
    { 
      section: "Overview",
      items: [
        { href: "/dashboard", icon: <Home className="h-4 w-4" />, label: "Dashboard" }
      ]
    },
    {
      section: "Smart Services",
      items: [
        { href: "/smart-templates", icon: <File className="h-4 w-4" />, label: "Smart Templates" }
      ]
    },
    {
      section: "Management",
      items: [
        { href: "/admin/users", icon: <Users className="h-4 w-4" />, label: "User Management" },
        { href: "/admin/organizations", icon: <Building className="h-4 w-4" />, label: "Organization Management" }
      ]
    },
    {
      section: "System",
      items: [
        { href: "/admin/settings", icon: <Settings className="h-4 w-4" />, label: "System Settings" },
        { href: "/admin/security", icon: <Shield className="h-4 w-4" />, label: "Security Monitor" },
        { href: "/admin/audit-logs", icon: <FileText className="h-4 w-4" />, label: "Audit Logs" }
      ]
    },
    {
      section: "Legacy",
      items: [
        { href: "/cleanup", icon: <Monitor className="h-4 w-4" />, label: "Cleanup Center" },
        { href: "/duplicate-showcase", icon: <AlertTriangle className="h-4 w-4" />, label: "Duplicate Showcase" },
        { href: "/subscription-management", icon: <Shield className="h-4 w-4" />, label: "Subscriptions" }
      ]
    }
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
    <Sidebar className="border-r bg-background transition-all duration-300 data-[sidebar=collapsed]:w-16 data-[sidebar=expanded]:w-64">
      <SidebarContent className="p-4">
        <div className="space-y-6">
          {navigation.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 group-data-[sidebar=collapsed]:hidden">
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
