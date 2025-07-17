
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Users, Mail, FileText, Share, Sparkles, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const ImportContactsPage = () => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "✨ File Uploaded Successfully",
        description: `Imported contacts from ${file.name}`,
      });
    }
  };

  const handleManualAdd = () => {
    toast({
      title: "🎉 Contacts Added",
      description: "Manual contacts have been added successfully.",
    });
  };

  const handleSendLinks = () => {
    toast({
      title: "📧 Links Sent",
      description: `Private booking links sent to ${selectedContacts.length} contacts.`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100">
              <Share className="h-8 w-8 text-purple-600" />
            </div>
            Import & Share Private Links
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Import contacts and send them personalized private booking links
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1">
          <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Upload File</TabsTrigger>
          <TabsTrigger value="manual" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Manual Entry</TabsTrigger>
          <TabsTrigger value="share" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Share Links</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6 mt-6">
          <Card className="border-dashed border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-blue-100">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>
                Upload Contact File
              </CardTitle>
              <CardDescription className="text-gray-600">
                Upload CSV, Excel, or VCard files with contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">Select File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.xlsx,.vcf"
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800 font-medium">
                    Supported formats: CSV, Excel (.xlsx), VCard (.vcf)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-green-100">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                Manual Entry
              </CardTitle>
              <CardDescription className="text-gray-600">
                Add contacts manually by entering email addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="emails" className="text-sm font-medium text-gray-700">Email Addresses</Label>
                  <Textarea
                    id="emails"
                    placeholder="Enter email addresses separated by commas or line breaks&#10;example@domain.com, another@domain.com"
                    rows={6}
                    className="mt-2 resize-none"
                  />
                </div>
                <Button onClick={handleManualAdd} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contacts
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-xl bg-purple-100">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                Share Private Links
              </CardTitle>
              <CardDescription className="text-gray-600">
                Send personalized booking links to your contacts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Message Template</Label>
                  <Textarea
                    placeholder="Hi [Name], I'd like to share my booking link with you: [LINK]"
                    rows={4}
                    className="mt-2 resize-none"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">
                    {selectedContacts.length} contacts selected
                  </span>
                  <Button onClick={handleSendLinks} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Send Links
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportContactsPage;
