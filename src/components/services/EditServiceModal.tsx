
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Service } from '@/services/api/serviceApi';
import { useToast } from '@/hooks/use-toast';

interface Props {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
}

const EditServiceModal: React.FC<Props> = ({ service, isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        duration_mins: service.duration_mins,
        cost_factor: service.cost_factor,
        serviceType: service.serviceType,
        meetingType: service.meetingType,
        is_active: service.is_active
      });
    }
  }, [service]);

  const handleSave = async () => {
    if (!service || !formData.name) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedService: Service = {
        ...service,
        ...formData,
        name: formData.name,
        description: formData.description || '',
        duration_mins: formData.duration_mins || 30,
        cost_factor: formData.cost_factor || 0,
        serviceType: formData.serviceType || 'one-to-one',
        meetingType: formData.meetingType || 'video',
        is_active: formData.is_active ?? true
      };

      onSave(updatedService);
      onClose();
      
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
    } finally {
      setIsSaving(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Service</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Service Name *</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter service name"
              className="bg-background dark:bg-gray-700"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter service description"
              className="bg-background dark:bg-gray-700"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Duration (minutes)</label>
              <Input
                type="number"
                value={formData.duration_mins || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_mins: parseInt(e.target.value) || 0 }))}
                placeholder="30"
                min="5"
                max="480"
                className="bg-background dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price ($)</label>
              <Input
                type="number"
                value={formData.cost_factor || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cost_factor: parseFloat(e.target.value) || 0 }))}
                placeholder="50"
                min="0"
                step="0.01"
                className="bg-background dark:bg-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Service Type</label>
              <Select 
                value={formData.serviceType || 'one-to-one'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceType: value as any }))}
              >
                <SelectTrigger className="bg-background dark:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one">1-on-1</SelectItem>
                  <SelectItem value="one-to-many">1-to-Many</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Type</label>
              <Select 
                value={formData.meetingType || 'video'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, meetingType: value }))}
              >
                <SelectTrigger className="bg-background dark:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-foreground">Service Status</label>
              <p className="text-xs text-muted-foreground">Enable or disable this service</p>
            </div>
            <Switch
              checked={formData.is_active ?? true}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceModal;
