import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// CalendarView deleted - only EnhancedCalendarView remains
import EnhancedCalendarView from '@/components/calendar/EnhancedCalendarView';
import { 
  Eye,
  GitCompare,
  LayoutIcon,
  Calendar,
  Monitor
} from 'lucide-react';

const DuplicateShowcase = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Component Duplicates Review</h1>
        <p className="text-muted-foreground">
          This page shows all duplicate components side by side for easy comparison and decision making.
        </p>
      </div>

      {/* Headers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Header Components
            <Badge variant="destructive">2 Duplicates</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Header 1: Main Header (DELETED)</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="text-red-500 italic">This component has been deleted - only EndUserHeader remains with RBAC support</div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive" disabled>Already Deleted</Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Unified Header (RBAC-enabled)</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="text-muted-foreground italic">Header component preview - currently active in layout</div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline">Keep This</Button>
              <Button size="sm" variant="outline">Merge</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebars Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutIcon className="h-5 w-5" />
            Sidebar Components
            <Badge variant="destructive">2 Duplicates</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Unified Sidebar (MERGED)</h3>
            <div className="border rounded-lg p-4 bg-muted/30 max-w-md">
              <div className="h-64 overflow-hidden">
                <div className="text-muted-foreground italic">Sidebar component preview - currently active in layout</div>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" disabled>Already Merged</Button>
              <div className="text-green-600 text-sm font-medium">✅ Basic & Dynamic sidebars merged with RBAC support</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendars Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar Components
            <Badge variant="destructive">2 Duplicates</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Calendar 1: Basic Calendar View (DELETED)</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="text-red-500 italic">Basic calendar component deleted - only Enhanced Calendar remains</div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="destructive" disabled>Already Deleted</Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Calendar 2: Enhanced Calendar View</h3>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="h-96 overflow-hidden">
                <EnhancedCalendarView />
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline">Keep This</Button>
              <Button size="sm" variant="outline">Merge</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Compare All Duplicates
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              Auto-Cleanup (Recommended)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DuplicateShowcase;