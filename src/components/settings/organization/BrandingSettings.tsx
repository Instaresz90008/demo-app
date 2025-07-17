
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Palette, Upload, Save, Eye, Download } from 'lucide-react';

interface BrandingSettings {
  logo: {
    url: string | null;
    darkUrl: string | null;
    faviconUrl: string | null;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    headingFont: string;
  };
  customization: {
    welcomeMessage: string;
    footerText: string;
    customCSS: string;
    showPoweredBy: boolean;
  };
  email: {
    headerLogo: string | null;
    headerColor: string;
    buttonColor: string;
    footerText: string;
  };
}

export const BrandingSettings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<BrandingSettings>({
    logo: {
      url: null,
      darkUrl: null,
      faviconUrl: null
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      text: '#1f2937'
    },
    typography: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      headingFont: 'Inter'
    },
    customization: {
      welcomeMessage: 'Welcome to TechCorp Solutions',
      footerText: '© 2024 TechCorp Solutions. All rights reserved.',
      customCSS: '',
      showPoweredBy: true
    },
    email: {
      headerLogo: null,
      headerColor: '#3b82f6',
      buttonColor: '#3b82f6',
      footerText: 'This email was sent by TechCorp Solutions'
    }
  });

  const handleSave = () => {
    console.log('Saving branding settings:', settings);
    toast({
      title: "Branding Updated",
      description: "Branding settings have been successfully updated.",
    });
  };

  const updateColors = (key: keyof typeof settings.colors, value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: { ...prev.colors, [key]: value }
    }));
  };

  const updateTypography = (key: keyof typeof settings.typography, value: string) => {
    setSettings(prev => ({
      ...prev,
      typography: { ...prev.typography, [key]: value }
    }));
  };

  const updateCustomization = (key: keyof typeof settings.customization, value: any) => {
    setSettings(prev => ({
      ...prev,
      customization: { ...prev.customization, [key]: value }
    }));
  };

  const updateEmail = (key: keyof typeof settings.email, value: any) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value }
    }));
  };

  const handleFileUpload = (type: 'logo' | 'darkLogo' | 'favicon' | 'emailLogo') => {
    // Simulate file upload
    toast({
      title: "File Upload",
      description: "File upload functionality would be implemented here.",
    });
  };

  const downloadBrandKit = () => {
    toast({
      title: "Brand Kit Download",
      description: "Downloading brand kit with logos and color palette...",
    });
  };

  const previewChanges = () => {
    toast({
      title: "Preview Mode",
      description: "Preview functionality would be implemented here.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Branding Settings
          </h3>
          <p className="text-muted-foreground">Customize your organization's visual identity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewChanges} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Logo Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Logo & Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Main Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {settings.logo.url ? (
                  <div className="space-y-2">
                    <div className="w-20 h-20 bg-gray-100 mx-auto rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">Logo</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload('logo')}>
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Upload main logo</p>
                    <Button size="sm" onClick={() => handleFileUpload('logo')}>
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Dark Mode Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {settings.logo.darkUrl ? (
                  <div className="space-y-2">
                    <div className="w-20 h-20 bg-gray-800 mx-auto rounded flex items-center justify-center">
                      <span className="text-sm text-white">Logo</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload('darkLogo')}>
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Upload dark logo</p>
                    <Button size="sm" onClick={() => handleFileUpload('darkLogo')}>
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Favicon</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {settings.logo.faviconUrl ? (
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-gray-100 mx-auto rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">ICO</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFileUpload('favicon')}>
                      Replace
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Upload favicon</p>
                    <Button size="sm" onClick={() => handleFileUpload('favicon')}>
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={downloadBrandKit} className="gap-2">
              <Download className="h-4 w-4" />
              Download Brand Kit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Primary Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.colors.primary }}
                ></div>
                <Input
                  type="color"
                  value={settings.colors.primary}
                  onChange={(e) => updateColors('primary', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secondary Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.colors.secondary }}
                ></div>
                <Input
                  type="color"
                  value={settings.colors.secondary}
                  onChange={(e) => updateColors('secondary', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Accent Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.colors.accent }}
                ></div>
                <Input
                  type="color"
                  value={settings.colors.accent}
                  onChange={(e) => updateColors('accent', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Background</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.colors.background }}
                ></div>
                <Input
                  type="color"
                  value={settings.colors.background}
                  onChange={(e) => updateColors('background', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Text Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.colors.text }}
                ></div>
                <Input
                  type="color"
                  value={settings.colors.text}
                  onChange={(e) => updateColors('text', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Body Font</label>
              <Select
                value={settings.typography.fontFamily}
                onValueChange={(value) => updateTypography('fontFamily', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Heading Font</label>
              <Select
                value={settings.typography.headingFont}
                onValueChange={(value) => updateTypography('headingFont', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Oswald">Oswald</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <Select
                value={settings.typography.fontSize}
                onValueChange={(value) => updateTypography('fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Welcome Message</label>
              <Input
                value={settings.customization.welcomeMessage}
                onChange={(e) => updateCustomization('welcomeMessage', e.target.value)}
                placeholder="Welcome to your organization"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Footer Text</label>
              <Input
                value={settings.customization.footerText}
                onChange={(e) => updateCustomization('footerText', e.target.value)}
                placeholder="© 2024 Your Organization"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Custom CSS</label>
            <Textarea
              value={settings.customization.customCSS}
              onChange={(e) => updateCustomization('customCSS', e.target.value)}
              placeholder="/* Add your custom CSS here */"
              rows={6}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Show "Powered by" Branding</h4>
              <p className="text-sm text-muted-foreground">Display attribution in footer</p>
            </div>
            <Switch
              checked={settings.customization.showPoweredBy}
              onCheckedChange={(value) => updateCustomization('showPoweredBy', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Branding */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Email Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">Email Header Logo</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center max-w-md">
              {settings.email.headerLogo ? (
                <div className="space-y-2">
                  <div className="w-32 h-12 bg-gray-100 mx-auto rounded flex items-center justify-center">
                    <span className="text-sm text-gray-500">Email Logo</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleFileUpload('emailLogo')}>
                    Replace
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500">Upload email header logo</p>
                  <Button size="sm" onClick={() => handleFileUpload('emailLogo')}>
                    Upload
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Header Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.email.headerColor }}
                ></div>
                <Input
                  type="color"
                  value={settings.email.headerColor}
                  onChange={(e) => updateEmail('headerColor', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Button Color</label>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: settings.email.buttonColor }}
                ></div>
                <Input
                  type="color"
                  value={settings.email.buttonColor}
                  onChange={(e) => updateEmail('buttonColor', e.target.value)}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Footer Text</label>
            <Input
              value={settings.email.footerText}
              onChange={(e) => updateEmail('footerText', e.target.value)}
              placeholder="This email was sent by Your Organization"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
