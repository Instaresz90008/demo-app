
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Search, Filter, Mail, Phone, Tag, Users, UserCheck, UserX } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  tags: string[];
  segment: 'lead' | 'customer' | 'returning' | 'vip';
  status: 'active' | 'inactive';
  lastActivity: string;
  totalSessions: number;
  lifetimeValue: number;
}

const ContactManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      tags: ['premium', 'consultation'],
      segment: 'customer',
      status: 'active',
      lastActivity: '2024-01-15',
      totalSessions: 5,
      lifetimeValue: 2500
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      tags: ['workshop', 'group'],
      segment: 'returning',
      status: 'active',
      lastActivity: '2024-01-10',
      totalSessions: 12,
      lifetimeValue: 5400
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 987-6543',
      tags: ['lead'],
      segment: 'lead',
      status: 'active',
      lastActivity: '2024-01-20',
      totalSessions: 0,
      lifetimeValue: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tags: '',
    segment: 'lead' as Contact['segment']
  });

  const handleCreateContact = () => {
    const newContact: Contact = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      segment: formData.segment,
      status: 'active',
      lastActivity: new Date().toISOString().split('T')[0],
      totalSessions: 0,
      lifetimeValue: 0
    };

    setContacts(prev => [...prev, newContact]);
    setIsCreateModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      tags: '',
      segment: 'lead'
    });
    
    toast({
      title: "Contact Created",
      description: "New contact has been added successfully."
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Deleted",
      description: "Contact has been removed from your list."
    });
  };

  const handleUpdateSegment = (id: string, segment: Contact['segment']) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, segment } : contact
    ));
    toast({
      title: "Segment Updated",
      description: "Contact segment has been updated."
    });
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSegment = selectedSegment === 'all' || contact.segment === selectedSegment;
    
    return matchesSearch && matchesSegment;
  });

  const getSegmentColor = (segment: Contact['segment']) => {
    switch (segment) {
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'returning': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const segmentStats = {
    lead: contacts.filter(c => c.segment === 'lead').length,
    customer: contacts.filter(c => c.segment === 'customer').length,
    returning: contacts.filter(c => c.segment === 'returning').length,
    vip: contacts.filter(c => c.segment === 'vip').length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
              📇 Contact Management
            </h1>
            <p className="text-muted-foreground">Manage client contacts and customer segmentation</p>
          </div>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter contact name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., premium, consultation, workshop"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Segment</Label>
                <Select value={formData.segment} onValueChange={(value: Contact['segment']) => setFormData(prev => ({ ...prev, segment: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateContact}>
                  Add Contact
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <UserX className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{segmentStats.lead}</p>
                <p className="text-sm text-muted-foreground">Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{segmentStats.customer}</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-500/10 rounded-full">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{segmentStats.returning}</p>
                <p className="text-sm text-muted-foreground">Returning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{segmentStats.vip}</p>
                <p className="text-sm text-muted-foreground">VIP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedSegment} onValueChange={setSelectedSegment}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="lead">Leads</SelectItem>
            <SelectItem value="customer">Customers</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts List */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                      <span className="font-semibold text-primary">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{contact.name}</h3>
                        <Badge className={getSegmentColor(contact.segment)}>
                          {contact.segment}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Tag className="h-2 w-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{contact.totalSessions} sessions</p>
                    <p className="text-sm text-muted-foreground">${contact.lifetimeValue} LTV</p>
                    <p className="text-xs text-muted-foreground">
                      Last: {new Date(contact.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={contact.segment} 
                      onValueChange={(value: Contact['segment']) => handleUpdateSegment(contact.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="returning">Returning</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No contacts found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagementPage;
