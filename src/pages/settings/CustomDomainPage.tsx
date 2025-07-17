
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Globe, CheckCircle, AlertCircle, Upload, Settings, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomDomain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  sslStatus: 'pending' | 'active' | 'failed';
  dnsRecords: DNSRecord[];
  createdAt: string;
  verifiedAt?: string;
}

interface DNSRecord {
  type: 'CNAME' | 'A' | 'TXT';
  name: string;
  value: string;
  status: 'pending' | 'verified' | 'failed';
}

interface BrandingSettings {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  customCSS: string;
  hideJusBookBranding: boolean;
  customEmailSender: {
    name: string;
    email: string;
  };
}

const CustomDomainPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [domains, setDomains] = useState<CustomDomain[]>([
    {
      id: '1',
      domain: 'booking.mycompany.com',
      status: 'verified',
      sslStatus: 'active',
      dnsRecords: [
        {
          type: 'CNAME',
          name: 'booking',
          value: 'custom.jusbook.com',
          status: 'verified'
        },
        {
          type: 'TXT',
          name: '_jusbook-verification',
          value: 'jb-verify-abc123def456',
          status: 'verified'
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      verifiedAt: '2024-01-01T12:00:00Z'
    }
  ]);

  const [brandingSettings, setBrandingSettings] = useState<BrandingSettings>({
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter',
    customCSS: '',
    hideJusBookBranding: false,
    customEmailSender: {
      name: 'Your Company',
      email: 'noreply@mycompany.com'
    }
  });

  const [newDomain, setNewDomain] = useState('');

  const handleAddDomain = () => {
    if (!newDomain) return;

    const domain: CustomDomain = {
      id: Date.now().toString(),
      domain: newDomain,
      status: 'pending',
      sslStatus: 'pending',
      dnsRecords: [
        {
          type: 'CNAME',
          name: newDomain.split('.')[0],
          value: 'custom.jusbook.com',
          status: 'pending'
        },
        {
          type: 'TXT',
          name: '_jusbook-verification',
          value: `jb-verify-${Math.random().toString(36).substring(2, 18)}`,
          status: 'pending'
        }
      ],
      createdAt: new Date().toISOString()
    };

    setDomains(prev => [...prev, domain]);
    setNewDomain('');
    toast({
      title: "Domain Added",
      description: "Please configure the DNS records to verify your domain.",
    });
  };

  const handleVerifyDomain = (domainId: string) => {
    setDomains(prev => prev.map(domain => 
      domain.id === domainId 
        ? { 
            ...domain, 
            status: 'verified', 
            sslStatus: 'active',
            verifiedAt: new Date().toISOString(),
            dnsRecords: domain.dnsRecords.map(record => ({ ...record, status: 'verified' }))
          }
        : domain
    ));
    toast({
      title: "Domain Verified",
      description: "Your custom domain is now active with SSL certificate.",
    });
  };

  const handleSaveBranding = () => {
    toast({
      title: "Branding Settings Saved",
      description: "Your white-label configuration has been updated.",
    });
  };

  const handleFileUpload = (type: 'logo' | 'favicon') => {
    // Simulate file upload
    const mockUrl = `https://cdn.mycompany.com/${type}-${Date.now()}.png`;
    setBrandingSettings(prev => ({
      ...prev,
      [`${type}Url`]: mockUrl
    }));
    toast({
      title: "File Uploaded",
      description: `${type} has been uploaded successfully.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            🌐 Custom Domain / Branding
          </h1>
          <p className="text-muted-foreground">Configure custom domain and white-label branding</p>
        </div>
      </div>

      {/* Upgrade Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Enterprise Plan Required</h3>
              <p className="text-sm text-yellow-700">
                Custom domain and white-label features are available with Enterprise plan. 
                <Button variant="link" className="p-0 h-auto text-yellow-700 underline ml-1">
                  Upgrade now
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList>
          <TabsTrigger value="domains">Custom Domains</TabsTrigger>
          <TabsTrigger value="branding">White-Label Branding</TabsTrigger>
          <TabsTrigger value="email">Email Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="domains">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Add Custom Domain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="booking.yourcompany.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddDomain} disabled={!newDomain}>
                    Add Domain
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add a custom domain to use your own branding for booking pages and emails.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {domains.map((domain) => (
                <Card key={domain.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{domain.domain}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              domain.status === 'verified' ? 'default' :
                              domain.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {domain.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                              {domain.status === 'failed' && <AlertCircle className="h-3 w-3 mr-1" />}
                              {domain.status}
                            </Badge>
                            <Badge variant="outline">
                              SSL: {domain.sslStatus}
                            </Badge>
                          </div>
                        </div>
                        {domain.status === 'pending' && (
                          <Button onClick={() => handleVerifyDomain(domain.id)}>
                            Verify Domain
                          </Button>
                        )}
                      </div>

                      {domain.status === 'pending' && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Please add the following DNS records to verify your domain:
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-3">
                        <h4 className="font-medium">DNS Configuration</h4>
                        <div className="space-y-2">
                          {domain.dnsRecords.map((record, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 p-3 bg-muted/30 rounded-lg text-sm">
                              <div>
                                <div className="font-medium">{record.type}</div>
                              </div>
                              <div>
                                <div className="font-mono">{record.name}</div>
                              </div>
                              <div>
                                <div className="font-mono break-all">{record.value}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  record.status === 'verified' ? 'default' :
                                  record.status === 'pending' ? 'secondary' : 'destructive'
                                } className="text-xs">
                                  {record.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(domain.createdAt).toLocaleDateString()}
                        {domain.verifiedAt && (
                          <> | Verified: {new Date(domain.verifiedAt).toLocaleDateString()}</>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Brand Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2 space-y-2">
                      {brandingSettings.logoUrl ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={brandingSettings.logoUrl} 
                            alt="Logo" 
                            className="h-8 w-auto"
                          />
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => handleFileUpload('logo')}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2">
                      {brandingSettings.faviconUrl ? (
                        <div className="flex items-center gap-2">
                          <img 
                            src={brandingSettings.faviconUrl} 
                            alt="Favicon" 
                            className="h-4 w-4"
                          />
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => handleFileUpload('favicon')}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Favicon
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={brandingSettings.primaryColor}
                        onChange={(e) => setBrandingSettings(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingSettings.primaryColor}
                        onChange={(e) => setBrandingSettings(prev => ({ 
                          ...prev, 
                          primaryColor: e.target.value 
                        }))}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={brandingSettings.secondaryColor}
                        onChange={(e) => setBrandingSettings(prev => ({ 
                          ...prev, 
                          secondaryColor: e.target.value 
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingSettings.secondaryColor}
                        onChange={(e) => setBrandingSettings(prev => ({ 
                          ...prev, 
                          secondaryColor: e.target.value 
                        }))}
                        placeholder="#1E40AF"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography & Custom CSS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={brandingSettings.fontFamily}
                    onChange={(e) => setBrandingSettings(prev => ({ 
                      ...prev, 
                      fontFamily: e.target.value 
                    }))}
                    placeholder="Inter, Arial, sans-serif"
                  />
                </div>
                <div>
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <textarea
                    id="customCSS"
                    value={brandingSettings.customCSS}
                    onChange={(e) => setBrandingSettings(prev => ({ 
                      ...prev, 
                      customCSS: e.target.value 
                    }))}
                    rows={6}
                    className="w-full p-3 border rounded-md font-mono text-sm"
                    placeholder="/* Your custom CSS here */"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveBranding} className="w-full">
              Save Branding Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Sender Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    value={brandingSettings.customEmailSender.name}
                    onChange={(e) => setBrandingSettings(prev => ({
                      ...prev,
                      customEmailSender: {
                        ...prev.customEmailSender,
                        name: e.target.value
                      }
                    }))}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={brandingSettings.customEmailSender.email}
                    onChange={(e) => setBrandingSettings(prev => ({
                      ...prev,
                      customEmailSender: {
                        ...prev.customEmailSender,
                        email: e.target.value
                      }
                    }))}
                    placeholder="noreply@yourcompany.com"
                  />
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  To use a custom email sender, you'll need to verify your domain with our email service provider. Contact support for assistance.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSaveBranding}>
                Save Email Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomDomainPage;
