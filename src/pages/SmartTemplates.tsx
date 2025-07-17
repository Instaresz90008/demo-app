
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { File, Crown } from 'lucide-react';
import SmartTemplateGenerator from '@/components/smart-service/SmartTemplateGenerator';

const SmartTemplates: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <File className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Smart Templates</h1>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Crown className="h-3 w-3 mr-1" />
            Platform Admin
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Manage service templates that will be available to users during onboarding and smart booking flows.
          These templates are dynamically fetched based on user intent and location.
        </p>
      </div>

      {/* Template Generator Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5" />
            Template Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SmartTemplateGenerator />
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTemplates;
