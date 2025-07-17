
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Download, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  country: string;
  state?: string;
  applicableServices: string[];
  active: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  date: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  services: string[];
}

interface TaxSettings {
  companyName: string;
  taxId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  defaultTaxRate: number;
  includeTaxInPrice: boolean;
  invoicePrefix: string;
  invoiceNumbering: 'sequential' | 'date-based';
}

const InvoicesTaxPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [taxRules, setTaxRules] = useState<TaxRule[]>([
    {
      id: '1',
      name: 'GST (India)',
      rate: 18,
      type: 'percentage',
      country: 'India',
      applicableServices: ['all'],
      active: true
    },
    {
      id: '2',
      name: 'VAT (UK)',
      rate: 20,
      type: 'percentage',
      country: 'United Kingdom',
      applicableServices: ['consultation'],
      active: true
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      clientName: 'John Doe',
      amount: 100,
      taxAmount: 18,
      totalAmount: 118,
      date: '2024-01-15',
      status: 'paid',
      dueDate: '2024-02-15',
      services: ['Consultation']
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      clientName: 'Jane Smith',
      amount: 200,
      taxAmount: 36,
      totalAmount: 236,
      date: '2024-01-20',
      status: 'sent',
      dueDate: '2024-02-20',
      services: ['Treatment']
    }
  ]);

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    companyName: 'Your Business Name',
    taxId: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    defaultTaxRate: 10,
    includeTaxInPrice: false,
    invoicePrefix: 'INV',
    invoiceNumbering: 'sequential'
  });

  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TaxRule | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleSaveTaxRule = (ruleData: Partial<TaxRule>) => {
    if (editingRule) {
      setTaxRules(prev => prev.map(rule => 
        rule.id === editingRule.id ? { ...rule, ...ruleData } : rule
      ));
      toast({
        title: "Tax Rule Updated",
        description: "Tax rule has been successfully updated.",
      });
    } else {
      const newRule: TaxRule = {
        id: Date.now().toString(),
        name: ruleData.name || '',
        rate: ruleData.rate || 0,
        type: ruleData.type || 'percentage',
        country: ruleData.country || '',
        state: ruleData.state,
        applicableServices: ruleData.applicableServices || ['all'],
        active: true
      };
      setTaxRules(prev => [...prev, newRule]);
      toast({
        title: "Tax Rule Added",
        description: "New tax rule has been successfully added.",
      });
    }
    setIsRuleModalOpen(false);
    setEditingRule(null);
  };

  const handleDeleteTaxRule = (id: string) => {
    setTaxRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Tax Rule Deleted",
      description: "Tax rule has been successfully removed.",
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoices.find(inv => inv.id === invoiceId)?.invoiceNumber}...`,
    });
  };

  const TaxRuleForm: React.FC<{ rule?: TaxRule; onSave: (data: Partial<TaxRule>) => void }> = ({ 
    rule, 
    onSave 
  }) => {
    const [formData, setFormData] = useState<Partial<TaxRule>>(rule || {
      name: '',
      rate: 0,
      type: 'percentage',
      country: '',
      applicableServices: ['all'],
      active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Tax Rule Name</Label>
          <Input
            id="name"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., GST, VAT, Sales Tax"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rate">Tax Rate</Label>
            <Input
              id="rate"
              type="number"
              step="0.01"
              value={formData.rate || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
              placeholder="10.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'percentage' | 'fixed' }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.country || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              placeholder="e.g., India, United States"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province (Optional)</Label>
            <Input
              id="state"
              value={formData.state || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              placeholder="e.g., California, Maharashtra"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active"
            checked={formData.active || false}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
          />
          <Label htmlFor="active">Active Rule</Label>
        </div>

        <Button type="submit" className="w-full">
          {rule ? 'Update Tax Rule' : 'Add Tax Rule'}
        </Button>
      </form>
    );
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
            📄 Invoices & Tax Settings
          </h1>
          <p className="text-muted-foreground">Add GST, download invoices, set tax rules</p>
        </div>
      </div>

      <Tabs defaultValue="tax-rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tax-rules">Tax Rules</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tax-rules">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tax Rules</CardTitle>
              <Dialog open={isRuleModalOpen} onOpenChange={setIsRuleModalOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingRule(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tax Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingRule ? 'Edit Tax Rule' : 'Add New Tax Rule'}
                    </DialogTitle>
                  </DialogHeader>
                  <TaxRuleForm 
                    rule={editingRule || undefined} 
                    onSave={handleSaveTaxRule} 
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.active ? "default" : "secondary"}>
                          {rule.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rule.rate}{rule.type === 'percentage' ? '%' : ' (fixed)'} - {rule.country}
                        {rule.state && `, ${rule.state}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingRule(rule);
                          setIsRuleModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTaxRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{invoice.invoiceNumber}</h3>
                        <Badge variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'sent' ? 'secondary' : 
                          invoice.status === 'draft' ? 'outline' : 'destructive'
                        }>
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.clientName} - ${invoice.totalAmount} (Tax: ${invoice.taxAmount})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Date: {new Date(invoice.date).toLocaleDateString()} | 
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tax & Invoice Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={taxSettings.companyName}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Tax ID / Registration Number</Label>
                  <Input
                    id="taxId"
                    value={taxSettings.taxId}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, taxId: e.target.value }))}
                    placeholder="Enter your tax registration number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Business Address</Label>
                <Input
                  id="address"
                  value={taxSettings.address}
                  onChange={(e) => setTaxSettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your business address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={taxSettings.city}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={taxSettings.state}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={taxSettings.zipCode}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, zipCode: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={taxSettings.defaultTaxRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, defaultTaxRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={taxSettings.invoicePrefix}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, invoicePrefix: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeTaxInPrice"
                  checked={taxSettings.includeTaxInPrice}
                  onCheckedChange={(checked) => setTaxSettings(prev => ({ ...prev, includeTaxInPrice: checked }))}
                />
                <Label htmlFor="includeTaxInPrice">Include tax in displayed prices</Label>
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoicesTaxPage;
