
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Brain, Bot, MessageSquare, Settings, Zap, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  pricing: string;
}

interface AISettings {
  enabled: boolean;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  autoRespond: boolean;
  responseDelay: number;
  fallbackEnabled: boolean;
  fallbackMessage: string;
  contextWindow: number;
  personalityMode: 'professional' | 'friendly' | 'casual' | 'custom';
  customPersonality: string;
}

interface ConversationLog {
  id: string;
  timestamp: string;
  user: string;
  query: string;
  response: string;
  model: string;
  tokens: number;
  responseTime: number;
}

const AiSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [aiSettings, setAiSettings] = useState<AISettings>({
    enabled: true,
    defaultModel: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'You are Tara, a helpful AI assistant for JusBook. Help users with booking, scheduling, and general inquiries in a professional and friendly manner.',
    autoRespond: false,
    responseDelay: 2,
    fallbackEnabled: true,
    fallbackMessage: 'I\'m sorry, I\'m currently unavailable. Please contact our support team for assistance.',
    contextWindow: 4000,
    personalityMode: 'professional',
    customPersonality: ''
  });

  const [conversationLogs] = useState<ConversationLog[]>([
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'John Doe',
      query: 'What are your business hours?',
      response: 'Our business hours are Monday to Friday, 9 AM to 6 PM.',
      model: 'gpt-4',
      tokens: 45,
      responseTime: 1.2
    },
    {
      id: '2',
      timestamp: '2024-01-15T11:45:00Z',
      user: 'Jane Smith',
      query: 'Can I reschedule my appointment?',
      response: 'Yes, you can reschedule your appointment. Let me help you find a new time slot.',
      model: 'gpt-4',
      tokens: 67,
      responseTime: 0.8
    }
  ]);

  const aiModels: AIModel[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable model with superior reasoning',
      capabilities: ['Text Generation', 'Code', 'Analysis', 'Creative Writing'],
      pricing: '$0.03/1K tokens'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and efficient for most tasks',
      capabilities: ['Text Generation', 'Chat', 'Summarization'],
      pricing: '$0.002/1K tokens'
    },
    {
      id: 'claude-3',
      name: 'Claude 3',
      provider: 'Anthropic',
      description: 'Advanced reasoning with safety focus',
      capabilities: ['Text Generation', 'Analysis', 'Code', 'Research'],
      pricing: '$0.015/1K tokens'
    }
  ];

  const handleSaveSettings = () => {
    toast({
      title: "AI Settings Saved",
      description: "Your AI configuration has been successfully updated.",
    });
  };

  const handleTestAI = () => {
    toast({
      title: "AI Test Started",
      description: "Testing AI response with current settings...",
    });
  };

  const resetToDefaults = () => {
    setAiSettings({
      enabled: true,
      defaultModel: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: 'You are Tara, a helpful AI assistant for JusBook. Help users with booking, scheduling, and general inquiries in a professional and friendly manner.',
      autoRespond: false,
      responseDelay: 2,
      fallbackEnabled: true,
      fallbackMessage: 'I\'m sorry, I\'m currently unavailable. Please contact our support team for assistance.',
      contextWindow: 4000,
      personalityMode: 'professional',
      customPersonality: ''
    });
    toast({
      title: "Settings Reset",
      description: "AI settings have been reset to defaults.",
    });
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
            🧠 AI Settings
          </h1>
          <p className="text-muted-foreground">Configure Tara AI Co-Pilot and AI features</p>
        </div>
      </div>

      {/* Upgrade Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-800">Professional Plan Required</h3>
              <p className="text-sm text-yellow-700">
                AI features are available with Professional plan and above. 
                <Button variant="link" className="p-0 h-auto text-yellow-700 underline ml-1">
                  Upgrade now
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="models">AI Models</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable AI Assistant</Label>
                    <p className="text-sm text-muted-foreground">Turn Tara AI on/off</p>
                  </div>
                  <Switch
                    checked={aiSettings.enabled}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, enabled: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="defaultModel">Default AI Model</Label>
                  <Select 
                    value={aiSettings.defaultModel} 
                    onValueChange={(value) => setAiSettings(prev => ({ ...prev, defaultModel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} - {model.provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Temperature: {aiSettings.temperature}</Label>
                  <p className="text-sm text-muted-foreground mb-2">Controls creativity (0 = focused, 1 = creative)</p>
                  <Slider
                    value={[aiSettings.temperature]}
                    onValueChange={(value) => setAiSettings(prev => ({ ...prev, temperature: value[0] }))}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="maxTokens">Max Response Length</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    value={aiSettings.maxTokens}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                    min={100}
                    max={4000}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Response Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Respond</Label>
                    <p className="text-sm text-muted-foreground">Automatically reply to messages</p>
                  </div>
                  <Switch
                    checked={aiSettings.autoRespond}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, autoRespond: checked }))}
                  />
                </div>

                <div>
                  <Label>Response Delay: {aiSettings.responseDelay}s</Label>
                  <p className="text-sm text-muted-foreground mb-2">Delay before AI responds</p>
                  <Slider
                    value={[aiSettings.responseDelay]}
                    onValueChange={(value) => setAiSettings(prev => ({ ...prev, responseDelay: value[0] }))}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Fallback Enabled</Label>
                    <p className="text-sm text-muted-foreground">Show message when AI fails</p>
                  </div>
                  <Switch
                    checked={aiSettings.fallbackEnabled}
                    onCheckedChange={(checked) => setAiSettings(prev => ({ ...prev, fallbackEnabled: checked }))}
                  />
                </div>

                <div>
                  <Label htmlFor="fallbackMessage">Fallback Message</Label>
                  <Textarea
                    id="fallbackMessage"
                    value={aiSettings.fallbackMessage}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, fallbackMessage: e.target.value }))}
                    placeholder="Enter fallback message..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="systemPrompt">AI System Instructions</Label>
                  <Textarea
                    id="systemPrompt"
                    value={aiSettings.systemPrompt}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
                    rows={4}
                    placeholder="Define how your AI should behave..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSettings}>
                    Save Configuration
                  </Button>
                  <Button variant="outline" onClick={handleTestAI}>
                    <Zap className="h-4 w-4 mr-2" />
                    Test AI
                  </Button>
                  <Button variant="outline" onClick={resetToDefaults}>
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models">
          <div className="grid gap-4">
            {aiModels.map((model) => (
              <Card key={model.id} className={model.id === aiSettings.defaultModel ? 'border-primary' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{model.name}</h3>
                        <Badge variant="outline">{model.provider}</Badge>
                        {model.id === aiSettings.defaultModel && (
                          <Badge variant="default">Current</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((capability, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm font-medium">Pricing: {model.pricing}</p>
                    </div>
                    <Button
                      variant={model.id === aiSettings.defaultModel ? "outline" : "default"}
                      size="sm"
                      onClick={() => setAiSettings(prev => ({ ...prev, defaultModel: model.id }))}
                      disabled={model.id === aiSettings.defaultModel}
                    >
                      {model.id === aiSettings.defaultModel ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personality">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Personality Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="personalityMode">Personality Mode</Label>
                <Select 
                  value={aiSettings.personalityMode} 
                  onValueChange={(value) => setAiSettings(prev => ({ ...prev, personalityMode: value as AISettings['personalityMode'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {aiSettings.personalityMode === 'custom' && (
                <div>
                  <Label htmlFor="customPersonality">Custom Personality Description</Label>
                  <Textarea
                    id="customPersonality"
                    value={aiSettings.customPersonality}
                    onChange={(e) => setAiSettings(prev => ({ ...prev, customPersonality: e.target.value }))}
                    rows={3}
                    placeholder="Describe how you want your AI to behave and communicate..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-medium mb-2">Preview Response Style</h4>
                  <div className="text-sm space-y-2">
                    <p><strong>Professional:</strong> "I'd be happy to assist you with your booking inquiry."</p>
                    <p><strong>Friendly:</strong> "Hi there! I'm excited to help you find the perfect appointment time!"</p>
                    <p><strong>Casual:</strong> "Hey! Let me help you get that appointment sorted out."</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Current Settings</h4>
                  <div className="text-sm space-y-1">
                    <p>Mode: <span className="font-medium">{aiSettings.personalityMode}</span></p>
                    <p>Temperature: <span className="font-medium">{aiSettings.temperature}</span></p>
                    <p>Auto-respond: <span className="font-medium">{aiSettings.autoRespond ? 'Yes' : 'No'}</span></p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                Save Personality Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">2,847</div>
                    <div className="text-sm text-muted-foreground">Total Queries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1.2s</div>
                    <div className="text-sm text-muted-foreground">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">94%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">$47.23</div>
                    <div className="text-sm text-muted-foreground">API Costs (MTD)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversationLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{log.user}</span>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{log.model}</span>
                          <span>{log.tokens} tokens</span>
                          <span>{log.responseTime}s</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p><strong>Q:</strong> {log.query}</p>
                        <p><strong>A:</strong> {log.response}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AiSettingsPage;
