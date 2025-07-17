
export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "High" | "Medium" | "Low";
  category: "General" | "Technical" | "Billing" | "Feature Request";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

let tickets: SupportTicket[] = [
  {
    id: "1",
    title: "How to reset my password?",
    description: "Please provide instructions on resetting my password.",
    status: "Open",
    priority: "Medium",
    category: "General",
    assignedTo: "Support Team",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Cannot connect calendar",
    description: "Getting an error when attempting to connect Google Calendar.",
    status: "In Progress",
    priority: "High",
    category: "Technical",
    assignedTo: "Tech Team",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper function for deep clone
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

const supportCenterService = {
  getTickets(): SupportTicket[] {
    // Log for debug: show who is querying and tickets returned
    console.log("[SupportCenterService] getTickets called, tickets:", tickets);
    return clone(tickets);
  },
  createTicket(data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): SupportTicket {
    const newTicket: SupportTicket = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tickets.unshift(newTicket);
    console.log("[SupportCenterService] Ticket created:", newTicket);
    return clone(newTicket);
  },
  updateTicket(id: string, updates: Partial<Omit<SupportTicket, "id" | "createdAt">>): SupportTicket | null {
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) return null;
    const updated: SupportTicket = {
      ...tickets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    tickets[idx] = updated;
    console.log("[SupportCenterService] Ticket updated:", updated);
    return clone(updated);
  },
  deleteTicket(id: string): boolean {
    const idx = tickets.findIndex(t => t.id === id);
    if (idx === -1) return false;
    const deleted = tickets.splice(idx, 1);
    console.log("[SupportCenterService] Ticket deleted:", deleted[0]);
    return true;
  }
};

export default supportCenterService;
