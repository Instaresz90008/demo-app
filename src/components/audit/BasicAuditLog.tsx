
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BasicAuditLogProps {
  logs: Array<{
    id: string;
    user: string;
    action: string;
    time: string;
  }>;
}

const BasicAuditLog: React.FC<BasicAuditLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent audit records found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-2 py-1">User</th>
              <th className="text-left px-2 py-1">Action</th>
              <th className="text-left px-2 py-1">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-2 py-1">{log.user}</td>
                <td className="px-2 py-1">{log.action}</td>
                <td className="px-2 py-1 text-muted-foreground">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export default BasicAuditLog;
