
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Shield, AlertTriangle, User, Globe, Clock, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformAuditEntry {
  id: string;
  category: 'user_activity' | 'security_incident' | 'system_event';
  event_type: string;
  user_id?: string;
  user_email?: string;
  timestamp: string;
  ip_address?: string;
  geolocation?: {
    country: string;
    city: string;
  };
  device_info?: {
    type: 'mobile' | 'desktop';
    os: string;
    browser: string;
  };
  session_id?: string;
  risk_score?: number;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'blocked' | 'flagged';
}

interface PlatformAuditLogProps {
  logs: PlatformAuditEntry[];
  onExport?: () => void;
}

// Mock data for demonstration
const mockPlatformLogs: PlatformAuditEntry[] = [
  {
    id: '1',
    category: 'user_activity',
    event_type: 'user_login',
    user_id: 'user_123',
    user_email: 'john.doe@acme.com',
    timestamp: '2024-06-17 10:30:15',
    ip_address: '192.168.1.100',
    geolocation: { country: 'United States', city: 'New York' },
    device_info: { type: 'desktop', os: 'Windows 11', browser: 'Chrome 91' },
    session_id: 'sess_abc123',
    risk_score: 2,
    details: { mfa_success: true, login_method: 'email_password' },
    severity: 'low',
    status: 'success'
  },
  {
    id: '2',
    category: 'security_incident',
    event_type: 'failed_login_attempt',
    user_email: 'admin@platform.com',
    timestamp: '2024-06-17 10:25:30',
    ip_address: '203.0.113.45',
    geolocation: { country: 'Unknown', city: 'Unknown' },
    device_info: { type: 'desktop', os: 'Linux', browser: 'Unknown' },
    risk_score: 8,
    details: { reason: 'wrong_password', attempt_count: 5 },
    severity: 'high',
    status: 'blocked'
  },
  {
    id: '3',
    category: 'security_incident',
    event_type: 'unusual_behavior_detected',
    user_id: 'user_456',
    user_email: 'jane.smith@company.com',
    timestamp: '2024-06-17 10:20:45',
    ip_address: '198.51.100.22',
    geolocation: { country: 'Russia', city: 'Moscow' },
    device_info: { type: 'mobile', os: 'iOS 15', browser: 'Safari' },
    session_id: 'sess_def456',
    risk_score: 9,
    details: { anomaly_type: 'geo_location', previous_location: 'United States' },
    severity: 'critical',
    status: 'flagged'
  },
  {
    id: '4',
    category: 'user_activity',
    event_type: 'password_change',
    user_id: 'user_789',
    user_email: 'bob.wilson@startup.com',
    timestamp: '2024-06-17 09:15:20',
    ip_address: '192.168.1.50',
    geolocation: { country: 'Canada', city: 'Toronto' },
    device_info: { type: 'desktop', os: 'macOS', browser: 'Safari 14' },
    session_id: 'sess_ghi789',
    risk_score: 1,
    details: { trigger: 'user_initiated', old_password_age_days: 90 },
    severity: 'low',
    status: 'success'
  },
  {
    id: '5',
    category: 'security_incident',
    event_type: 'rate_limiting_triggered',
    timestamp: '2024-06-17 09:10:10',
    ip_address: '198.51.100.100',
    geolocation: { country: 'China', city: 'Beijing' },
    risk_score: 6,
    details: { endpoint: '/api/login', requests_per_minute: 100, action: 'blocked_ip' },
    severity: 'medium',
    status: 'blocked'
  },
  {
    id: '6',
    category: 'user_activity',
    event_type: 'session_end',
    user_id: 'user_123',
    user_email: 'john.doe@acme.com',
    timestamp: '2024-06-17 08:45:30',
    ip_address: '192.168.1.100',
    session_id: 'sess_abc123',
    risk_score: 1,
    details: { duration_minutes: 120, logout_type: 'user_initiated' },
    severity: 'low',
    status: 'success'
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'failure': return 'bg-red-100 text-red-800';
    case 'blocked': return 'bg-red-100 text-red-800';
    case 'flagged': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'user_activity': return <User className="w-4 h-4" />;
    case 'security_incident': return <Shield className="w-4 h-4" />;
    case 'system_event': return <Globe className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

const PlatformAuditLog: React.FC<PlatformAuditLogProps> = ({ logs = mockPlatformLogs, onExport }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Get unique values for filters
  const categories = useMemo(() => [...new Set(logs.map(log => log.category))], [logs]);
  const severities = useMemo(() => [...new Set(logs.map(log => log.severity))], [logs]);
  const statuses = useMemo(() => [...new Set(logs.map(log => log.status))], [logs]);

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = search === "" || 
        log.user_email?.toLowerCase().includes(search.toLowerCase()) ||
        log.event_type.toLowerCase().includes(search.toLowerCase()) ||
        log.ip_address?.toLowerCase().includes(search.toLowerCase()) ||
        JSON.stringify(log.details).toLowerCase().includes(search.toLowerCase());

      const matchesCategory = categoryFilter === "" || log.category === categoryFilter;
      const matchesSeverity = severityFilter === "" || log.severity === severityFilter;
      const matchesStatus = statusFilter === "" || log.status === statusFilter;
      
      const matchesTab = activeTab === "all" || 
        (activeTab === "user_activity" && log.category === "user_activity") ||
        (activeTab === "security" && log.category === "security_incident") ||
        (activeTab === "high_risk" && (log.severity === "high" || log.severity === "critical"));

      return matchesSearch && matchesCategory && matchesSeverity && matchesStatus && matchesTab;
    });
  }, [logs, search, categoryFilter, severityFilter, statusFilter, activeTab]);

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setSeverityFilter("");
    setStatusFilter("");
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Platform Audit Log
          </CardTitle>
          <div className="flex items-center gap-2">
            {onExport && (
              <Button size="sm" variant="outline" onClick={onExport}>
                <Download className="w-4 h-4 mr-1" />
                Export CSV
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full md:w-64"
          />
          
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border bg-card min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border bg-card min-w-[120px]"
          >
            <option value="">All Severities</option>
            {severities.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border bg-card min-w-[120px]"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {(search || categoryFilter || severityFilter || statusFilter) && (
            <Button size="icon" variant="ghost" onClick={clearFilters}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="user_activity">User Activity</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="high_risk">High Risk</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-3 py-2">Event</th>
                <th className="text-left px-3 py-2">User</th>
                <th className="text-left px-3 py-2">Time</th>
                <th className="text-left px-3 py-2">Location</th>
                <th className="text-left px-3 py-2">Device</th>
                <th className="text-left px-3 py-2">Risk</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(log.category)}
                      <div>
                        <div className="font-medium">{log.event_type.replace('_', ' ')}</div>
                        <Badge className={`text-xs ${getSeverityColor(log.severity)}`}>
                          {log.severity}
                        </Badge>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div>
                      <div className="font-medium">{log.user_email || 'System'}</div>
                      <div className="text-xs text-muted-foreground">{log.ip_address}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2">
                    {log.geolocation && (
                      <div className="text-xs">
                        <div>{log.geolocation.city}</div>
                        <div className="text-muted-foreground">{log.geolocation.country}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {log.device_info && (
                      <div className="text-xs">
                        <div>{log.device_info.type}</div>
                        <div className="text-muted-foreground">
                          {log.device_info.os} / {log.device_info.browser}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {log.risk_score !== undefined && (
                      <Badge variant={log.risk_score >= 7 ? "destructive" : log.risk_score >= 4 ? "secondary" : "outline"}>
                        {log.risk_score}/10
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-xs max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">
                    No audit records match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{filteredLogs.length}</div>
            <div className="text-xs text-muted-foreground">Total Events</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {filteredLogs.filter(l => l.severity === 'critical' || l.severity === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">
              {filteredLogs.filter(l => l.status === 'blocked' || l.status === 'flagged').length}
            </div>
            <div className="text-xs text-muted-foreground">Blocked/Flagged</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {new Set(filteredLogs.map(l => l.user_email).filter(Boolean)).size}
            </div>
            <div className="text-xs text-muted-foreground">Unique Users</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformAuditLog;
