
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BookingForm = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Booking Form</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and manage bookings here.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BookingForm;
