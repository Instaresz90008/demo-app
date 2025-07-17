
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Calendar, Eye, Settings } from 'lucide-react';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface UnifiedHeaderProps {
  variant?: 'end_user' | 'admin' | 'platform_admin';
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({ variant = 'end_user' }) => {
  const { user, checkRole, isPlatformAdmin } = useUnifiedAccessControl();
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Debug logging
  console.log('UnifiedHeader rendering with variant:', variant, 'user:', user?.name, 'roles:', user?.roles);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  const isTrialUser = user?.planType === 'freemium';
  
  // End user header (most detailed)
  if (variant === 'end_user') {
    return (
      <header className="h-16 sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
              FREE USER
            </Badge>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Find a service or person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 focus:border-primary focus:ring-primary shadow-sm"
              />
            </form>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isTrialUser && (
              <Badge variant="outline" className="hidden sm:flex text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800">
                Freemium Plan
              </Badge>
            )}

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
              <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-green-700 dark:text-green-300 font-medium">Synced</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/booking-links', '_blank')}
              className="hidden md:flex items-center gap-2 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              <span className="text-xs">Preview</span>
            </Button>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border shadow-sm">
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
                className="scale-90"
              />
              <label htmlFor="availability" className="text-xs font-medium cursor-pointer">
                {isAvailable ? (
                  <span className="text-green-700 dark:text-green-300">Available</span>
                ) : (
                  <span className="text-muted-foreground">Unavailable</span>
                )}
              </label>
            </div>

            <ThemeToggle />
            <NotificationDropdown />
            <ProfileDropdown />
          </div>
        </div>
      </header>
    );
  }

  // Admin header (simplified)
  if (variant === 'admin') {
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
  }

  // Platform admin header (most privileged)
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
