
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { FileText, Upload, HelpCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PolicyFormValues {
  title: string;
  description: string;
  content: string;
  documentUrl?: string;
  variables: Record<string, string>;
}

interface PolicyVariable {
  key: string;
  name: string;
  description: string;
  defaultValue: string;
}

const defaultPolicies = {
  cancellation: {
    title: "Cancellation Policy",
    description: "Set the terms for appointment cancellations",
    content: "Cancellations must be made at least {notice_hours} hours before the scheduled appointment. A fee of {cancellation_fee}% may apply for late cancellations.",
    documentUrl: "",
    variables: {
      notice_hours: "24",
      cancellation_fee: "50"
    }
  },
  rescheduling: {
    title: "Rescheduling Policy",
    description: "Set the terms for appointment rescheduling",
    content: "Rescheduling requests must be made at least {notice_hours} hours before the scheduled appointment. A maximum of {max_reschedules} reschedules are allowed per booking.",
    documentUrl: "",
    variables: {
      notice_hours: "24",
      max_reschedules: "2"
    }
  },
  refund: {
    title: "Refund Policy",
    description: "Set the terms for refunds",
    content: "Refunds will be processed within {processing_days} business days after a cancellation. A {refund_percent}% refund will be provided for cancellations made more than {notice_hours} hours in advance.",
    documentUrl: "",
    variables: {
      processing_days: "7",
      refund_percent: "100",
      notice_hours: "24"
    }
  },
  noShow: {
    title: "No-Show Policy",
    description: "Set the terms for missed appointments",
    content: "A no-show fee of {fee_percent}% of the service cost will be charged for missed appointments. After {max_no_shows} no-shows, we reserve the right to decline future bookings.",
    documentUrl: "",
    variables: {
      fee_percent: "50",
      max_no_shows: "2"
    }
  },
};

const policyVariables: Record<string, PolicyVariable[]> = {
  cancellation: [
    { key: "notice_hours", name: "Notice Hours", description: "Hours required before cancellation", defaultValue: "24" },
    { key: "cancellation_fee", name: "Cancellation Fee %", description: "Percentage of fee charged for late cancellations", defaultValue: "50" }
  ],
  rescheduling: [
    { key: "notice_hours", name: "Notice Hours", description: "Hours required before rescheduling", defaultValue: "24" },
    { key: "max_reschedules", name: "Max Reschedules", description: "Maximum number of reschedules allowed", defaultValue: "2" }
  ],
  refund: [
    { key: "processing_days", name: "Processing Days", description: "Business days to process refund", defaultValue: "7" },
    { key: "refund_percent", name: "Refund Percentage", description: "Percentage of refund provided", defaultValue: "100" },
    { key: "notice_hours", name: "Notice Hours", description: "Hours required for full refund", defaultValue: "24" }
  ],
  noShow: [
    { key: "fee_percent", name: "Fee Percentage", description: "Percentage of service cost charged", defaultValue: "50" },
    { key: "max_no_shows", name: "Max No-Shows", description: "Maximum no-shows before declining bookings", defaultValue: "2" }
  ]
};

const PoliciesTab = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cancellation");
  const [isUploading, setIsUploading] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  
  const form = useForm<PolicyFormValues>({
    defaultValues: defaultPolicies[activeTab as keyof typeof defaultPolicies]
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.reset(defaultPolicies[value as keyof typeof defaultPolicies]);
  };
  
  const onSubmit = (data: PolicyFormValues) => {
    // Save policy (would connect to backend in a real application)
    console.log("Saving policy:", data);
    toast({
      title: "Policy updated",
      description: `Your ${data.title.toLowerCase()} has been updated successfully.`,
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file upload
      setTimeout(() => {
        form.setValue("documentUrl", `policy_documents/${file.name}`);
        setIsUploading(false);
        toast({
          title: "Document uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      }, 1500);
    }
  };

  // Function to replace variables in content with their values
  const replaceVariables = (content: string, variables: Record<string, string>) => {
    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      processedContent = processedContent.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return processedContent;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Policies</h2>
          <p className="text-muted-foreground">
            Manage your business policies for appointments and services.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
          <TabsTrigger value="rescheduling">Rescheduling</TabsTrigger>
          <TabsTrigger value="refund">Refund</TabsTrigger>
          <TabsTrigger value="noShow">No-Show</TabsTrigger>
        </TabsList>
        
        {["cancellation", "rescheduling", "refund", "noShow"].map((policyType) => (
          <TabsContent key={policyType} value={policyType} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{defaultPolicies[policyType as keyof typeof defaultPolicies].title}</CardTitle>
                <CardDescription>{defaultPolicies[policyType as keyof typeof defaultPolicies].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be displayed to clients when they book your services.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter policy details here..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between items-center mt-1">
                            <FormDescription>
                              Use {"{variable_name}"} to include variables in your policy.
                            </FormDescription>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 p-1">
                                    <HelpCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="w-80">
                                  <p className="text-sm">
                                    Example: Cancellations must be made at least {"{notice_hours}"} hours before the appointment.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Variables Section */}
                    <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Policy Variables</h4>
                        <Badge variant="outline">Dynamic Fields</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {policyVariables[activeTab as keyof typeof policyVariables].map((variable) => (
                          <FormField
                            key={variable.key}
                            control={form.control}
                            name={`variables.${variable.key}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  {variable.name}
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0 ml-1">
                                          <HelpCircle className="h-3 w-3" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">{variable.description}</p>
                                        <p className="text-xs mt-1">Use as: {"{" + variable.key + "}"}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Preview Section */}
                    <div className="border rounded-lg p-4 bg-blue-50/30">
                      <h4 className="text-sm font-medium mb-2">Preview</h4>
                      <p className="text-sm">
                        {replaceVariables(
                          form.watch("content"), 
                          form.watch("variables") || {}
                        )}
                      </p>
                    </div>
                    
                    <Collapsible
                      open={openPanel}
                      onOpenChange={setOpenPanel}
                      className="border rounded-lg p-2"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {form.watch("documentUrl") ? "Attached Document" : "Attach Document (Optional)"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {openPanel ? "Hide" : "Show"}
                          </span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="space-y-4">
                          {form.watch("documentUrl") && (
                            <div className="text-sm bg-blue-50 p-2 rounded flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{form.watch("documentUrl").split('/').pop()}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => document.getElementById('file-upload')?.click()}
                              disabled={isUploading}
                            >
                              <Upload className="h-4 w-4" />
                              {isUploading ? "Uploading..." : "Upload Document"}
                            </Button>
                            {form.watch("documentUrl") && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => form.setValue("documentUrl", "")}
                              >
                                Remove
                              </Button>
                            )}
                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx"
                              onChange={handleFileUpload}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Upload a PDF or Word document with detailed policy information.
                          </p>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Button type="submit" className="mt-4">Save Policy</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PoliciesTab;
