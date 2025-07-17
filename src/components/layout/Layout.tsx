
import React from 'react';
import { UnifiedHeader } from './UnifiedHeader';
import Footer from './Footer';
import UnifiedSidebar from './UnifiedSidebar';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, className }) => {
  const { isPlatformAdmin, checkRole } = useUnifiedAccessControl();

  // Determine header variant based on user role
  const getHeaderVariant = (): 'end_user' | 'admin' | 'platform_admin' => {
    if (isPlatformAdmin) return 'platform_admin';
    if (checkRole(['org_admin', 'team_admin'])) return 'admin';
    return 'end_user';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground w-full flex">
        <UnifiedSidebar />
        
        <div className="flex-1 flex flex-col">
          <UnifiedHeader variant={getHeaderVariant()} />
          
          <main className={cn(
            "flex-1 px-6 py-8 overflow-auto",
            className
          )}>
            <div className="max-w-full space-y-8">
              {children}
            </div>
            
            <div className="py-6">
              <Footer />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
