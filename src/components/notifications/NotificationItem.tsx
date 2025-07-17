
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BaseNotification, NotificationAction } from '@/types/notifications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  DollarSign, 
  Calendar,
  X,
  Eye,
  Check,
  XCircle,
  RotateCcw
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NotificationItemProps {
  notification: BaseNotification;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onPerformAction: (notificationId: string, action: NotificationAction, data?: any) => Promise<{ success: boolean; message: string }>;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking_confirmation':
      return <Calendar className="h-4 w-4 text-sky-600" />;
    case 'booking_reminder':
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    case 'payment_received':
      return <DollarSign className="h-4 w-4 text-green-500" />;
    case 'cancellation':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Info className="h-4 w-4 text-sky-600" />;
  }
};

const getActionIcon = (action: NotificationAction) => {
  switch (action) {
    case 'approve':
      return <Check className="h-3 w-3" />;
    case 'decline':
      return <X className="h-3 w-3" />;
    case 'view':
      return <Eye className="h-3 w-3" />;
    case 'reschedule':
      return <RotateCcw className="h-3 w-3" />;
    default:
      return null;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onMarkAsUnread,
  onPerformAction,
  onDelete,
}) => {
  const [isPerformingAction, setIsPerformingAction] = useState<string | null>(null);

  const handleAction = async (action: NotificationAction) => {
    setIsPerformingAction(action);
    try {
      await onPerformAction(notification.id, action);
    } finally {
      setIsPerformingAction(null);
    }
  };

  const isDestructive = (action: NotificationAction) => {
    return action === 'decline' || action === 'approve';
  };

  return (
    <div
      className={cn(
        "p-4 border-b transition-colors hover:bg-accent/50",
        notification.status === 'unread' && "bg-primary/5 border-l-2 border-l-primary"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator */}
        <div className="mt-1 flex-shrink-0">
          {notification.status === 'unread' && (
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={cn(
                "text-sm",
                notification.status === 'unread' ? "font-semibold text-foreground" : "font-medium text-foreground"
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.message}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {notification.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Read/Unread Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-accent"
                onClick={() => notification.status === 'read' ? onMarkAsUnread(notification.id) : onMarkAsRead(notification.id)}
                title={notification.status === 'read' ? 'Mark as unread' : 'Mark as read'}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  notification.status === 'unread' ? "bg-primary" : "bg-muted-foreground"
                )} />
              </Button>

              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(notification.id)}
                title="Delete notification"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {notification.actions.map((action) => {
                const ActionButton = (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="sm"
                    className="h-7 text-xs"
                    disabled={isPerformingAction === action.id}
                    onClick={() => !isDestructive(action.id) && handleAction(action.id)}
                  >
                    {isPerformingAction === action.id ? (
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      getActionIcon(action.id)
                    )}
                    <span className="ml-1">{action.label}</span>
                  </Button>
                );

                if (isDestructive(action.id)) {
                  return (
                    <AlertDialog key={action.id}>
                      <AlertDialogTrigger asChild>
                        {ActionButton}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to {action.label.toLowerCase()} this request? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAction(action.id)}
                            className={action.variant === 'destructive' ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}
                          >
                            {action.label}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  );
                }

                return ActionButton;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
