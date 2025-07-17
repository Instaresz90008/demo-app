
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { ProfileDropdown } from '../ProfileDropdown';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const AdminHeader: React.FC = () => {
  const { checkRole } = useUnifiedAccessControl();

  return (
    <header className="h-16 flex items-center bg-background border-b border-border">
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
            {checkRole('org_admin') ? 'ORG ADMIN' : 'TEAM ADMIN'}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </a>
          </Button>
          <ThemeToggle />
          <NotificationDropdown />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
