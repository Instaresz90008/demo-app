
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  open,
  onClose,
  title,
  description,
  children
}) => {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-2xl ml-auto h-full">
        <DrawerHeader className="flex items-center justify-between">
          <div>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SettingsDrawer;
