
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User, Camera, Save, Edit3, Trash2, Plus, Clock, Building } from 'lucide-react';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  jobTitle: string;
  company: string;
  industry: string;
  location: string;
  website: string;
  timezone: string;
  avatar: string | null;
  skills: string[];
  workingHours: {
    start: string;
    end: string;
  };
  workingDays: string[];
  breakTime: {
    start: string;
    end: string;
  };
  privacySettings: {
    showProfile: boolean;
    showContact: boolean;
    showAvailability: boolean;
  };
}

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 
  'Retail', 'Consulting', 'Marketing', 'Real Estate', 'Legal', 'Media', 'Other'
];

const companies = [
  'TechCorp Solutions', 'InnovateTech', 'DataDrive Inc', 'CloudFirst', 
  'NextGen Systems', 'DigitalEdge', 'SmartSolutions', 'TechVision', 'Custom Company'
];

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Kolkata', label: 'India' }
];

export const ProfileManagement: React.FC = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('Technology');
  const [selectedCompany, setSelectedCompany] = useState('TechCorp Solutions');
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [profile, setProfile] = useState<ProfileData>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced software developer with a passion for creating innovative solutions.',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    timezone: 'UTC',
    avatar: null,
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS'],
    workingHours: { start: '09:00', end: '17:00' },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    breakTime: { start: '12:00', end: '13:00' },
    privacySettings: {
      showProfile: true,
      showContact: true,
      showAvailability: true
    }
  });

  // Sync state with profile data
  useEffect(() => {
    setSelectedIndustry(profile.industry);
    setSelectedCompany(profile.company);
    setSelectedTimezone(profile.timezone);
  }, [profile.industry, profile.company, profile.timezone]);

  const handleSave = () => {
    // Update profile with current state values
    const updatedProfile = {
      ...profile,
      industry: selectedIndustry,
      company: selectedCompany,
      timezone: selectedTimezone
    };
    setProfile(updatedProfile);
    console.log('Saving profile:', updatedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    const cleanValue = value.replace(/[^\d+]/g, '');
    
    // If it starts with +, keep the + and format the rest
    if (cleanValue.startsWith('+')) {
      const digits = cleanValue.slice(1);
      if (digits.length >= 10) {
        return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
      }
      return cleanValue;
    }
    
    // Format US numbers
    if (cleanValue.length >= 10) {
      return `+1 (${cleanValue.slice(0, 3)}) ${cleanValue.slice(3, 6)}-${cleanValue.slice(6, 10)}`;
    }
    
    return cleanValue;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow digits, +, spaces, parentheses, and dashes
    if (/^[\d+\s()-]*$/.test(value)) {
      setProfile(prev => ({ ...prev, phone: value }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      toast({
        title: "Skill Added",
        description: `"${newSkill.trim()}" has been added to your skills.`,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    toast({
      title: "Skill Removed",
      description: `"${skillToRemove}" has been removed from your skills.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h3>
          <p className="text-muted-foreground">Manage your personal profile details</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  onClick={() => {
                    toast({
                      title: "Upload Feature",
                      description: "Photo upload functionality would be implemented here.",
                    });
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-lg">
                {profile.firstName} {profile.lastName}
              </h4>
              <p className="text-muted-foreground">{profile.jobTitle}</p>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">First Name</Label>
                <Input
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Last Name</Label>
                <Input
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Phone</Label>
                <Input
                  value={profile.phone}
                  onChange={handlePhoneChange}
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Job Title</Label>
                <Input
                  value={profile.jobTitle}
                  onChange={(e) => setProfile(prev => ({ ...prev, jobTitle: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Company</Label>
                {isEditing ? (
                  <Select 
                    value={selectedCompany} 
                    onValueChange={(value) => {
                      setSelectedCompany(value);
                      if (value !== 'Custom Company') {
                        setProfile(prev => ({ ...prev, company: value }));
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {companies.map((company) => (
                        <SelectItem key={company} value={company} className="hover:bg-accent">
                          {company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={profile.company}
                    disabled={true}
                  />
                )}
                {isEditing && selectedCompany === 'Custom Company' && (
                  <Input
                    placeholder="Enter custom company name"
                    onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Industry</Label>
                {isEditing ? (
                  <Select 
                    value={selectedIndustry} 
                    onValueChange={setSelectedIndustry}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry} className="hover:bg-accent">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={profile.industry}
                    disabled={true}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Timezone</Label>
                {isEditing ? (
                  <Select 
                    value={selectedTimezone} 
                    onValueChange={setSelectedTimezone}
                  >
                    <SelectTrigger className="bg-background border-input">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value} className="hover:bg-accent">
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={timezones.find(tz => tz.value === profile.timezone)?.label || profile.timezone}
                    disabled={true}
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Website</Label>
                <Input
                  value={profile.website}
                  onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                  disabled={!isEditing}
                  type="url"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Availability & Schedule Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Availability & Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Working Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Start Time</Label>
              <Input
                type="time"
                value={profile.workingHours.start}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, start: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">End Time</Label>
              <Input
                type="time"
                value={profile.workingHours.end}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  workingHours: { ...prev.workingHours, end: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Working Days */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Working Days</Label>
            <div className="flex flex-wrap gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <Badge
                  key={day}
                  variant={profile.workingDays.includes(day) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    isEditing ? 'hover:bg-accent' : 'cursor-default'
                  }`}
                  onClick={() => {
                    if (!isEditing) return;
                    const newDays = profile.workingDays.includes(day)
                      ? profile.workingDays.filter(d => d !== day)
                      : [...profile.workingDays, day];
                    setProfile(prev => ({ ...prev, workingDays: newDays }));
                  }}
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>

          {/* Break Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Break Start</Label>
              <Input
                type="time"
                value={profile.breakTime.start}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  breakTime: { ...prev.breakTime, start: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Break End</Label>
              <Input
                type="time"
                value={profile.breakTime.end}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  breakTime: { ...prev.breakTime, end: e.target.value }
                }))}
                disabled={!isEditing}
              />
            </div>
          </div>

          {/* Privacy Settings */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-medium">Privacy Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show Profile Publicly</p>
                  <p className="text-xs text-muted-foreground">Allow others to see your profile</p>
                </div>
                <Switch
                  checked={profile.privacySettings.showProfile}
                  onCheckedChange={(checked) => 
                    setProfile(prev => ({
                      ...prev,
                      privacySettings: { ...prev.privacySettings, showProfile: checked }
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show Contact Information</p>
                  <p className="text-xs text-muted-foreground">Display email and phone</p>
                </div>
                <Switch
                  checked={profile.privacySettings.showContact}
                  onCheckedChange={(checked) => 
                    setProfile(prev => ({
                      ...prev,
                      privacySettings: { ...prev.privacySettings, showContact: checked }
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Show Availability</p>
                  <p className="text-xs text-muted-foreground">Display working hours</p>
                </div>
                <Switch
                  checked={profile.privacySettings.showAvailability}
                  onCheckedChange={(checked) => 
                    setProfile(prev => ({
                      ...prev,
                      privacySettings: { ...prev.privacySettings, showAvailability: checked }
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Skills & Expertise</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                {skill}
                {isEditing && (
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
          {isEditing && (
            <div className="flex gap-2">
              <Input
                placeholder="Add a new skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              />
              <Button onClick={handleAddSkill} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          )}
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
