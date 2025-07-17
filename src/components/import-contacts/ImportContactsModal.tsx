
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Users, 
  Link, 
  Download, 
  Mail, 
  Phone, 
  User,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareableLink, setShareableLink] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  
  // Manual contact form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // Contact list
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `Selected ${file.name} for upload`
      });
    }
  };

  const generateShareableLink = () => {
    const link = `https://yourapp.com/import/${Math.random().toString(36).substring(7)}`;
    setShareableLink(link);
  };

  const handleSaveContact = () => {
    if (!contactForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    const newContact: Contact = {
      id: Math.random().toString(36).substring(2, 9),
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      createdAt: new Date().toISOString()
    };

    setContacts(prev => [...prev, newContact]);
    setContactForm({ name: "", email: "", phone: "" });
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added successfully`
    });
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    toast({
      title: "Contact Removed",
      description: "Contact has been deleted"
    });
  };

  const handleSelectContacts = () => {
    setActiveTab("select");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border shadow-2xl">
        <DialogHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 -m-6 mb-6 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Import Contacts
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-base">
                  Add contacts to your system using multiple methods
                </DialogDescription>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleSelectContacts}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Select Contacts
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle className="h-3 w-3 mr-1" />
              CSV & Excel Support
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300">
              <Upload className="h-3 w-3 mr-1" />
              Bulk Import
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300">
              <Link className="h-3 w-3 mr-1" />
              Shareable Links
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="upload" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Link className="h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="select" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              Select Contacts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  Upload Contact File
                </CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file containing your contacts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-lg font-medium text-foreground mb-2">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-sm text-muted-foreground mb-4">
                      CSV, XLSX files up to 10MB
                    </div>
                    <Button variant="outline" className="mt-2 border-2">
                      Choose File
                    </Button>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </Label>
                </div>
                
                {selectedFile && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-300">
                        {selectedFile.name}
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Required Columns
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <div>• Name (required)</div>
                        <div>• Email (optional)</div>
                        <div>• Phone (optional)</div>
                        <div>• Company (optional)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6 mt-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5 text-primary" />
                  Manual Contact Entry
                </CardTitle>
                <CardDescription>
                  Add contacts manually using individual fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name" className="text-foreground font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name *
                    </Label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      className="bg-input border border-border text-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-email" className="text-foreground font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="bg-input border border-border text-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone" className="text-foreground font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="bg-input border border-border text-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveContact}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Save Contact
                </Button>

                {/* Contact List */}
                {contacts.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">Added Contacts ({contacts.length})</h3>
                    </div>
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{contact.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {contact.email && <span>{contact.email}</span>}
                                {contact.email && contact.phone && <span> • </span>}
                                {contact.phone && <span>{contact.phone}</span>}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="link" className="space-y-6 mt-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Link className="h-5 w-5 text-primary" />
                  Shareable Import Link
                </CardTitle>
                <CardDescription>
                  Generate a link that others can use to add their contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                    <Link className="h-10 w-10 text-primary" />
                  </div>
                  <Button 
                    onClick={generateShareableLink}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3"
                  >
                    Generate Shareable Link
                  </Button>
                </div>
                
                {shareableLink && (
                  <div className="space-y-3">
                    <Label className="text-foreground font-medium">Generated Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={shareableLink}
                        readOnly
                        className="bg-input border border-border text-foreground font-mono text-sm"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => navigator.clipboard.writeText(shareableLink)}
                        className="border px-3"
                      >
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800 dark:text-green-300 mb-2">
                            Link Features
                          </div>
                          <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
                            <div>• Secure and time-limited access</div>
                            <div>• Mobile-friendly form</div>
                            <div>• Automatic import to your contacts</div>
                            <div>• Email notifications for new submissions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="select" className="space-y-6 mt-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="h-5 w-5 text-primary" />
                  Select Contacts
                </CardTitle>
                <CardDescription>
                  Choose specific contacts to use or share
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contacts.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-4">
                      Select contacts you want to use for sharing or other actions.
                    </div>
                    
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              className="rounded border-border" 
                              id={`contact-${contact.id}`}
                            />
                            <label htmlFor={`contact-${contact.id}`} className="flex items-center gap-3 cursor-pointer">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">{contact.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {contact.email && <span>{contact.email}</span>}
                                  {contact.email && contact.phone && <span> • </span>}
                                  {contact.phone && <span>{contact.phone}</span>}
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4 border-t border-border">
                      <Button variant="outline">
                        Select All
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Use Selected Contacts
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto mb-4 p-4 bg-muted/30 rounded-full w-fit">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Contacts Available</h3>
                    <p className="text-muted-foreground mb-4">
                      Add contacts using the Manual Entry or Upload File tabs first.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("manual")}
                    >
                      Add Contacts
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border bg-muted/20 -m-6 mt-6 p-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border"
          >
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
            <Download className="h-4 w-4 mr-2" />
            Import Contacts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
