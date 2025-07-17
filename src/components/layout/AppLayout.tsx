
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {children}
    </div>
  );
};

export default AppLayout;
