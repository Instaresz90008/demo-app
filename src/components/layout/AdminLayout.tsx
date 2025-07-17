
import React from 'react';
import { AdminHeader } from './headers/AdminHeader';
import { AdminSidebar } from './sidebars/AdminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, className }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground w-full flex">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          
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

export default AdminLayout;
