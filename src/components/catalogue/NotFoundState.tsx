
import React from 'react';
import { Button } from '@/components/ui/button';

const NotFoundState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4 max-w-md mx-auto p-6 border border-red-200 rounded-lg bg-red-50">
        <h2 className="text-xl font-medium text-red-800">Catalogue Not Found</h2>
        <p className="text-red-600">The catalogue you're looking for doesn't exist or has been removed.</p>
        <Button variant="outline" onClick={() => window.location.href = '/catalogue'}>
          Return to Catalogues
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
