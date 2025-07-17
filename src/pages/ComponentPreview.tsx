import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Code, 
  FileText, 
  GitMerge, 
  Trash2, 
  Shield,
  Calendar,
  Layout as LayoutIcon,
  Component,
  BarChart3
} from 'lucide-react';

// Component previews - in a real app, these would be dynamic imports
const COMPONENT_PREVIEWS: Record<string, React.ComponentType> = {
  'layout-header': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center px-6">
        <h1 className="text-white text-xl font-bold">Header Component</h1>
        <div className="ml-auto flex gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Main application header with navigation and user actions</p>
    </div>
  ),
  
  'layout-enduser-header': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded flex items-center px-6">
        <h1 className="text-white text-xl font-bold">End User Header</h1>
        <div className="ml-auto flex gap-2">
          <Badge className="bg-white/20 text-white">Free Plan</Badge>
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Specialized header for end users with plan info</p>
    </div>
  ),

  'layout-sidebar': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="w-60 h-64 bg-gradient-to-b from-gray-50 to-gray-100 rounded border-r">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <div className="space-y-2">
            {['Dashboard', 'Calendar', 'Settings', 'Profile'].map((item) => (
              <div key={item} className="px-3 py-2 rounded hover:bg-gray-200 text-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Basic sidebar navigation component</p>
    </div>
  ),

  'layout-dynamic-sidebar': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="w-60 h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded border-r">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Dynamic Nav</h3>
          <div className="space-y-2">
            {['Dashboard', 'Calendar', 'Team Mgmt', 'Admin'].map((item) => (
              <div key={item} className="px-3 py-2 rounded hover:bg-blue-200 text-sm flex items-center gap-2">
                <Shield className="h-3 w-3" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Role-based dynamic sidebar with RBAC</p>
    </div>
  ),

  'calendar-view': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Calendar View</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Month</Button>
            <Button size="sm" variant="outline">Week</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 h-32">
          {Array.from({length: 21}).map((_, i) => (
            <div key={i} className="bg-gray-50 border rounded p-1 text-xs">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Basic calendar view component</p>
    </div>
  ),

  'calendar-enhanced': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Enhanced Calendar</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Sync</Button>
            <Button size="sm" variant="outline">Export</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 h-32">
          {Array.from({length: 21}).map((_, i) => (
            <div key={i} className={`border rounded p-1 text-xs ${i % 3 === 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
              {i + 1}
              {i % 5 === 0 && <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Advanced calendar with sync and enhanced features</p>
    </div>
  ),

  'booking-n9iz-v1': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium">Service</div>
              <div className="text-xs text-muted-foreground">Consultation</div>
            </div>
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium">Duration</div>
              <div className="text-xs text-muted-foreground">30 minutes</div>
            </div>
          </div>
          <Button className="w-full">Select Time Slot</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Original booking form component</p>
    </div>
  ),

  'booking-n9iz-mobile': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="max-w-xs mx-auto bg-white border rounded-lg p-4">
        <h3 className="text-lg font-bold mb-3">Book Appointment</h3>
        <div className="space-y-3">
          <div className="p-2 border rounded text-center">
            <div className="text-sm font-medium">Service</div>
            <div className="text-xs text-muted-foreground">Consultation</div>
          </div>
          <Button size="sm" className="w-full">Select Time</Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Mobile-optimized booking form</p>
    </div>
  ),

  'catalogue-view2': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Services Catalogue</h3>
        <div className="grid grid-cols-2 gap-3">
          {['Service A', 'Service B', 'Service C', 'Service D'].map((service) => (
            <div key={service} className="p-3 border rounded-lg hover:shadow-sm">
              <div className="font-medium text-sm">{service}</div>
              <div className="text-xs text-muted-foreground">30 min • $99</div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Services catalogue view variant 2</p>
    </div>
  ),

  'catalogue-view3': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Services Directory</h3>
        <div className="space-y-2">
          {['Premium Service', 'Standard Service', 'Basic Service'].map((service) => (
            <div key={service} className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <div className="font-medium text-sm">{service}</div>
                <div className="text-xs text-muted-foreground">45 min session</div>
              </div>
              <Badge variant="outline">$149</Badge>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Services catalogue view variant 3</p>
    </div>
  ),

  'dashboard-synced-header': () => (
    <div className="border rounded-lg p-4 bg-background">
      <div className="h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded flex items-center px-4">
        <h2 className="text-white text-lg font-semibold">Synced Dashboard Header</h2>
        <div className="ml-auto flex gap-2">
          <div className="w-6 h-6 bg-white/20 rounded"></div>
          <div className="w-6 h-6 bg-white/20 rounded"></div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">Synchronized header for dashboard pages</p>
    </div>
  ),

  // Default fallback
  'default': () => (
    <div className="border rounded-lg p-8 bg-muted/50 text-center">
      <Component className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">Component Preview</h3>
      <p className="text-sm text-muted-foreground">
        Live preview will be available when component preview system is implemented
      </p>
    </div>
  )
};

const COMPONENT_INFO = {
  'layout-header': { name: 'Header Component', type: 'layout', duplicate: 'duplicate' },
  'layout-enduser-header': { name: 'End User Header', type: 'layout', duplicate: 'duplicate' },
  'layout-sidebar': { name: 'Sidebar Component', type: 'layout', duplicate: 'duplicate' },
  'layout-dynamic-sidebar': { name: 'Dynamic Sidebar', type: 'layout', duplicate: 'duplicate' },
  'calendar-view': { name: 'Calendar View', type: 'calendar', duplicate: 'duplicate' },
  'calendar-enhanced': { name: 'Enhanced Calendar', type: 'calendar', duplicate: 'duplicate' },
  'booking-n9iz-v1': { name: 'Booking Form V1', type: 'component', duplicate: 'duplicate' },
  'booking-n9iz-mobile': { name: 'Booking Form Mobile', type: 'component', duplicate: 'duplicate' },
  'catalogue-view2': { name: 'Catalogue View 2', type: 'component', duplicate: 'duplicate' },
  'catalogue-view3': { name: 'Catalogue View 3', type: 'component', duplicate: 'duplicate' },
  'dashboard-synced-header': { name: 'Synced Header', type: 'dashboard', duplicate: 'duplicate' },
};

const ComponentPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const componentInfo = COMPONENT_INFO[id as keyof typeof COMPONENT_INFO];
  const PreviewComponent = COMPONENT_PREVIEWS[id as keyof typeof COMPONENT_PREVIEWS] || COMPONENT_PREVIEWS.default;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'layout': return LayoutIcon;
      case 'dashboard': return BarChart3;
      case 'calendar': return Calendar;
      default: return Component;
    }
  };

  if (!componentInfo) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Component Not Found</h1>
        <Button onClick={() => navigate('/cleanup')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cleanup Center
        </Button>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(componentInfo.type);

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/cleanup')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cleanup Center
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TypeIcon className="h-6 w-6" />
                {componentInfo.name}
              </h1>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{componentInfo.type}</Badge>
                <Badge variant={componentInfo.duplicate === 'duplicate' ? 'destructive' : 'secondary'}>
                  {componentInfo.duplicate}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Code className="h-4 w-4 mr-2" />
              View Code
            </Button>
            <Button variant="outline">
              <GitMerge className="h-4 w-4 mr-2" />
              Merge
            </Button>
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" />
              Apply RBAC
            </Button>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <PreviewComponent />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Keep This Component
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Mark this component as the primary version and archive others.
              </p>
              <Button className="w-full">
                Keep & Archive Others
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GitMerge className="h-5 w-5" />
                Merge Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Combine the best features from similar components.
              </p>
              <Button variant="outline" className="w-full">
                Start Merge Process
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Apply RBAC
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure role-based access control for this component.
              </p>
              <Button variant="secondary" className="w-full">
                Configure RBAC
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default ComponentPreview;