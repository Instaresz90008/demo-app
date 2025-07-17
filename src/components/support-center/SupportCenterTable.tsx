
import React from "react";
import { SupportTicket } from "@/services/supportCenterService";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SupportCenterTableProps {
  tickets: SupportTicket[];
  onEdit: (ticket: SupportTicket) => void;
  onDelete: (ticket: SupportTicket) => void;
  onAdd: () => void;
  loading?: boolean;
}

const statusColor = {
  "Open": "text-green-700 dark:text-green-300 bg-green-500/20 border-green-500/30",
  "Closed": "text-muted-foreground bg-muted border-border",
  "In Progress": "text-blue-700 dark:text-blue-300 bg-blue-500/20 border-blue-500/30",
  "Resolved": "text-purple-700 dark:text-purple-300 bg-purple-500/20 border-purple-500/30"
};

const SupportCenterTable: React.FC<SupportCenterTableProps> = ({
  tickets, onEdit, onDelete, onAdd, loading
}) => {
  // Debug log to surface the tickets being received
  console.log("[SupportCenterTable] Received tickets prop:", tickets);

  // Get user (from localStorage, since we're not in a hook here)
  let userRole = 'unknown';
  try {
    const lsUser = JSON.parse(localStorage.getItem('redux') || '{}');
    userRole = lsUser?.user?.currentUser?.roles?.join(", ") || 'unknown';
  } catch { userRole = 'unknown'; }

  return (
    <div className="border border-border rounded-xl shadow-sm p-0 overflow-x-auto bg-card">
      {/* Debug: show number of tickets received and user role */}
      <span style={{ display: "none" }}>
        SupportCenterTable.tickets={tickets.length} | userRole={userRole}
      </span>
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="font-semibold text-lg">Support Tickets</div>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      {tickets.length === 0 && (
        <div className="bg-warning/10 border border-warning/20 text-foreground p-5 my-5 rounded text-center">
          <div className="font-semibold text-lg mb-2">No support tickets loaded</div>
          <div className="text-sm mb-2">
            <span>
              No tickets found for this account. <br />
              <b>Logged in role:</b> {userRole}
            </span>
            <div className="mt-2 text-xs text-muted-foreground">
              If you expected to see tickets, you may not be on the <b>/help</b> page,
              or your application's state did not initialize the mock data.
            </div>
          </div>
          {/* Visual debug for developer: show tickets array */}
          <pre className="mt-4 p-2 text-xs bg-muted border border-border rounded text-left overflow-x-auto max-w-full">
            {JSON.stringify(tickets, null, 2)}
          </pre>
        </div>
      )}
      <table className="table-auto w-full border-t border-border">
        <thead>
          <tr className="bg-muted/40 text-xs text-muted-foreground uppercase text-left rounded-t-xl">
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Priority</th>
            <th className="py-2 px-4">Category</th>
            <th className="py-2 px-4">Created</th>
            <th className="py-2 px-4">Last Updated</th>
            <th className="py-2 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? null : tickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-primary/5 transition rounded">
              <td className="p-4">{ticket.title}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[ticket.status]}`}>{ticket.status}</span>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  ticket.priority === "High" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300" :
                  ticket.priority === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300" :
                  "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                }`}>
                  {ticket.priority}
                </span>
              </td>
              <td className="p-4">{ticket.category}</td>
              <td className="p-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
              <td className="p-4">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
              <td className="p-4 flex justify-end gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(ticket)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => onDelete(ticket)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupportCenterTable;
