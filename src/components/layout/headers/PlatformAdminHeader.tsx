
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';
import { ProfileDropdown } from '../ProfileDropdown';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const PlatformAdminHeader: React.FC = () => {
  return (
    <header className="h-16 flex items-center bg-background border-b border-border">
      <div className="flex h-full w-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800">
            PLATFORM ADMIN
          </Badge>
          <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
            SUPER USER
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <a href="/cleanup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Cleanup Center</span>
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
