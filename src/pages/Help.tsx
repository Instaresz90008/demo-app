import React, { useState } from "react";

import { HelpCircle, Search, FileText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import supportCenterService, { SupportTicket } from "@/services/supportCenterService";
import SupportCenterTable from "@/components/support-center/SupportCenterTable";
import EditSupportDialog from "@/components/support-center/EditSupportDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Help = () => {
  const navigate = useNavigate();
  // Tickets state and support CRUD logic
  const [tickets, setTickets] = useState<SupportTicket[]>(supportCenterService.getTickets());
  React.useEffect(() => {
    console.log("[Help.tsx] Loaded SupportCenter tickets:", tickets);
  }, [tickets]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInitial, setEditInitial] = useState<SupportTicket | undefined>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // CRUD handlers
  const handleAdd = () => {
    setEditInitial(undefined);
    setAddDialogOpen(true);
  };

  const handleAddSubmit = (data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true);
    setTimeout(() => {
      const newTicket = supportCenterService.createTicket(data);
      setTickets(supportCenterService.getTickets());
      setLoading(false);
      setAddDialogOpen(false);
      toast({ title: "Support Ticket Created", description: `New support ticket "${newTicket.title}" added.` });
    }, 500);
  };

  const handleEdit = (ticket: SupportTicket) => {
    setEditInitial(ticket);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (data: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) => {
    if (!editInitial) return;
    setLoading(true);
    setTimeout(() => {
      supportCenterService.updateTicket(editInitial.id, data);
      setTickets(supportCenterService.getTickets());
      setLoading(false);
      setEditDialogOpen(false);
      toast({ title: "Support Ticket Updated", description: `Ticket "${data.title}" updated.` });
    }, 500);
  };

  const handleDelete = (ticket: SupportTicket) => {
    if (!window.confirm(`Delete the ticket "${ticket.title}"?`)) return;
    setLoading(true);
    setTimeout(() => {
      supportCenterService.deleteTicket(ticket.id);
      setTickets(supportCenterService.getTickets());
      setLoading(false);
      toast({ title: "Deleted", description: `Support ticket "${ticket.title}" removed.` });
    }, 500);
  };

  // UI
  return (
    <div className="animate-reveal" style={{ backgroundColor: 'var(--theme-background, rgb(250, 250, 250))' }}>
      <div className="enhanced-card rounded-xl shadow-sm border p-6 mb-6">
        <div className="text-left mb-8">
          <HelpCircle className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2 gradient-text">How can we help you?</h1>
          <p className="text-muted-foreground">Search our knowledge base or contact support</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            className="pl-10 py-6 text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="enhanced-card p-4 rounded-lg text-center interactive-glow">
            <FileText className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium mb-1">FAQs</h3>
            <p className="text-sm text-muted-foreground mb-3">Browse our frequently asked questions and guides</p>
            <Button 
              variant="link" 
              className="text-blue-600"
              onClick={() => navigate('/faq')}
            >
              Read FAQs
            </Button>
          </div>

          <div className="enhanced-card p-4 rounded-lg text-center interactive-glow">
            <ExternalLink className="mx-auto h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-medium mb-1">Community</h3>
            <p className="text-sm text-muted-foreground mb-3">Launching Soon in Beta</p>
            <Button variant="link" className="text-purple-600" disabled>Coming Soon</Button>
          </div>
        </div>

        {/* Support Center Support Tickets CRUD Table */}
        <SupportCenterTable
          tickets={tickets}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      <div className="enhanced-card rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4 gradient-text">Quick Help</h2>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I set up my availability?</h3>
            <p className="text-muted-foreground text-sm">
              You can set up your availability by navigating to the Slot Broadcast page and selecting the days and times you're available.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">How do I manage my bookings?</h3>
            <p className="text-muted-foreground text-sm">
              All your bookings can be managed from the Event Management dashboard, where you can view, edit, or cancel appointments.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Can I integrate with my calendar?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, Jusbook supports integration with Google Calendar, Microsoft Outlook, and other popular calendar services.
            </p>
          </div>
          <div className="pb-4">
            <h3 className="font-medium mb-2">How do I upgrade my account?</h3>
            <p className="text-muted-foreground text-sm">
              To upgrade your account, click on the "Upgrade now" button in the sidebar or navigate to the billing section in your account settings.
            </p>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialogs */}
      <EditSupportDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        title="New Support Ticket"
        onSubmit={handleAddSubmit}
        loading={loading}
      />
      <EditSupportDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialData={editInitial}
        title="Edit Support Ticket"
        onSubmit={handleEditSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Help;
