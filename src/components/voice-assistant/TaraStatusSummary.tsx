import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2 } from 'lucide-react';

export const TaraStatusSummary: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          TARA Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Voice Assistant</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Audio Input</span>
            <Volume2 className="h-4 w-4 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};