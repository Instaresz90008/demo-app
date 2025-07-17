
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const TeamManagement = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Team Management</h1>
        <Badge variant="outline">Team Admin+</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Manage Team Members</CardTitle>
        </CardHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Add, remove, and manage team member permissions and roles.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default TeamManagement;
