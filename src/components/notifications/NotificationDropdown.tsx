
import React from 'react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { NotificationBadge } from './NotificationBadge';
import { NotificationGroupComponent } from './NotificationGroup';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellOff, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const NotificationDropdown: React.FC = () => {
  const {
    notifications,
    counts,
    groups,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    performAction,
    deleteNotification,
  } = useNotificationSystem();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <NotificationBadge count={counts.unread} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-96 p-0 bg-popover text-popover-foreground border border-border shadow-lg z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h3 className="font-semibold">Notifications</h3>
            {counts.unread > 0 && (
              <span className="text-xs text-muted-foreground">
                ({counts.unread} unread)
              </span>
            )}
          </div>
          {counts.unread > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs hover:bg-accent hover:text-accent-foreground text-primary"
              onClick={markAllAsRead}
              disabled={isLoading}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[500px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium mb-1">No notifications</h4>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you when something new arrives.
              </p>
            </div>
          ) : (
            <div>
              {groups.map((group, index) => (
                <NotificationGroupComponent
                  key={`${group.type}-${index}`}
                  group={group}
                  onMarkAsRead={markAsRead}
                  onMarkAsUnread={markAsUnread}
                  onPerformAction={performAction}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full text-sm">
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
