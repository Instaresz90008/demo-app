
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Shield, AlertTriangle, Smartphone, Key } from "lucide-react";

const SecurityTab = () => {
  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      <p className="text-gray-500 mb-6">Update your password and security preferences</p>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Change Password</h3>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters and include a number and a special character.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Update Password</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an extra layer of security to your account by requiring a verification code in addition to your password.
                </p>
              </div>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          
          <div className="mt-6 py-4 px-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-300">Enhance Your Account Security</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Two-factor authentication is highly recommended for all accounts, especially those with access to sensitive information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">Login Devices</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { device: "MacBook Pro", location: "San Francisco, CA", last: "Active now", current: true },
                { device: "iPhone 14", location: "San Francisco, CA", last: "2 hours ago" },
                { device: "Windows PC", location: "New York, NY", last: "Yesterday" }
              ].map((device, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-secondary rounded-full">
                      <Smartphone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{device.device}</h4>
                        {device.current && (
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-1.5 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{device.location}</p>
                      <p className="text-xs text-muted-foreground">{device.last}</p>
                    </div>
                  </div>
                  {!device.current && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      Log out
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Log Out All Other Devices
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold">API Keys</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-secondary rounded-full">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">Event Hub API</h4>
                  <p className="text-xs text-muted-foreground">Created on Apr 15, 2025</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="bg-secondary px-3 py-1 rounded text-xs font-mono">
                      eh_*************TKYP
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      Show
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                Generate New Key
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                Revoke Keys
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground">
              <p>API keys provide full access to your account. Keep them secure.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecurityTab;
