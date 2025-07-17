
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building, Save, Edit3, Upload, MapPin, Globe, Phone, Mail } from 'lucide-react';

interface OrganizationData {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  settings: {
    timezone: string;
    businessHours: {
      start: string;
      end: string;
    };
    language: string;
    currency: string;
  };
  subscription: {
    plan: string;
    status: string;
    usersLimit: number;
    currentUsers: number;
  };
}

export const OrganizationProfile: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [organization, setOrganization] = useState<OrganizationData>({
    id: 'org-1',
    name: 'TechCorp Solutions',
    description: 'Leading technology consulting firm specializing in digital transformation and innovation.',
    industry: 'Technology',
    website: 'https://techcorp.com',
    email: 'info@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    settings: {
      timezone: 'America/Los_Angeles',
      businessHours: {
        start: '09:00',
        end: '17:00'
      },
      language: 'en-US',
      currency: 'USD'
    },
    subscription: {
      plan: 'Enterprise',
      status: 'active',
      usersLimit: 500,
      currentUsers: 248
    }
  });

  const handleSave = () => {
    console.log('Saving organization:', organization);
    setIsEditing(false);
    toast({
      title: "Organization Updated",
      description: "Organization profile has been successfully updated.",
    });
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setOrganization(prev => {
      const updated = { ...prev };
      let current = updated as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) current[keys[i]] = {};
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Organization Profile
          </h3>
          <p className="text-muted-foreground">Manage your organization's basic information and settings</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className="gap-2"
        >
          <Edit3 className="h-4 w-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Organization Name</label>
              <Input
                value={organization.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Select
                value={organization.industry}
                onValueChange={(value) => updateField('industry', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Website</label>
              <Input
                value={organization.website}
                onChange={(e) => updateField('website', e.target.value)}
                disabled={!isEditing}
                type="url"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={organization.email}
                onChange={(e) => updateField('email', e.target.value)}
                disabled={!isEditing}
                type="email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={organization.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={organization.description}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={!isEditing}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <Input
                value={organization.address.street}
                onChange={(e) => updateField('address.street', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={organization.address.city}
                onChange={(e) => updateField('address.city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State/Province</label>
              <Input
                value={organization.address.state}
                onChange={(e) => updateField('address.state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ZIP/Postal Code</label>
              <Input
                value={organization.address.zipCode}
                onChange={(e) => updateField('address.zipCode', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select
                value={organization.address.country}
                onValueChange={(value) => updateField('address.country', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Business Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={organization.settings.timezone}
                onValueChange={(value) => updateField('settings.timezone', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="Europe/London">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={organization.settings.language}
                onValueChange={(value) => updateField('settings.language', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                  <SelectItem value="fr-FR">Français</SelectItem>
                  <SelectItem value="de-DE">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Currency</label>
              <Select
                value={organization.settings.currency}
                onValueChange={(value) => updateField('settings.currency', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Hours</label>
              <div className="flex gap-2">
                <Input
                  type="time"
                  value={organization.settings.businessHours.start}
                  onChange={(e) => updateField('settings.businessHours.start', e.target.value)}
                  disabled={!isEditing}
                />
                <span className="self-center">to</span>
                <Input
                  type="time"
                  value={organization.settings.businessHours.end}
                  onChange={(e) => updateField('settings.businessHours.end', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Information */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Subscription Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Plan</label>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{organization.subscription.plan}</span>
                <Badge className="bg-green-100 text-green-800">
                  {organization.subscription.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Users</label>
              <div>
                <span className="font-semibold">
                  {organization.subscription.currentUsers} / {organization.subscription.usersLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(organization.subscription.currentUsers / organization.subscription.usersLimit) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
                <Button variant="outline" size="sm">
                  View Billing
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};
