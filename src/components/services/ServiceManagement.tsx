import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Settings, Users, Clock, DollarSign, Edit, Trash2, Copy, Power, PowerOff, Video, Phone, MapPin } from 'lucide-react';
import CreateServiceWorkflow, { CreateServiceFormValues } from '../manage-services/CreateServiceWorkflow';
import EditServiceModal from './EditServiceModal';
import ServiceTemplates from './ServiceTemplates';
import serviceApi, { Service } from '@/services/api/serviceApi';

const ServiceManagement = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [templateData, setTemplateData] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceApi.getUserServices();
      setServices(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (formData: CreateServiceFormValues) => {
    try {
      const newService: Omit<Service, 'id'> = {
        name: formData.serviceName,
        description: formData.description,
        duration_mins: parseInt(formData.duration),
        cost_factor: parseFloat(formData.price),
        is_active: true,
        serviceType: formData.serviceType,
        meetingType: formData.meetingType,
        createdAt: new Date().toISOString(),
        additionalSettings: formData.additionalSettings
      };

      await serviceApi.createService(newService);
      await loadServices();
      setShowCreateWorkflow(false);
      setTemplateData(null);
      
      toast({
        title: 'Success',
        description: 'Service created successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create service',
        variant: 'destructive'
      });
    }
  };

  const handleSelectTemplate = (template: any) => {
    setTemplateData(template);
    setShowCreateWorkflow(true);
  };

  const handleEditService = (service: Service) => {
    // Redirect to create service flow with pre-filled configuration
    setEditingService(service);
    setShowCreateWorkflow(true);
  };

  const handleSaveEditedService = async (updatedService: Service) => {
    try {
      await serviceApi.updateService(updatedService.id, updatedService);
      await loadServices();
      setShowEditModal(false);
      setEditingService(null);
      
      toast({
        title: 'Success',
        description: 'Service updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive'
      });
    }
  };

  const handleCloneService = async (service: Service) => {
    try {
      const clonedService: Omit<Service, 'id'> = {
        ...service,
        name: `${service.name} (Copy)`,
        createdAt: new Date().toISOString()
      };
      delete (clonedService as any).id;

      await serviceApi.createService(clonedService);
      await loadServices();
      
      toast({
        title: 'Success',
        description: 'Service cloned successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clone service',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await serviceApi.updateService(service.id, {
        is_active: !service.is_active
      });
      await loadServices();
      
      toast({
        title: 'Success',
        description: `Service ${service.is_active ? 'deactivated' : 'activated'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update service status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      await serviceApi.deleteService(serviceId);
      await loadServices();
      
      toast({
        title: 'Success',
        description: 'Service deleted successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeStyle = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30'
      : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700/30';
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'one-to-one': 
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'one-to-many': 
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30';
      case 'group': 
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30';
      default: 
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      case 'in-person': return MapPin;
      default: return Video;
    }
  };

  // Calculate KPIs only for active services
  const activeServices = services.filter(s => s.is_active);
  const totalActiveDuration = activeServices.reduce((sum, s) => sum + (s.duration_mins || 0), 0);
  const totalActiveRevenue = activeServices.reduce((sum, s) => sum + (s.cost_factor || 0), 0);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (service.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' ? service.is_active : !service.is_active);
    const matchesType = typeFilter === 'all' || service.serviceType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (showCreateWorkflow) {
    // Convert template or existing service to form values
    const getInitialValues = () => {
      if (templateData) {
        return {
          serviceName: templateData.name,
          description: templateData.description,
          serviceType: templateData.serviceType,
          meetingType: templateData.meetingType,
          duration: String(templateData.duration),
          price: String(templateData.price),
          meetingLink: '',
          additionalSettings: {
            bufferTime: '15',
            maxAdvanceBooking: '30',
            collectPayment: false,
            meetingTypesConfig: [{
              id: templateData.meetingType,
              enabled: true,
              price: String(templateData.price),
              meetingLink: '',
              meetingPasscode: '',
              location: '',
              phoneNumber: '',
              bridgeNumber: '',
              maxParticipants: String(templateData.maxParticipants),
              recordingEnabled: false,
              parkingAvailable: false,
              refreshments: ''
            }]
          }
        };
      }
      
      if (editingService) {
        return {
          serviceName: editingService.name,
          description: editingService.description || '',
          serviceType: editingService.serviceType as any,
          meetingType: editingService.meetingType || 'video',
          duration: String(editingService.duration_mins || 30),
          price: String(editingService.cost_factor || 0),
          meetingLink: '',
          additionalSettings: {
            bufferTime: '15',
            maxAdvanceBooking: '30',
            collectPayment: false,
            meetingTypesConfig: (editingService.additionalSettings?.meetingTypesConfig || []).map(mt => ({
              id: mt.id,
              enabled: mt.enabled,
              price: mt.price || '0',
              meetingLink: mt.meetingLink || '',
              meetingPasscode: '',
              location: mt.location || '',
              phoneNumber: mt.phoneNumber || '',
              bridgeNumber: '',
              maxParticipants: mt.maxParticipants || '1',
              recordingEnabled: false,
              parkingAvailable: mt.parkingAvailable || false,
              refreshments: ''
            }))
          }
        };
      }
      
      return undefined;
    };

    return (
      <CreateServiceWorkflow
        onComplete={editingService ? 
          (formData) => {
            // Update existing service
            const updatedService = {
              ...editingService,
              name: formData.serviceName,
              description: formData.description,
              duration_mins: parseInt(formData.duration),
              cost_factor: parseFloat(formData.price),
              serviceType: formData.serviceType,
              meetingType: formData.meetingType,
              additionalSettings: formData.additionalSettings
            };
            handleSaveEditedService(updatedService);
            setEditingService(null);
          } : 
          handleCreateService
        }
        onCancel={() => {
          setShowCreateWorkflow(false);
          setEditingService(null);
          setTemplateData(null);
        }}
        initialValues={getInitialValues()}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Services</h1>
          <p className="text-muted-foreground mt-1">Create and manage your service offerings</p>
        </div>
        <div className="flex gap-2">
          <ServiceTemplates onSelectTemplate={handleSelectTemplate} />
          <Button 
            onClick={() => setShowCreateWorkflow(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Cards - Only Active Services */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">{services.length}</div>
              <Settings className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">{activeServices.length}</div>
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">{totalActiveDuration} min</div>
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-foreground">${totalActiveRevenue}</div>
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input text-foreground border-border focus:ring-primary focus:border-primary"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-input text-foreground border-border focus:ring-primary focus:border-primary">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48 bg-input text-foreground border-border focus:ring-primary focus:border-primary">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-popover text-popover-foreground border-border">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="one-to-one">1-on-1</SelectItem>
            <SelectItem value="one-to-many">1-to-Many</SelectItem>
            <SelectItem value="group">Group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const meetingTypes = service.additionalSettings?.meetingTypesConfig?.filter(mt => mt.enabled) || [];
          
          return (
            <Card key={service.id} className="bg-card text-card-foreground border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg text-foreground">{service.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusBadgeStyle(service.is_active || false)}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {service.serviceType && (
                        <Badge className={getTypeBadgeStyle(service.serviceType)}>
                          {service.serviceType}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleActive(service)}
                      className={`text-muted-foreground hover:text-foreground hover:bg-accent ${
                        service.is_active ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title={service.is_active ? 'Deactivate service' : 'Activate service'}
                    >
                      {service.is_active ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCloneService(service)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent"
                      title="Clone service"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditService(service)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent"
                      title="Edit service"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteService(service.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      title="Delete service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{service.description || 'No description available'}</p>
                
                {/* Meeting Types Display */}
                {meetingTypes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Meeting Types:</h4>
                    <div className="space-y-2">
                      {meetingTypes.map((mt) => {
                        const IconComponent = getMeetingTypeIcon(mt.id);
                        return (
                          <div key={mt.id} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span className="capitalize">{mt.id.replace('-', ' ')}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${mt.price}</div>
                              <div className="text-xs text-muted-foreground">
                                {mt.maxParticipants} max
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground font-medium">{service.duration_mins || 0} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="text-foreground font-semibold">${service.cost_factor || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Primary Type:</span>
                    <span className="text-foreground font-medium">{service.meetingType || 'Not specified'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredServices.length === 0 && (
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or create a new service.
            </p>
            <div className="flex gap-2 justify-center">
              <ServiceTemplates onSelectTemplate={handleSelectTemplate} />
              <Button 
                onClick={() => setShowCreateWorkflow(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Service
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Modal */}
      <EditServiceModal
        service={editingService}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingService(null);
        }}
        onSave={handleSaveEditedService}
      />
    </div>
  );
};

export default ServiceManagement;
