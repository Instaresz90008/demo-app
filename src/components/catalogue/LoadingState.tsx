
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 flex flex-col items-center">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading catalogue...</p>
      </div>
    </div>
  );
};

export default LoadingState;
