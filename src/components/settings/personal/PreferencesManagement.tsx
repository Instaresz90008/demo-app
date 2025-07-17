
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Palette, Globe, Clock, Volume2, Eye, Save } from 'lucide-react';

interface UserPreferences {
  appearance: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
    animations: boolean;
    fontSize: number;
  };
  localization: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
  };
  privacy: {
    analytics: boolean;
    marketing: boolean;
    profileVisibility: 'public' | 'private' | 'contacts';
    activityStatus: boolean;
  };
}

export const PreferencesManagement: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>({
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true,
      fontSize: 16
    },
    localization: {
      language: 'en-US',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    },
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      screenReader: false,
      keyboardNavigation: true
    },
    privacy: {
      analytics: true,
      marketing: false,
      profileVisibility: 'public',
      activityStatus: true
    }
  });

  const handleSave = () => {
    console.log('Saving preferences:', preferences);
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const updateAppearance = (key: keyof typeof preferences.appearance, value: any) => {
    setPreferences(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
  };

  const updateLocalization = (key: keyof typeof preferences.localization, value: any) => {
    setPreferences(prev => ({
      ...prev,
      localization: { ...prev.localization, [key]: value }
    }));
  };

  const updateAccessibility = (key: keyof typeof preferences.accessibility, value: any) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, [key]: value }
    }));
  };

  const updatePrivacy = (key: keyof typeof preferences.privacy, value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Preferences
          </h3>
          <p className="text-muted-foreground">Customize your experience and accessibility settings</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Save Preferences
        </Button>
      </div>

      {/* Appearance */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={preferences.appearance.theme}
                onValueChange={(value: any) => updateAppearance('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <div className="px-3">
                <Slider
                  value={[preferences.appearance.fontSize]}
                  onValueChange={([value]) => updateAppearance('fontSize', value)}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>12px</span>
                  <span>{preferences.appearance.fontSize}px</span>
                  <span>24px</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Compact Mode</h4>
                <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
              </div>
              <Switch
                checked={preferences.appearance.compactMode}
                onCheckedChange={(value) => updateAppearance('compactMode', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Animations</h4>
                <p className="text-sm text-muted-foreground">Enable interface animations</p>
              </div>
              <Switch
                checked={preferences.appearance.animations}
                onCheckedChange={(value) => updateAppearance('animations', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localization */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Localization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={preferences.localization.language}
                onValueChange={(value) => updateLocalization('language', value)}
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
              <label className="text-sm font-medium">Timezone</label>
              <Select
                value={preferences.localization.timezone}
                onValueChange={(value) => updateLocalization('timezone', value)}
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
              <label className="text-sm font-medium">Date Format</label>
              <Select
                value={preferences.localization.dateFormat}
                onValueChange={(value) => updateLocalization('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Format</label>
              <Select
                value={preferences.localization.timeFormat}
                onValueChange={(value: any) => updateLocalization('timeFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Reduced Motion</h4>
                <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch
                checked={preferences.accessibility.reducedMotion}
                onCheckedChange={(value) => updateAccessibility('reducedMotion', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">High Contrast</h4>
                <p className="text-sm text-muted-foreground">Increase color contrast for better visibility</p>
              </div>
              <Switch
                checked={preferences.accessibility.highContrast}
                onCheckedChange={(value) => updateAccessibility('highContrast', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Screen Reader Support</h4>
                <p className="text-sm text-muted-foreground">Enhanced support for screen readers</p>
              </div>
              <Switch
                checked={preferences.accessibility.screenReader}
                onCheckedChange={(value) => updateAccessibility('screenReader', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Keyboard Navigation</h4>
                <p className="text-sm text-muted-foreground">Enable enhanced keyboard navigation</p>
              </div>
              <Switch
                checked={preferences.accessibility.keyboardNavigation}
                onCheckedChange={(value) => updateAccessibility('keyboardNavigation', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Analytics</h4>
                <p className="text-sm text-muted-foreground">Help improve the product with usage analytics</p>
              </div>
              <Switch
                checked={preferences.privacy.analytics}
                onCheckedChange={(value) => updatePrivacy('analytics', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Marketing Communications</h4>
                <p className="text-sm text-muted-foreground">Receive product updates and offers</p>
              </div>
              <Switch
                checked={preferences.privacy.marketing}
                onCheckedChange={(value) => updatePrivacy('marketing', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Activity Status</h4>
                <p className="text-sm text-muted-foreground">Show when you're online to other users</p>
              </div>
              <Switch
                checked={preferences.privacy.activityStatus}
                onCheckedChange={(value) => updatePrivacy('activityStatus', value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Visibility</label>
              <Select
                value={preferences.privacy.profileVisibility}
                onValueChange={(value: any) => updatePrivacy('profileVisibility', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="contacts">Contacts Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
