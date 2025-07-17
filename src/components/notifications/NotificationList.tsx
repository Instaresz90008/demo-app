
import React from 'react';
import { useNotifications } from '@/context/NotificationsContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BellOff, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ConnectionStatus from '@/components/common/ConnectionStatus';

interface NotificationListProps {
  maxHeight?: number;
}

const NotificationList = ({ maxHeight = 400 }: NotificationListProps) => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <div className="bg-purple-500/20 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
          <BellOff className="h-6 w-6 text-purple-300 mx-auto opacity-60" />
        </div>
        <h3 className="font-medium text-sm mb-1 text-purple-100">No notifications</h3>
        <p className="text-xs text-purple-300 max-w-[250px] mx-auto">
          You're all caught up! We'll notify you when something new arrives.
        </p>
        <div className="mt-4">
          <ConnectionStatus showText={true} className="justify-center" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-purple-200" />
          <h3 className="font-medium text-sm text-purple-100">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-purple-500/20 text-purple-200 text-xs px-1.5 py-0.5 border border-purple-500/30">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatus className="mr-2" />
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7 px-2 hover:bg-purple-500/20 hover:text-purple-200 text-purple-300" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className={cn("overflow-auto", maxHeight ? `max-h-[${maxHeight}px]` : "max-h-[400px]")}>
        <AnimatePresence initial={false}>
          {notifications.map((notification, index) => (
            <motion.div 
              key={notification.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="group relative p-4 border-b border-purple-500/20 hover:bg-purple-500/10"
            >
              <div className="flex items-start gap-3">
                {!notification.read && (
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                )}
                <div className="flex-1">
                  <h4 className={cn(
                    "text-sm text-purple-100",
                    !notification.read ? "font-semibold" : "font-medium"
                  )}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-purple-300 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-purple-400">
                      {new Date(notification.date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};

export default NotificationList;
