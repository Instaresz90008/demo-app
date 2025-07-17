
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, Calendar, Clock, Users } from 'lucide-react';

const SlotBroadcast: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold mb-2">Slot Broadcast</h1>
          <p className="text-muted-foreground">
            Manage and broadcast your available time slots to clients
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5" />
                Active Broadcasts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">3</div>
              <p className="text-sm text-muted-foreground">
                Currently broadcasting slots
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Available Slots
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">12</div>
              <p className="text-sm text-muted-foreground">
                Open slots this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Interested Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">8</div>
              <p className="text-sm text-muted-foreground">
                Clients viewing slots
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full sm:w-auto">
              <Radio className="mr-2 h-4 w-4" />
              Create New Broadcast
            </Button>
            <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-2">
              <Clock className="mr-2 h-4 w-4" />
              Schedule Slots
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SlotBroadcast;
