
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, LogIn, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IntegrationsTab = () => {
  const integrations = [
    {
      name: "Google Calendar",
      icon: <Calendar className="h-6 w-6 text-[#4285F4]" />,
      description: "Sync your events with Google Calendar",
      connected: true
    },
    {
      name: "Microsoft Outlook",
      icon: <Calendar className="h-6 w-6 text-[#0078D4]" />,
      description: "Sync your events with Outlook Calendar",
      connected: false
    },
    {
      name: "Apple iCloud",
      icon: <Calendar className="h-6 w-6 text-[#999999]" />,
      description: "Sync your events with Apple Calendar",
      connected: false
    },
    {
      name: "Zoom",
      icon: <LogIn className="h-6 w-6 text-[#2D8CFF]" />,
      description: "Automatically create Zoom meetings for your events",
      connected: true
    },
    {
      name: "Microsoft Teams",
      icon: <LogIn className="h-6 w-6 text-[#6264A7]" />,
      description: "Create Teams meetings for your events",
      connected: false
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Calendar Integrations</h2>
      <p className="text-gray-500 mb-6">Connect your calendars and meeting providers to sync appointments</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{integration.name}</h3>
                      {integration.connected && (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-end">
                <Button 
                  variant={integration.connected ? "outline" : "default"} 
                  size="sm" 
                  className="gap-1"
                >
                  {integration.connected ? "Manage" : "Connect"} 
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Integration Settings</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Calendar Sync Options</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="two-way" type="radio" name="sync-type" className="mr-2" defaultChecked />
                  <label htmlFor="two-way" className="text-sm">Two-way sync (recommended)</label>
                </div>
                <div className="flex items-center">
                  <input id="one-way" type="radio" name="sync-type" className="mr-2" />
                  <label htmlFor="one-way" className="text-sm">One-way sync (event hub → external calendars)</label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Availability Calculation</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input id="all-calendars" type="checkbox" className="mr-2" defaultChecked />
                  <label htmlFor="all-calendars" className="text-sm">Consider all connected calendars for availability</label>
                </div>
                <div className="flex items-center">
                  <input id="busy-only" type="checkbox" className="mr-2" defaultChecked />
                  <label htmlFor="busy-only" className="text-sm">Only consider events marked as "Busy"</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button>Save Integration Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
