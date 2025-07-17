
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";

interface PaymentCheckoutDemoProps {
  integrationProvider: "stripe" | "razorpay" | "phonepe";
}

const PaymentCheckoutDemo = ({ integrationProvider }: PaymentCheckoutDemoProps) => {
  const { toast } = useToast();
  const [amount, setAmount] = useState("49.99");
  const [currency, setCurrency] = useState("usd");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleTestCheckout = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate a payment process
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Demo checkout initiated",
        description: `${integrationProvider} checkout would open in production with real credentials`,
      });
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">Test {integrationProvider} Checkout</CardTitle>
        <CardDescription>
          Try a simulated payment checkout flow to test your integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Currency</Label>
            <RadioGroup value={currency} onValueChange={setCurrency}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="usd" id="usd" />
                <Label htmlFor="usd">USD ($)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="eur" id="eur" />
                <Label htmlFor="eur">EUR (€)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="gbp" id="gbp" />
                <Label htmlFor="gbp">GBP (£)</Label>
              </div>
              {(integrationProvider === "razorpay" || integrationProvider === "phonepe") && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inr" id="inr" />
                  <Label htmlFor="inr">INR (₹)</Label>
                </div>
              )}
            </RadioGroup>
          </div>
          
          <div className="pt-4">
            <p className="text-lg font-medium">
              Order Summary
            </p>
            <div className="flex justify-between py-2 border-b">
              <span>Test Product</span>
              <span>
                {currency === "usd" && "$"}
                {currency === "eur" && "€"}
                {currency === "gbp" && "£"}
                {currency === "inr" && "₹"}
                {amount}
              </span>
            </div>
            <div className="flex justify-between py-2 font-medium">
              <span>Total</span>
              <span>
                {currency === "usd" && "$"}
                {currency === "eur" && "€"}
                {currency === "gbp" && "£"}
                {currency === "inr" && "₹"}
                {amount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestCheckout} 
          disabled={isProcessing} 
          className="w-full"
        >
          {isProcessing ? (
            <span className="flex items-center">Processing...</span>
          ) : (
            <span className="flex items-center">
              Checkout with {integrationProvider.charAt(0).toUpperCase() + integrationProvider.slice(1)}
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentCheckoutDemo;
