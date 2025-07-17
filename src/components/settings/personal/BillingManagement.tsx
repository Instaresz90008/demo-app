
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Download, Calendar, DollarSign } from 'lucide-react';

export const BillingManagement: React.FC = () => {
  const { toast } = useToast();
  const [billingHistory] = useState([
    { id: '1', date: '2024-01-15', amount: '$149.00', status: 'paid', description: 'Pro Plan - Monthly' },
    { id: '2', date: '2023-12-15', amount: '$149.00', status: 'paid', description: 'Pro Plan - Monthly' },
    { id: '3', date: '2023-11-15', amount: '$149.00', status: 'paid', description: 'Pro Plan - Monthly' }
  ]);

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Invoice ${invoiceId} is being downloaded.`,
    });
  };

  const handleUpgradePlan = () => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to upgrade options...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing Management
        </h3>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
            <div>
              <h4 className="text-lg font-bold">Pro Plan</h4>
              <p className="text-muted-foreground">Billed monthly</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">Active</Badge>
                <span className="text-sm text-muted-foreground">Next billing: Jan 15, 2024</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$149</div>
              <div className="text-sm text-muted-foreground">per month</div>
              <Button onClick={handleUpgradePlan} size="sm" className="mt-2">
                Upgrade Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary rounded-full">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold">•••• •••• •••• 4242</h4>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update Card
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billingHistory.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{invoice.description}</h4>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'outline'}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                  <span className="font-semibold">{invoice.amount}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
