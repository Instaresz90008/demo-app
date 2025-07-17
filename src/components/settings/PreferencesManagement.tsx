import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Palette, 
  Globe, 
  Clock,
  Monitor,
  Sun,
  Moon,
  Save,
  Loader2,
  Download,
  Upload
} from 'lucide-react';
import settingsApi, { UserSettings } from '@/services/api/settingsApi';

const PreferencesManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Partial<UserSettings>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const userSettings = await settingsApi.getSettings();
      setSettings(userSettings);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load preferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // Update specific section based on key
      if (['theme', 'language', 'timezone'].includes(key)) {
        await settingsApi.updateSettings(newSettings as UserSettings);
      }
      
      toast({
        title: 'Success',
        description: 'Preference updated successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update preference',
        variant: 'destructive'
      });
    }
  };

  const exportSettings = async () => {
    try {
      const blob = await settingsApi.exportSettings();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Success',
        description: 'Settings exported successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to export settings',
        variant: 'destructive'
      });
    }
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (importedData.settings) {
          await settingsApi.importSettings(importedData.settings);
          setSettings(importedData.settings);
          
          toast({
            title: 'Success',
            description: 'Settings imported successfully'
          });
        } else {
          throw new Error('Invalid settings file format');
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to import settings. Please check the file format.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
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
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'dark', 'system'].map(theme => (
                <button
                  key={theme}
                  onClick={() => updateSetting('theme', theme)}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors
                    ${settings.theme === theme 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }`}
                >
                  {theme === 'light' && <Sun className="h-6 w-6" />}
                  {theme === 'dark' && <Moon className="h-6 w-6" />}
                  {theme === 'system' && <Monitor className="h-6 w-6" />}
                  <span className="text-sm font-medium capitalize">{theme}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language & Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Language & Region
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select 
                value={settings.language || 'en'} 
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="it">Italiano</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.timezone || 'UTC'} 
                onValueChange={(value) => updateSetting('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Asia/Kolkata">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Calendar Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default View</Label>
              <Select 
                value={settings.calendar?.defaultView || 'week'} 
                onValueChange={(value) => updateSetting('calendar', { ...settings.calendar, defaultView: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day View</SelectItem>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select 
                value={settings.calendar?.timeFormat || '12h'} 
                onValueChange={(value) => updateSetting('calendar', { ...settings.calendar, timeFormat: value })}
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

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={settings.calendar?.startTime || '09:00'}
                onChange={(e) => updateSetting('calendar', { ...settings.calendar, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={settings.calendar?.endTime || '17:00'}
                onChange={(e) => updateSetting('calendar', { ...settings.calendar, endTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>First Day of Week</Label>
              <Select 
                value={String(settings.calendar?.firstDayOfWeek || 1)} 
                onValueChange={(value) => updateSetting('calendar', { ...settings.calendar, firstDayOfWeek: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={exportSettings} variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>
            
            <div className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
                id="import-settings"
              />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('import-settings')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Settings
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Export your settings as a backup or import previously saved settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesManagement;