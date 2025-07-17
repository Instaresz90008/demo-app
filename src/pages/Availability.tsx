
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Availability = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Availability</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Manage Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Set your availability and working hours here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Availability;
