
import React from 'react';
import { PlatformAdminHeader } from './headers/PlatformAdminHeader';
import { PlatformAdminSidebar } from './sidebars/PlatformAdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface PlatformAdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const PlatformAdminLayout: React.FC<PlatformAdminLayoutProps> = ({ children, title, className }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground w-full flex">
        <PlatformAdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <PlatformAdminHeader />
          
          <main className={cn(
            "flex-1 px-6 py-8 overflow-auto transition-all duration-300",
            className
          )}>
            <div className="max-w-full space-y-8">
              {title && (
                <div className="border-b pb-4">
                  <h1 className="text-2xl font-bold">{title}</h1>
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PlatformAdminLayout;
