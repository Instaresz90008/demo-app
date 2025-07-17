
import React from 'react';
import { useMetaArchitecture } from '@/hooks/useMetaArchitecture';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Shield, 
  Settings, 
  Users, 
  Flag, 
  Scale, 
  Map,
  Loader2
} from 'lucide-react';

const MetaArchitectureDashboard: React.FC = () => {
  const {
    initialized,
    loading,
    getUserContext,
    getFoundation,
    getIndustryConfig,
    getPlanConfig,
    getJourneyStage,
    getCancellationPolicy,
    getSuggestionEngine,
    getDataResidencyRules,
    isFeatureEnabled
  } = useMetaArchitecture();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading Meta Architecture...</span>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Failed to initialize Meta Architecture</p>
      </div>
    );
  }

  const context = getUserContext();
  const foundation = getFoundation();
  const industryConfig = getIndustryConfig();
  const planConfig = getPlanConfig();
  const journeyStage = getJourneyStage();
  const cancellationPolicy = getCancellationPolicy();
  const suggestionEngine = getSuggestionEngine('service');
  const dataResidency = getDataResidencyRules();

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Meta Architecture Dashboard</h1>
        <p className="text-muted-foreground">
          7-Layer Platform Intelligence and Orchestration System
        </p>
      </div>

      {/* User Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current User Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm font-medium">Plan</p>
              <Badge variant="outline">{context.plan}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <Badge variant="outline">{context.role}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Stage</p>
              <Badge variant="outline">{context.stage}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Industry</p>
              <Badge variant="outline">{context.industry}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Region</p>
              <Badge variant="outline">{context.region}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* MetaFoundation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Foundation Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-sm text-muted-foreground">{foundation?.version}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Industry Config</p>
              <p className="text-sm text-muted-foreground">
                {industryConfig?.subcategories.length} subcategories
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Plan Features</p>
              <p className="text-sm text-muted-foreground">
                {planConfig?.features.length} features
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">AI Access</p>
              <Badge variant={planConfig?.aiAccess ? "default" : "secondary"}>
                {planConfig?.aiAccess ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* MetaJourney */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              Journey Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Current Stage</p>
              <Badge variant="outline">{journeyStage?.name}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Available Features</p>
              <p className="text-sm text-muted-foreground">
                {journeyStage?.availableFeatures.length} features
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">AI Capabilities</p>
              <p className="text-sm text-muted-foreground">
                {journeyStage?.aiCapabilities.length} capabilities
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MetaFeatureFlags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Feature Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">AI Scheduling</p>
              <Badge variant={isFeatureEnabled('ai_scheduling') ? "default" : "secondary"}>
                {isFeatureEnabled('ai_scheduling') ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Advanced Analytics</p>
              <Badge variant={isFeatureEnabled('advanced_analytics') ? "default" : "secondary"}>
                {isFeatureEnabled('advanced_analytics') ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Custom Branding</p>
              <Badge variant={isFeatureEnabled('custom_branding') ? "default" : "secondary"}>
                {isFeatureEnabled('custom_branding') ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* MetaGovernance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Governance Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Cancellation Window</p>
              <p className="text-sm text-muted-foreground">
                {cancellationPolicy?.freeWindow}h free cancellation
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Penalty Tiers</p>
              <p className="text-sm text-muted-foreground">
                {cancellationPolicy?.penaltyStructure.length} tiers
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Industry Rules</p>
              <p className="text-sm text-muted-foreground">
                {cancellationPolicy?.industryId} specific
              </p>
            </div>
          </CardContent>
        </Card>

        {/* MetaProtection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Protection Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Security Level</p>
              <Badge variant="outline">Enhanced</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Rate Limiting</p>
              <Badge variant="default">Active</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Bot Detection</p>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* MetaIntelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Intelligence Layer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Suggestion Engine</p>
              <Badge variant={suggestionEngine ? "default" : "secondary"}>
                {suggestionEngine ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Smart Scheduling</p>
              <Badge variant={planConfig?.aiAccess ? "default" : "secondary"}>
                {planConfig?.aiAccess ? "Available" : "Upgrade Required"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Learning Loops</p>
              <Badge variant="outline">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Feature Access Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Live Feature Access Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant={isFeatureEnabled('ai_assistant') ? "default" : "secondary"}
              disabled={!isFeatureEnabled('ai_assistant')}
            >
              AI Assistant
            </Button>
            <Button 
              variant={isFeatureEnabled('advanced_analytics') ? "default" : "secondary"}
              disabled={!isFeatureEnabled('advanced_analytics')}
            >
              Analytics
            </Button>
            <Button 
              variant={isFeatureEnabled('custom_branding') ? "default" : "secondary"}
              disabled={!isFeatureEnabled('custom_branding')}
            >
              Custom Branding
            </Button>
            <Button 
              variant={isFeatureEnabled('team_management') ? "default" : "secondary"}
              disabled={!isFeatureEnabled('team_management')}
            >
              Team Management
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Data Residency</p>
              <p className="text-sm text-muted-foreground">
                {dataResidency?.region} - {dataResidency?.storageRequirements.join(', ')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Industry Compliance</p>
              <div className="flex gap-2 flex-wrap">
                {industryConfig?.defaultGovernanceRules.map((rule) => (
                  <Badge key={rule} variant="outline">{rule}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default MetaArchitectureDashboard;
