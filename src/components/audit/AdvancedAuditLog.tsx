
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface AdvancedAuditLogProps {
  logs: Array<{
    id: string;
    user: string;
    action: string;
    time: string;
    details?: string;
    ip?: string;
    summary?: string;
  }>;
  onExport?: () => void;
}

const getUnique = (arr: string[]) => [...new Set(arr)].filter(Boolean);

const AdvancedAuditLog: React.FC<AdvancedAuditLogProps> = ({ logs, onExport }) => {
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");

  // Populate filter options dynamically
  const users = useMemo(() => getUnique(logs.map(log => log.user)), [logs]);
  const actions = useMemo(() => getUnique(logs.map(log => log.action)), [logs]);

  // Filtering logic (applies all three: text search, user, action)
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Search (all columns)
      const matchesSearch = search === "" || 
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        (log.details?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (log.ip?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (log.summary?.toLowerCase().includes(search.toLowerCase()) ?? false);

      // User filter
      const matchesUser = userFilter === "" || log.user === userFilter;

      // Action filter
      const matchesAction = actionFilter === "" || log.action === actionFilter;

      return matchesSearch && matchesUser && matchesAction;
    });
  }, [logs, search, userFilter, actionFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <CardTitle>Advanced Audit Log</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs…"
            className="w-48"
          />
          <select
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border bg-card"
            style={{ minWidth: 120 }}
            aria-label="Filter by User"
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-1 text-sm rounded border bg-card"
            style={{ minWidth: 140 }}
            aria-label="Filter by Action"
          >
            <option value="">All Actions</option>
            {actions.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          {(userFilter || actionFilter || search) && (
            <Button
              size="icon"
              variant="ghost"
              aria-label="Clear all filters"
              onClick={() => { setUserFilter(""); setActionFilter(""); setSearch(""); }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              <Filter className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr>
                <th className="text-left px-2 py-1">User</th>
                <th className="text-left px-2 py-1">Action</th>
                <th className="text-left px-2 py-1">Summary</th>
                <th className="text-left px-2 py-1">Time</th>
                <th className="text-left px-2 py-1">Details</th>
                <th className="text-left px-2 py-1">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-primary/5">
                  <td className="px-2 py-1">{log.user}</td>
                  <td className="px-2 py-1">{log.action}</td>
                  <td className="px-2 py-1 text-primary font-semibold">{log.summary || log.action}</td>
                  <td className="px-2 py-1 text-muted-foreground">{log.time}</td>
                  <td className="px-2 py-1">{log.details}</td>
                  <td className="px-2 py-1 text-xs">{log.ip || <span className="text-muted-foreground">N/A</span>}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-3 text-center text-muted-foreground">No audit records match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedAuditLog;
