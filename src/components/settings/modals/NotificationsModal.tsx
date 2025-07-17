
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NotificationsTab from '@/components/settings/NotificationsTab';

interface NotificationsModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🔔 Notifications & Alerts
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <NotificationsTab />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
