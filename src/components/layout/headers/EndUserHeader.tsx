
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty, CommandGroup } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Bell, Calendar, Eye, Settings, Home, BarChart3, FileText, Zap, HelpCircle, Link, Users } from 'lucide-react';
import { useUnifiedAccessControl } from '@/hooks/useUnifiedAccessControl';
import { ProfileDropdown } from '../ProfileDropdown';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import useDebounce from '@/hooks/useDebounce';

export const EndUserHeader: React.FC = () => {
  const { user } = useUnifiedAccessControl();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Enhanced search data for end users
  const searchData = useMemo(() => [
    // Navigation Items
    { 
      id: '1', 
      title: 'Dashboard', 
      description: 'View your overview and statistics',
      path: '/dashboard', 
      icon: Home, 
      category: 'Navigation',
      keywords: ['home', 'overview', 'stats', 'summary']
    },
    { 
      id: '2', 
      title: 'Smart Service', 
      description: 'AI-powered service management',
      path: '/smart-service', 
      icon: Zap, 
      category: 'Navigation',
      keywords: ['ai', 'intelligent', 'automation', 'smart']
    },
    { 
      id: '3', 
      title: 'Calendar', 
      description: 'Manage your appointments and schedule',
      path: '/calendar', 
      icon: Calendar, 
      category: 'Navigation',
      keywords: ['appointments', 'schedule', 'booking', 'time']
    },
    { 
      id: '4', 
      title: 'Event Management', 
      description: 'Create and manage events',
      path: '/event-management', 
      icon: BarChart3, 
      category: 'Navigation',
      keywords: ['events', 'manage', 'organize', 'planning']
    },
    { 
      id: '5', 
      title: 'Reports', 
      description: 'View analytics and insights',
      path: '/reports', 
      icon: FileText, 
      category: 'Navigation',
      keywords: ['analytics', 'insights', 'data', 'statistics']
    },
    { 
      id: '6', 
      title: 'Booking Links', 
      description: 'Manage your booking links',
      path: '/booking-links', 
      icon: Link, 
      category: 'Navigation',
      keywords: ['links', 'booking', 'share', 'public']
    },
    { 
      id: '7', 
      title: 'Import Contacts', 
      description: 'Import and manage your contacts',
      path: '/import-contacts', 
      icon: Users, 
      category: 'Tools',
      keywords: ['contacts', 'import', 'upload', 'csv', 'excel']
    },
    { 
      id: '8', 
      title: 'Subscription Management', 
      description: 'Manage your subscription plan',
      path: '/subscription-management', 
      icon: Settings, 
      category: 'Account',
      keywords: ['subscription', 'plan', 'billing', 'upgrade', 'downgrade']
    },
    { 
      id: '9', 
      title: 'Help Center', 
      description: 'Get help and support',
      path: '/help', 
      icon: HelpCircle, 
      category: 'Support',
      keywords: ['help', 'support', 'faq', 'assistance']
    },
    // Quick Actions
    { 
      id: '10', 
      title: 'Create New Service', 
      description: 'Quick action to create a new service',
      path: '/smart-service?action=create', 
      icon: Zap, 
      category: 'Quick Actions',
      keywords: ['create', 'new', 'service', 'add']
    },
    { 
      id: '11', 
      title: 'View Today\'s Schedule', 
      description: 'See your appointments for today',
      path: '/calendar?view=today', 
      icon: Calendar, 
      category: 'Quick Actions',
      keywords: ['today', 'schedule', 'appointments', 'agenda']
    },
  ], []);

  const filteredResults = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) return [];
    
    const query = debouncedQuery.toLowerCase();
    return searchData.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.keywords.some(keyword => keyword.toLowerCase().includes(query))
    ).slice(0, 8);
  }, [debouncedQuery, searchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredResults.length > 0) {
      navigate(filteredResults[0].path);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleItemSelect = (path: string) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const isTrialUser = user?.planType === 'freemium';
  
  return (
    <header className="h-16 sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
            FREE USER
          </Badge>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search services, pages, actions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="pl-10 h-10 focus:border-primary focus:ring-primary shadow-sm"
                />
              </form>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[400px] p-0" 
              align="center"
              side="bottom"
            >
              <Command>
                <CommandInput 
                  placeholder="Search..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="hidden"
                />
                <CommandList className="max-h-80">
                  <CommandEmpty>
                    <div className="text-center py-6">
                      <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No results found</p>
                    </div>
                  </CommandEmpty>
                  
                  {filteredResults.length > 0 && (
                    <>
                      {['Navigation', 'Tools', 'Account', 'Support', 'Quick Actions'].map(category => {
                        const categoryItems = filteredResults.filter(item => item.category === category);
                        if (categoryItems.length === 0) return null;
                        
                        return (
                          <CommandGroup key={category} heading={category}>
                            {categoryItems.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={item.title}
                                onSelect={() => handleItemSelect(item.path)}
                                className="flex items-center gap-3 p-3 cursor-pointer"
                              >
                                <div className="p-1.5 rounded-md bg-muted">
                                  <item.icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{item.title}</div>
                                  <div className="text-xs text-muted-foreground">{item.description}</div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        );
                      })}
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
};
