
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Code, Copy, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StripeWebhookSetupProps {
  isTestMode?: boolean;
}

const StripeWebhookSetup = ({ isTestMode = true }: StripeWebhookSetupProps) => {
  const { toast } = useToast();
  const [webhookUrl] = useState('https://yourapp.com/api/stripe-webhook');
  const [webhookSecret, setWebhookSecret] = useState('');
  
  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      description: "Webhook URL copied to clipboard",
    });
  };
  
  const handleSaveWebhook = () => {
    if (!webhookSecret) {
      toast({
        title: "Missing webhook secret",
        description: "Please enter your webhook secret",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Webhook configuration saved",
      description: "Your Stripe webhook has been configured successfully",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stripe Webhook Setup</CardTitle>
        <CardDescription>
          Configure webhooks to receive real-time event notifications from Stripe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-sm">
            Webhooks allow Stripe to notify your application when events occur in your account, 
            such as successful payments or subscription updates.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <Label>Webhook URL</Label>
          <div className="flex items-center">
            <code className="bg-gray-100 py-2 px-3 rounded text-sm flex-1 overflow-auto">
              {webhookUrl}
            </code>
            <Button variant="ghost" size="sm" onClick={handleCopyWebhookUrl} className="ml-2">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Add this URL to your Stripe dashboard under Developers &gt; Webhooks &gt; Add endpoint
          </p>
        </div>
        
        <div className="space-y-2 pt-4">
          <Label htmlFor="webhook-secret">Webhook Signing Secret</Label>
          <Input
            id="webhook-secret"
            placeholder="whsec_..."
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Find this in your Stripe dashboard after creating the webhook endpoint
          </p>
        </div>
        
        <div className="space-y-1 pt-4">
          <h4 className="text-sm font-medium">Recommended Events</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'checkout.session.completed',
              'payment_intent.succeeded',
              'payment_intent.payment_failed',
              'invoice.paid',
              'invoice.payment_failed',
              'customer.subscription.created',
              'customer.subscription.updated',
              'customer.subscription.deleted',
            ].map((event) => (
              <div key={event} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <code className="text-xs">{event}</code>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4">
          <Button onClick={handleSaveWebhook}>Save Webhook Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeWebhookSetup;
