
import * as React from "react";
import { cn } from "@/lib/utils";

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
};

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const toggle = React.useCallback(() => {
    setCollapsed(prev => !prev);
  }, []);

  const value: SidebarContextType = {
    collapsed,
    setCollapsed,
    toggle,
  };

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("group", collapsed ? "data-[sidebar=collapsed]" : "data-[sidebar=expanded]")} data-sidebar={collapsed ? "collapsed" : "expanded"}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { toggle } = useSidebar();

  return (
    <button
      ref={ref}
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "h-9 w-9",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
      </svg>
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-full transition-all duration-300", className)}
      {...props}
    />
  );
});
Sidebar.displayName = "Sidebar";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-full", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

export { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, useSidebar };
