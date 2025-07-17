
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ServiceCreation = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Service Creation</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Create and configure new services here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCreation;
