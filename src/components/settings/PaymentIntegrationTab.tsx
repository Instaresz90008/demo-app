
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, CreditCard, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaymentIntegrationTab = () => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<string>("");
  const [isTestMode, setIsTestMode] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [razorpayConnected, setRazorpayConnected] = useState(false);
  const [phonePeConnected, setPhonePeConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<{
    apiKey: string;
    secretKey: string;
    webhookSecret?: string;
    merchantId?: string;
  }>({
    apiKey: "",
    secretKey: "",
    webhookSecret: "",
    merchantId: "",
  });
  
  const handleSaveConfig = () => {
    if (!currentConfig.apiKey || !currentConfig.secretKey) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsConfiguring(false);
    
    // Update connection status based on provider
    switch (provider) {
      case "stripe":
        setStripeConnected(true);
        break;
      case "razorpay":
        setRazorpayConnected(true);
        break;
      case "phonepe":
        setPhonePeConnected(true);
        break;
    }
    
    toast({
      title: "Configuration saved",
      description: `Your ${provider} integration has been configured successfully.`,
    });
  };
  
  const handleConfigureProvider = (selectedProvider: string) => {
    setProvider(selectedProvider);
    setIsConfiguring(true);
    setCurrentConfig({
      apiKey: "",
      secretKey: "",
      webhookSecret: "",
      merchantId: "",
    });
  };
  
  const handleTestConnection = () => {
    toast({
      title: "Connection successful",
      description: `Test connection to ${provider} was successful.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Payment Integrations</h2>
          <p className="text-gray-500">
            Configure payment gateways to accept payments from your customers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="test-mode" className="text-sm">Test Mode</Label>
          <Switch
            id="test-mode"
            checked={isTestMode}
            onCheckedChange={setIsTestMode}
          />
        </div>
      </div>
      
      {isConfiguring ? (
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">
              {provider} Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder={`${provider} API Key`}
                value={currentConfig.apiKey}
                onChange={(e) =>
                  setCurrentConfig({ ...currentConfig, apiKey: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                {isTestMode
                  ? "Use your test API key for development and testing."
                  : "Use your live API key for production."}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                placeholder={`${provider} Secret Key`}
                value={currentConfig.secretKey}
                onChange={(e) =>
                  setCurrentConfig({ ...currentConfig, secretKey: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Your secret key should never be shared publicly.
              </p>
            </div>
            
            {provider === "stripe" && (
              <div className="space-y-2">
                <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
                <Input
                  id="webhook-secret"
                  type="password"
                  placeholder="Webhook Secret"
                  value={currentConfig.webhookSecret}
                  onChange={(e) =>
                    setCurrentConfig({
                      ...currentConfig,
                      webhookSecret: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-gray-500">
                  Used to validate webhook events from Stripe.
                </p>
              </div>
            )}
            
            {(provider === "razorpay" || provider === "phonepe") && (
              <div className="space-y-2">
                <Label htmlFor="merchant-id">Merchant ID</Label>
                <Input
                  id="merchant-id"
                  placeholder="Merchant ID"
                  value={currentConfig.merchantId}
                  onChange={(e) =>
                    setCurrentConfig({
                      ...currentConfig,
                      merchantId: e.target.value,
                    })
                  }
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Payment Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD (US Dollar)</SelectItem>
                  <SelectItem value="eur">EUR (Euro)</SelectItem>
                  <SelectItem value="gbp">GBP (British Pound)</SelectItem>
                  <SelectItem value="inr">INR (Indian Rupee)</SelectItem>
                  <SelectItem value="cad">CAD (Canadian Dollar)</SelectItem>
                  <SelectItem value="aud">AUD (Australian Dollar)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pt-2">
              <Label>Payment Methods</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="card-payments"
                    defaultChecked
                    className="rounded text-primary border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="card-payments" className="text-sm">
                    Card Payments
                  </label>
                </div>
                
                {provider === "stripe" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="apple-pay"
                        className="rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="apple-pay" className="text-sm">
                        Apple Pay
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="google-pay"
                        className="rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="google-pay" className="text-sm">
                        Google Pay
                      </label>
                    </div>
                  </>
                )}
                
                {provider === "razorpay" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="upi"
                        className="rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="upi" className="text-sm">
                        UPI
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="netbanking"
                        className="rounded text-primary border-gray-300 focus:ring-primary"
                      />
                      <label htmlFor="netbanking" className="text-sm">
                        Net Banking
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsConfiguring(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConfig}>Save Configuration</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stripe */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Stripe</span>
                {stripeConnected && (
                  <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Credit Card Payments</h4>
                  <p className="text-sm text-gray-500">
                    Accept payments worldwide
                  </p>
                </div>
              </div>
              
              {stripeConnected ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Mode:</span>{" "}
                    <span className="font-medium">
                      {isTestMode ? "Test" : "Live"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection()}
                    >
                      Test Connection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureProvider("stripe")}
                    >
                      Reconfigure
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleConfigureProvider("stripe")}
                >
                  Connect Stripe
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* Razorpay */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Razorpay</span>
                {razorpayConnected && (
                  <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.44 3.45h6.9v13.55L8.44 3.45z" />
                    <path d="M3 3h3.05v9.7L3 3zm15.06 0h3.06l-12.17 18H6l12.06-18z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Indian Payment Gateway</h4>
                  <p className="text-sm text-gray-500">
                    UPI, Cards, Net Banking
                  </p>
                </div>
              </div>
              
              {razorpayConnected ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Mode:</span>{" "}
                    <span className="font-medium">
                      {isTestMode ? "Test" : "Live"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection()}
                    >
                      Test Connection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureProvider("razorpay")}
                    >
                      Reconfigure
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleConfigureProvider("razorpay")}
                >
                  Connect Razorpay
                </Button>
              )}
            </CardContent>
          </Card>
          
          {/* PhonePe */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>PhonePe</span>
                {phonePeConnected && (
                  <span className="bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                  <svg className="h-6 w-6 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">UPI Payments</h4>
                  <p className="text-sm text-gray-500">
                    Fast and secure mobile payments
                  </p>
                </div>
              </div>
              
              {phonePeConnected ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Mode:</span>{" "}
                    <span className="font-medium">
                      {isTestMode ? "Test" : "Live"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection()}
                    >
                      Test Connection
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConfigureProvider("phonepe")}
                    >
                      Reconfigure
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => handleConfigureProvider("phonepe")}
                >
                  Connect PhonePe
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Payment Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Automatic Payment Confirmation</h4>
              <p className="text-sm text-gray-500">Automatically confirm bookings when payment is received</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Save Payment Information</h4>
              <p className="text-sm text-gray-500">Save customer payment information for faster checkout</p>
            </div>
            <Switch />
          </div>
          
          <div className="space-y-2 pt-2">
            <Label>Default Payment Provider</Label>
            <RadioGroup defaultValue="stripe">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stripe" id="default-stripe" />
                <Label htmlFor="default-stripe">Stripe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="razorpay" id="default-razorpay" />
                <Label htmlFor="default-razorpay">Razorpay</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phonepe" id="default-phonepe" />
                <Label htmlFor="default-phonepe">PhonePe</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button variant="outline" className="mt-4">
            View Payment Documentation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      
      {/* Transaction Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Revenue Overview</h4>
                <p className="text-sm text-gray-500">View your payment statistics</p>
              </div>
              <Button variant="outline">View Report</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Transactions</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Refunds</p>
                <p className="text-2xl font-bold">$0.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentIntegrationTab;
