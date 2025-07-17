
import React, { useState } from 'react';
import { NotificationGroup as NotificationGroupType } from '@/types/notifications';
import { NotificationItem } from './NotificationItem';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationGroupProps {
  group: NotificationGroupType;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onPerformAction: (notificationId: string, action: any, data?: any) => Promise<{ success: boolean; message: string }>;
  onDelete: (id: string) => void;
}

export const NotificationGroupComponent: React.FC<NotificationGroupProps> = ({
  group,
  onMarkAsRead,
  onMarkAsUnread,
  onPerformAction,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (group.count === 1) {
    return (
      <NotificationItem
        notification={group.latestNotification}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onPerformAction={onPerformAction}
        onDelete={onDelete}
      />
    );
  }

  const unreadCount = group.notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="border-b border-gray-300">
      {/* Group Header */}
      <div className="p-4 hover:bg-gray-200 transition-colors bg-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-800">
                  {group.count} {group.type.replace('_', ' ')} notifications
                </h4>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs bg-sky-200 text-sky-800">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Latest: {group.latestNotification.title}
              </p>
            </div>
          </div>
        </Button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-300 bg-gray-100">
          {group.notifications.map((notification) => (
            <div key={notification.id} className="ml-4">
              <NotificationItem
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onMarkAsUnread={onMarkAsUnread}
                onPerformAction={onPerformAction}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
