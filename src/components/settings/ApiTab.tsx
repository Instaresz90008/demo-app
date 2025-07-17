
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle, Key, AlertTriangle, Info, Code } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiTab = () => {
  const [copied, setCopied] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState("curl");
  const apiKey = "eh_test_51NeWiLFUXvH1234567890abcdefghijklm";
  const maskedKey = `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // N9IZ-API - Sample Endpoints (GET Services, Create Services, Get Slots, Post Slots)
  const endpoints = [
    { 
      name: "List Events", 
      method: "GET", 
      endpoint: "/v1/events",
      description: "Get all events for your account"
    },
    { 
      name: "Create Event", 
      method: "POST", 
      endpoint: "/v1/events",
      description: "Create a new event"
    },
    { 
      name: "Get Event", 
      method: "GET", 
      endpoint: "/v1/events/:id",
      description: "Retrieve a specific event by ID"
    },
    { 
      name: "Update Event", 
      method: "PATCH", 
      endpoint: "/v1/events/:id",
      description: "Update an existing event"
    },
    { 
      name: "Delete Event", 
      method: "DELETE", 
      endpoint: "/v1/events/:id",
      description: "Delete an event"
    }
  ];

  // N9IZ-API - Sample code snippets for API usage
  const codeSamples = {
    curl: `# N9IZ-API - Get all services
curl -X GET "https://api.eventhub.com/v1/services" \\
  -H "Authorization: Bearer ${maskedKey}" \\
  -H "Content-Type: application/json"

# N9IZ-API - Create a new service
curl -X POST "https://api.eventhub.com/v1/services" \\
  -H "Authorization: Bearer ${maskedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Professional Consultation",
    "duration": 60,
    "price": 150.00,
    "description": "One hour professional consultation session"
  }'`,
    node: `// N9IZ-API - Get all slots
const axios = require('axios');

const getSlots = async () => {
  try {
    const response = await axios.get('https://api.eventhub.com/v1/slots', {
      headers: {
        'Authorization': 'Bearer ${maskedKey}',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching slots:', error);
  }
};

// N9IZ-API - Create new slots
const createSlots = async (slotData) => {
  try {
    const response = await axios.post('https://api.eventhub.com/v1/slots', slotData, {
      headers: {
        'Authorization': 'Bearer ${maskedKey}',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating slots:', error);
  }
};`,
    python: `# N9IZ-API - Get all bookings
import requests

api_key = "${maskedKey}"
url = "https://api.eventhub.com/v1/bookings"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)
print(response.json())

# N9IZ-API - Create booking
booking_data = {
    "service_id": "srv_12345",
    "slot_id": "slot_67890",
    "customer_name": "Jane Doe",
    "customer_email": "jane@example.com"
}

response = requests.post(url, json=booking_data, headers=headers)
print(response.json())`
  };

  return (
    <div className="space-y-6 relative">
      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-xl border border-primary/20 animate-fade-in overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/30 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-secondary/30 animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-accent/20 animate-pulse" />
        </div>

        {/* Icon Container with Glow Effect */}
        <div className="relative mb-6 bg-background/70 rounded-full p-5 shadow-lg border border-primary/30">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <Info className="h-12 w-12 text-primary animate-pulse" />
        </div>

        {/* Content */}
        <div className="text-center space-y-3 max-w-md px-6 z-10">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
            API Access Coming Soon
          </h3>
          <p className="text-muted-foreground text-center">
            Our API integration features are currently under development and will be available in the next update.
          </p>
          <div className="pt-4">
            <Button variant="outline" className="border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10">
              Get Notified When Available
            </Button>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold">API Access</h2>
      <p className="text-gray-500 mb-6">Generate and manage API keys for integration</p>
      
      <Card className="opacity-60 transition-opacity duration-300 hover:opacity-70">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Your API Keys</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/50 p-5 rounded-lg border">
            <div className="flex items-center gap-3 mb-3">
              <Key className="h-5 w-5 text-muted-foreground" />
              <h4 className="font-medium">Live API Key</h4>
            </div>
            
            <div className="flex items-center mt-2">
              <Input 
                value={maskedKey} 
                readOnly 
                className="font-mono text-sm bg-background"
              />
              <Button variant="ghost" className="ml-2" onClick={handleCopy}>
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Generate New Key
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Revoke Key
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md flex gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Your API key provides full access to your Event Hub account. Never share it publicly or in client-side code.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="opacity-60 transition-opacity duration-300 hover:opacity-70">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">API Documentation</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Base URL</h4>
              <div className="bg-background p-2 rounded border font-mono text-sm">
                https://api.eventhub.com/v1
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Authentication</h4>
              <div className="bg-background p-2 rounded border font-mono text-sm">
                <div className="text-xs text-muted-foreground mb-1">Header</div>
                Authorization: Bearer {maskedKey}
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Available Endpoints</h4>
              <div className="space-y-3">
                {endpoints.map((endpoint, i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-secondary/50">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded",
                        endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                        endpoint.method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                        endpoint.method === 'PATCH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      )}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-sm">{endpoint.endpoint}</span>
                    </div>
                    <div className="p-3">
                      <h5 className="font-medium text-sm">{endpoint.name}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{endpoint.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* N9IZ-API - Sample Code Blocks */}
            <div className="space-y-3 pt-3">
              <h4 className="text-sm font-medium">Example Code</h4>
              
              <Tabs value={activeCodeTab} onValueChange={setActiveCodeTab} className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-2">
                  <TabsTrigger 
                    value="curl" 
                    className="text-xs data-[state=active]:bg-primary/10 rounded-t-md data-[state=active]:border-b-0 border border-border data-[state=active]:border-b-transparent px-3 py-1.5"
                  >
                    cURL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="node" 
                    className="text-xs data-[state=active]:bg-primary/10 rounded-t-md data-[state=active]:border-b-0 border border-border data-[state=active]:border-b-transparent px-3 py-1.5"
                  >
                    Node.js
                  </TabsTrigger>
                  <TabsTrigger 
                    value="python" 
                    className="text-xs data-[state=active]:bg-primary/10 rounded-t-md data-[state=active]:border-b-0 border border-border data-[state=active]:border-b-transparent px-3 py-1.5"
                  >
                    Python
                  </TabsTrigger>
                </TabsList>
                
                <div className="border rounded-md bg-zinc-950 dark:bg-zinc-900 overflow-hidden">
                  <TabsContent value="curl" className="m-0">
                    <pre className="p-4 text-green-400 dark:text-green-300 text-xs overflow-x-auto">{codeSamples.curl}</pre>
                  </TabsContent>
                  
                  <TabsContent value="node" className="m-0">
                    <pre className="p-4 text-amber-300 dark:text-amber-200 text-xs overflow-x-auto">{codeSamples.node}</pre>
                  </TabsContent>
                  
                  <TabsContent value="python" className="m-0">
                    <pre className="p-4 text-blue-300 dark:text-blue-200 text-xs overflow-x-auto">{codeSamples.python}</pre>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" className="w-full">
                View Full API Documentation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTab;
