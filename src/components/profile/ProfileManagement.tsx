import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Clock,
  Camera,
  Save,
  Loader2,
  Upload,
  ExternalLink
} from 'lucide-react';
import profileApi, { ProfileData } from '@/services/api/profileApi';

const ProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProfileData>();

  const watchedValues = watch();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await profileApi.getProfile();
      setProfile(profileData);
      
      // Set form values
      Object.entries(profileData).forEach(([key, value]) => {
        setValue(key as keyof ProfileData, value);
      });
    } catch (error: any) {
      if (error.message.includes('404')) {
        // Profile doesn't exist, create default
        const defaultProfile: Partial<ProfileData> = {
          firstName: '',
          lastName: '',
          workingHours: { start: '09:00', end: '17:00' },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          breakTime: { start: '12:00', end: '13:00' },
          privacySettings: {
            showProfile: true,
            showContact: true,
            showAvailability: true
          }
        };
        setProfile(defaultProfile as ProfileData);
        Object.entries(defaultProfile).forEach(([key, value]) => {
          setValue(key as keyof ProfileData, value);
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    try {
      setSaving(true);
      
      let updatedProfile;
      if (profile?.id) {
        updatedProfile = await profileApi.updateProfile(data);
        toast({
          title: 'Success',
          description: 'Profile updated successfully'
        });
      } else {
        updatedProfile = await profileApi.createProfile(data);
        toast({
          title: 'Success',
          description: 'Profile created successfully'
        });
      }
      
      setProfile(updatedProfile);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const result = await profileApi.uploadAvatar(file);
      setValue('avatar', result.avatarUrl);
      
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={watchedValues.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials(watchedValues.firstName, watchedValues.lastName)}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium">
                  {watchedValues.firstName} {watchedValues.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {watchedValues.jobTitle} {watchedValues.company && `at ${watchedValues.company}`}
                </p>
                <Button variant="outline" size="sm" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Change Photo'}
                </Button>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  {...register('jobTitle')}
                  placeholder="Senior Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  {...register('industry')}
                  placeholder="Technology"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="San Francisco, CA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  {...register('timezone')}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Asia/Kolkata">India</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                rows={4}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  placeholder="https://your-website.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  {...register('linkedinUrl')}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Working Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingHours.start">Start Time</Label>
                <Input
                  id="workingHours.start"
                  type="time"
                  {...register('workingHours.start')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="workingHours.end">End Time</Label>
                <Input
                  id="workingHours.end"
                  type="time"
                  {...register('workingHours.end')}
                />
              </div>
            </div>

            {/* Working Days */}
            <div className="space-y-3">
              <Label>Working Days</Label>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <Badge
                    key={day}
                    variant={watchedValues.workingDays?.includes(day) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentDays = watchedValues.workingDays || [];
                      const newDays = currentDays.includes(day)
                        ? currentDays.filter(d => d !== day)
                        : [...currentDays, day];
                      setValue('workingDays', newDays);
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
                <Label htmlFor="breakTime.start">Break Start</Label>
                <Input
                  id="breakTime.start"
                  type="time"
                  {...register('breakTime.start')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breakTime.end">Break End</Label>
                <Input
                  id="breakTime.end"
                  type="time"
                  {...register('breakTime.end')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Profile Publicly</h4>
                <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
              </div>
              <Switch
                checked={watchedValues.privacySettings?.showProfile}
                onCheckedChange={(checked) => 
                  setValue('privacySettings.showProfile', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Contact Information</h4>
                <p className="text-sm text-muted-foreground">Display email and phone number on profile</p>
              </div>
              <Switch
                checked={watchedValues.privacySettings?.showContact}
                onCheckedChange={(checked) => 
                  setValue('privacySettings.showContact', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Show Availability</h4>
                <p className="text-sm text-muted-foreground">Display working hours and availability</p>
              </div>
              <Switch
                checked={watchedValues.privacySettings?.showAvailability}
                onCheckedChange={(checked) => 
                  setValue('privacySettings.showAvailability', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="min-w-32">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManagement;