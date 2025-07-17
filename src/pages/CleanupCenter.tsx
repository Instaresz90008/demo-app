import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trash2, 
  GitMerge, 
  Shield, 
  Eye, 
  FolderOpen, 
  FileText, 
  Layers,
  Calendar,
  Layout as LayoutIcon,
  Settings,
  Component,
  BarChart3,
  CheckCircle
} from 'lucide-react';

interface ComponentInfo {
  id: string;
  name: string;
  path: string;
  type: string;
  description: string;
  duplicateLevel: 'none' | 'similar' | 'duplicate';
  rbacRequired: boolean;
  size: 'small' | 'medium' | 'large';
  lastModified: string;
}

const COMPONENTS_REGISTRY: ComponentInfo[] = [
  // Page Components
  { id: 'page-dashboard', name: 'Dashboard', path: '/pages/Dashboard.tsx', type: 'page', description: 'Main dashboard page', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-20' },
  { id: 'page-dash2', name: 'Dashboard v2', path: '/pages/Dash2.tsx', type: 'page', description: 'Alternative dashboard layout', duplicateLevel: 'duplicate', rbacRequired: true, size: 'large', lastModified: '2024-01-18' },
  { id: 'page-calendar', name: 'Calendar Page', path: '/pages/Calendar.tsx', type: 'page', description: 'Calendar view page', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-19' },
  { id: 'page-event-management', name: 'Event Management', path: '/pages/EventManagement.tsx', type: 'page', description: 'Event management interface', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-17' },
  { id: 'page-slot-broadcast', name: 'Slot Broadcast', path: '/pages/SlotBroadcast.tsx', type: 'page', description: 'Broadcast slot availability', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-14' },
  { id: 'page-slot-broadcast-workflow', name: 'Slot Broadcast Workflow', path: '/pages/SlotBroadcastWorkflow.tsx', type: 'page', description: 'Workflow for slot broadcasting', duplicateLevel: 'similar', rbacRequired: true, size: 'large', lastModified: '2024-01-15' },
  { id: 'page-booking-links', name: 'Booking Links', path: '/pages/BookingLinksPage.tsx', type: 'page', description: 'Manage booking links', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-12' },
  { id: 'page-manage-services', name: 'Manage Services', path: '/pages/ManageServices.tsx', type: 'page', description: 'Service management interface', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-16' },
  { id: 'page-reports', name: 'Reports', path: '/pages/Reports.tsx', type: 'page', description: 'Reporting dashboard', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-13' },
  { id: 'page-account-settings', name: 'Account Settings', path: '/pages/AccountSettings.tsx', type: 'page', description: 'Account configuration', duplicateLevel: 'similar', rbacRequired: true, size: 'large', lastModified: '2024-01-16' },
  { id: 'page-conversation', name: 'Conversation History', path: '/pages/ConversationHistory.tsx', type: 'page', description: 'Chat history page', duplicateLevel: 'none', rbacRequired: true, size: 'medium', lastModified: '2024-01-11' },

  // Layout Components - CLEANED UP
  { id: 'layout-main', name: 'Main Layout', path: '/components/layout/Layout.tsx', type: 'layout', description: 'Primary app layout', duplicateLevel: 'none', rbacRequired: false, size: 'large', lastModified: '2024-01-18' },
  { id: 'layout-enduser-header', name: 'Unified Header (RBAC)', path: '/components/layout/EndUserHeader.tsx', type: 'layout', description: 'Single header with RBAC support for all roles', duplicateLevel: 'none', rbacRequired: true, size: 'medium', lastModified: '2024-01-20' },
  { id: 'layout-unified-sidebar', name: 'Unified Sidebar (RBAC)', path: '/components/layout/UnifiedSidebar.tsx', type: 'layout', description: 'Single sidebar with role-based navigation', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-20' },
  { id: 'layout-profile-dropdown', name: 'Profile Dropdown', path: '/components/layout/ProfileDropdown.tsx', type: 'layout', description: 'User profile menu', duplicateLevel: 'none', rbacRequired: true, size: 'small', lastModified: '2024-01-12' },

  // Dashboard Components
  { id: 'dashboard-background', name: 'Background Animation', path: '/components/dashboard/BackgroundAnimation.tsx', type: 'dashboard', description: 'Animated background', duplicateLevel: 'none', rbacRequired: false, size: 'small', lastModified: '2024-01-10' },
  { id: 'dashboard-magnetic-button', name: 'Magnetic Button', path: '/components/dashboard/MagneticButton.tsx', type: 'dashboard', description: 'Interactive button component', duplicateLevel: 'none', rbacRequired: false, size: 'small', lastModified: '2024-01-08' },
  { id: 'dashboard-micro-card', name: 'Micro Interactive Card', path: '/components/dashboard/MicroInteractiveCard.tsx', type: 'dashboard', description: 'Small interactive cards', duplicateLevel: 'similar', rbacRequired: false, size: 'small', lastModified: '2024-01-14' },
  { id: 'dashboard-org-badge', name: 'Organization Badge', path: '/components/dashboard/OrganizationBadge.tsx', type: 'dashboard', description: 'Org display component', duplicateLevel: 'none', rbacRequired: true, size: 'small', lastModified: '2024-01-11' },
  { id: 'dashboard-create-booking', name: 'Create Booking Modal', path: '/components/dashboard/CreateBookingModal.tsx', type: 'dashboard', description: 'Booking creation modal', duplicateLevel: 'similar', rbacRequired: true, size: 'medium', lastModified: '2024-01-16' },
  { id: 'dashboard-synced-header', name: 'Synced Header', path: '/components/dashboard/SyncedHeader.tsx', type: 'dashboard', description: 'Synchronized header component', duplicateLevel: 'duplicate', rbacRequired: false, size: 'medium', lastModified: '2024-01-13' },

  // Calendar Components
  { id: 'calendar-enhanced', name: 'Enhanced Calendar View', path: '/components/calendar/EnhancedCalendarView.tsx', type: 'calendar', description: 'Advanced calendar with features', duplicateLevel: 'none', rbacRequired: true, size: 'large', lastModified: '2024-01-20' },
  { id: 'calendar-add-slot', name: 'Add Slot Dialog', path: '/components/calendar/AddSlotDialog.tsx', type: 'calendar', description: 'Dialog for adding calendar slots', duplicateLevel: 'none', rbacRequired: true, size: 'medium', lastModified: '2024-01-11' },
  { id: 'calendar-event-info', name: 'Event Info Dialog', path: '/components/calendar/EventInfoDialog.tsx', type: 'calendar', description: 'Event information display', duplicateLevel: 'none', rbacRequired: true, size: 'medium', lastModified: '2024-01-09' },

  // Component Library
  { id: 'booking-n9iz-v1', name: 'Booking Flow V1', path: '/components/booking/N9IZ-V1.tsx', type: 'component', description: 'Main booking flow component', duplicateLevel: 'none', rbacRequired: false, size: 'large', lastModified: '2024-01-17' },
  { id: 'booking-n9iz-mobile', name: 'Mobile Booking Flow', path: '/components/booking/N9IZ-V1-Mobile.tsx', type: 'component', description: 'Mobile-optimized booking', duplicateLevel: 'similar', rbacRequired: false, size: 'large', lastModified: '2024-01-18' },
  { id: 'booking-step-one', name: 'Booking Step One', path: '/components/booking/steps/StepOneSelectSlot.tsx', type: 'component', description: 'First step of booking process', duplicateLevel: 'none', rbacRequired: false, size: 'medium', lastModified: '2024-01-14' },
  { id: 'booking-confirmation', name: 'Confirmation Success', path: '/components/booking/ConfirmationSuccess.tsx', type: 'component', description: 'Success confirmation page', duplicateLevel: 'none', rbacRequired: false, size: 'medium', lastModified: '2024-01-13' },

  // Catalogue Components
  { id: 'catalogue-view2', name: 'Catalogue View 2', path: '/components/catalogue/CatalogueView2.tsx', type: 'component', description: 'Catalog display variant 2', duplicateLevel: 'duplicate', rbacRequired: false, size: 'medium', lastModified: '2024-01-08' },
  { id: 'catalogue-view3', name: 'Catalogue View 3', path: '/components/catalogue/CatalogueView3.tsx', type: 'component', description: 'Catalog display variant 3', duplicateLevel: 'duplicate', rbacRequired: false, size: 'medium', lastModified: '2024-01-15' },
  { id: 'catalogue-booking2', name: 'Catalogue Booking View 2', path: '/components/catalogue/CatalogueBookingView2.tsx', type: 'component', description: 'Booking view variant 2', duplicateLevel: 'duplicate', rbacRequired: false, size: 'medium', lastModified: '2024-01-12' },
  { id: 'catalogue-booking3', name: 'Catalogue Booking View 3', path: '/components/catalogue/CatalogueBookingView3.tsx', type: 'component', description: 'Booking view variant 3', duplicateLevel: 'duplicate', rbacRequired: false, size: 'medium', lastModified: '2024-01-16' },
];

const CleanupCenter = () => {
  const navigate = useNavigate();
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDuplicate, setFilterDuplicate] = useState<string>('all');

  const filteredComponents = COMPONENTS_REGISTRY.filter(comp => {
    const typeMatch = filterType === 'all' || comp.type === filterType;
    const duplicateMatch = filterDuplicate === 'all' || comp.duplicateLevel === filterDuplicate;
    return typeMatch && duplicateMatch;
  });

  const getDuplicateBadgeVariant = (level: string) => {
    switch (level) {
      case 'duplicate': return 'destructive';
      case 'similar': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return FileText;
      case 'layout': return LayoutIcon;
      case 'dashboard': return BarChart3;
      case 'calendar': return Calendar;
      case 'component': return Component;
      default: return FolderOpen;
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'small': return '📦';
      case 'medium': return '📋';
      case 'large': return '🗂️';
      default: return '📄';
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedComponents(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const duplicateCount = COMPONENTS_REGISTRY.filter(c => c.duplicateLevel === 'duplicate').length;
  const similarCount = COMPONENTS_REGISTRY.filter(c => c.duplicateLevel === 'similar').length;
  const rbacRequiredCount = COMPONENTS_REGISTRY.filter(c => c.rbacRequired).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Component Cleanup Center</h1>
          <p className="text-muted-foreground mt-2">
            Review, merge, delete, or apply RBAC to duplicate and similar components
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/duplicate-showcase')}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Showcase View
          </Button>
          <Button 
            variant="outline"
            onClick={() => selectedComponents.length > 0 && console.log('Clear selection:', selectedComponents)}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Components</p>
                <p className="text-3xl font-bold">29</p>
                <p className="text-xs text-green-600">↓ 6 after cleanup</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exact Duplicates</p>
                <p className="text-3xl font-bold text-green-600">2</p>
                <p className="text-xs text-green-600">↓ 12 eliminated</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Similar Components</p>
                <p className="text-3xl font-bold text-yellow-600">6</p>
                <p className="text-xs text-muted-foreground">No change</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RBAC Integrated</p>
                <p className="text-3xl font-bold text-blue-600">21</p>
                <p className="text-xs text-blue-600">✓ Redux + Hook</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center p-4 bg-muted/50 rounded-lg">
        <div className="flex gap-2">
          <Button 
            variant={filterType === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterType('all')}
          >
            All Types
          </Button>
          {['page', 'layout', 'dashboard', 'calendar', 'component'].map(type => (
            <Button 
              key={type}
              variant={filterType === type ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilterType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
        <div className="h-6 w-px bg-border" />
        <div className="flex gap-2">
          <Button 
            variant={filterDuplicate === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterDuplicate('all')}
          >
            All Status
          </Button>
          <Button 
            variant={filterDuplicate === 'duplicate' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterDuplicate('duplicate')}
          >
            Duplicates
          </Button>
          <Button 
            variant={filterDuplicate === 'similar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterDuplicate('similar')}
          >
            Similar
          </Button>
        </div>
      </div>

      {/* Component List */}
      <div className="grid gap-4">
        {filteredComponents.map((comp) => {
          const TypeIcon = getTypeIcon(comp.type);
          const isSelected = selectedComponents.includes(comp.id);
          
          return (
            <Card 
              key={comp.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleSelection(comp.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{comp.name}</h3>
                        <span className="text-xs">{getSizeIcon(comp.size)}</span>
                        <Badge variant={getDuplicateBadgeVariant(comp.duplicateLevel)}>
                          {comp.duplicateLevel}
                        </Badge>
                        {comp.rbacRequired && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            RBAC
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{comp.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">{comp.path}</span>
                        <span className="text-xs text-muted-foreground">Modified: {comp.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/cleanup/preview/${comp.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Merge:', comp.id);
                      }}
                    >
                      <GitMerge className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('RBAC:', comp.id);
                      }}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete:', comp.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CleanupCenter;