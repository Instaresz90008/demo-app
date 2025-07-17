
import React, { useState } from 'react';
import { useAccessControl } from '@/context/AccessControlContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface TestResult {
  feature: string;
  expected: boolean;
  actual: boolean;
  passed: boolean;
}

export const PlatformAdminAccessTest: React.FC = () => {
  const { isFeatureEnabled, hasRole, getCurrentUserRole } = useAccessControl();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const userRole = getCurrentUserRole();

  // Comprehensive list of all features to test
  const allFeatures = [
    'dashboard',
    'calendar',
    'history',
    'slot_broadcast',
    'service_management',
    'manage_services',
    'event_management',
    'personal_settings',
    'service_analytics',
    'booking_access',
    'booking_link_access',
    'support_center_access',
    'raise_support_ticket',
    'team_management',
    'organization_settings',
    'org_admin_access',
    'audit_logs',
    'usage_billing_reports',
    'user_session_monitoring',
    'platform_settings',
    'platform_admin_access',
    'proxy_session_access',
    'calendar_access',
    'history_access',
    'catalogue_access',
    'voice_assistant',
    'feature_mapper_access',
    'settings_access'
  ];

  // All roles to test
  const allRoles = [
    'platform_admin',
    'org_admin',
    'team_admin',
    'end_user',
    'external_user'
  ];

  const runAccessTest = () => {
    setTesting(true);
    const results: TestResult[] = [];

    // Test all features - platform admin should have access to everything
    allFeatures.forEach(feature => {
      const actual = isFeatureEnabled(feature);
      const expected = true; // Platform admin should have access to everything
      results.push({
        feature,
        expected,
        actual,
        passed: actual === expected
      });
    });

    // Test all roles - platform admin should have all role permissions
    allRoles.forEach(role => {
      const actual = hasRole(role);
      const expected = true; // Platform admin should have all role permissions
      results.push({
        feature: `role:${role}`,
        expected,
        actual,
        passed: actual === expected
      });
    });

    setTestResults(results);
    setTesting(false);
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const allPassed = passedTests === totalTests;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Platform Admin Access Test
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant={userRole === 'platform_admin' ? 'default' : 'destructive'}>
            Current Role: {userRole}
          </Badge>
          <Button onClick={runAccessTest} disabled={testing} size="sm">
            {testing ? 'Testing...' : 'Run Access Test'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {userRole !== 'platform_admin' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              ⚠️ You are not logged in as platform_admin. Switch to platform admin to run the full test.
            </p>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              {allPassed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {passedTests}/{totalTests} tests passed
              </span>
              {allPassed && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  All tests passed! ✅
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2 rounded text-sm ${
                    result.passed
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  <span className="font-mono">{result.feature}</span>
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>{result.actual ? 'PASS' : 'FAIL'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
