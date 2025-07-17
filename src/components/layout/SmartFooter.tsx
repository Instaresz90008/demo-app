
import React from 'react';
import { useAccessControl } from '@/context/AccessControlContext';
import { Button } from '@/components/ui/button';
import { Heart, Info, Mail, MessageSquare } from 'lucide-react';

export const SmartFooter: React.FC = () => {
  const { isFeatureEnabled } = useAccessControl();
  
  const showContactSupport = isFeatureEnabled('contact_support');
  const showFeedbackButton = isFeatureEnabled('feedback_system');
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-3 border-t border-border bg-background text-foreground">
      <div className="layout-container px-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-[1920px] mx-auto">
        <div className="flex items-center space-x-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Acme Corp. All rights reserved.
          </p>
          <div className="hidden sm:flex space-x-3">
            <Button variant="link" size="sm" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
              Privacy
            </Button>
            <Button variant="link" size="sm" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
              Terms
            </Button>
            <Button variant="link" size="sm" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
              Cookies
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          {showContactSupport && (
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent">
              <Mail className="h-3 w-3 mr-1" />
              Contact
            </Button>
          )}
          
          {showFeedbackButton && (
            <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent">
              <MessageSquare className="h-3 w-3 mr-1" />
              Feedback
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent">
            <Info className="h-3 w-3 mr-1" />
            About
          </Button>
          
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-accent">
            <Heart className="h-3 w-3 mr-1" />
            Support
          </Button>
        </div>
      </div>
    </footer>
  );
};
