
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Search, Download, Filter, Eye, User, Shield, Building } from 'lucide-react';
import RequireRole from '@/components/auth/RequireRole';
import { accessAuditLogger } from '@/utils/accessAuditLogger';

const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);

  useEffect(() => {
    // Get logs from the audit logger
    const auditLogs = accessAuditLogger.getLogs();
    setLogs(auditLogs);
    setFilteredLogs(auditLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.featureId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.componentName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, actionFilter]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'check': return <Eye className="h-4 w-4" />;
      case 'grant': return <Shield className="h-4 w-4 text-green-500" />;
      case 'deny': return <Shield className="h-4 w-4 text-red-500" />;
      case 'track_usage': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string, result: boolean) => {
    if (action === 'grant' || (action === 'check' && result)) {
      return <Badge className="bg-green-100 text-green-800">Granted</Badge>;
    }
    if (action === 'deny' || (action === 'check' && !result)) {
      return <Badge variant="destructive">Denied</Badge>;
    }
    return <Badge variant="secondary">{action}</Badge>;
  };

  return (
    <RequireRole role="platform_admin" showUI>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">Security and access audit trail</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user ID, feature, or component..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="check">Access Check</SelectItem>
                  <SelectItem value="grant">Grant</SelectItem>
                  <SelectItem value="deny">Deny</SelectItem>
                  <SelectItem value="track_usage">Track Usage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Access Audit Trail ({filteredLogs.length} entries)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No audit logs found</p>
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      {getActionIcon(log.action)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{log.featureId}</span>
                          {getActionBadge(log.action, log.result)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          User: {log.userId} • Component: {log.componentName || 'N/A'}
                        </div>
                        {log.reason && (
                          <div className="text-sm text-red-600 mt-1">
                            Reason: {log.reason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      {log.evaluationTime && (
                        <div className="text-xs text-muted-foreground">
                          {log.evaluationTime}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
};

export default AuditLogsPage;
