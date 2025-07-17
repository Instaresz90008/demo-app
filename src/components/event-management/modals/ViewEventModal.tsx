
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Event } from "../data/mockData";
import { Calendar, Clock, Phone, User, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface ViewEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
}

const STATUS_STYLES: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  Scheduled: {
    icon: <CheckCircle2 className="inline-block text-green-500" size={19} />,
    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30",
    label: "Scheduled",
  },
  Completed: {
    icon: <CheckCircle2 className="inline-block text-blue-500" size={19} />,
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30",
    label: "Completed",
  },
  Cancelled: {
    icon: <XCircle className="inline-block text-red-500" size={19} />,
    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30",
    label: "Cancelled",
  },
  "No-Show": {
    icon: <AlertTriangle className="inline-block text-yellow-500" size={19} />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/30",
    label: "No-Show",
  },
};

const ViewEventModal: React.FC<ViewEventModalProps> = ({
  open,
  onOpenChange,
  event,
}) => {
  if (!event) return null;
  const statusStyle = STATUS_STYLES[event.status] || STATUS_STYLES["Scheduled"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-popover border-border text-popover-foreground z-50">
        <div className="relative">
          {/* HEADER */}
          <DialogHeader className="p-7 pb-1 flex flex-col gap-1 items-center">
            <div className="flex justify-center items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              <DialogTitle className="text-2xl font-bold text-foreground">Event Details</DialogTitle>
            </div>
            <DialogDescription>
              <span className="text-base font-medium text-muted-foreground">Details for <span className="font-semibold text-foreground">{event.serviceName}</span></span>
            </DialogDescription>
            <Badge className={`mt-3 px-5 py-2 font-medium rounded-2xl border ${statusStyle.color} flex gap-1 items-center text-base`}>
              {statusStyle.icon} {statusStyle.label}
            </Badge>
          </DialogHeader>

          {/* MAIN CONTENT */}
          <div className="px-8 py-6 md:grid md:grid-cols-2 gap-6 space-y-6 md:space-y-0">
            {/* LEFT COLUMN */}
            <div className="pr-4 border-r border-dashed border-border">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-primary" size={20} />
                <span className="font-semibold text-lg text-foreground">{event.clientName}</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Phone className="text-primary" size={19} />
                <span className="text-base text-muted-foreground">{event.contactNumber || "—"}</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{event.meetingType?.charAt(0) || ""}</span>
                </span>
                <span className="text-foreground">{event.meetingType}</span>
              </div>
              <div className="flex items-center mt-7 gap-2">
                <span className="text-sm text-muted-foreground">Time zone:</span>
                <Badge variant="outline" className="rounded-xl px-2 py-1 bg-muted text-muted-foreground border-border">{event.clientTimeZone}</Badge>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4 pl-0 md:pl-6">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary" size={19} />
                <span className="font-semibold text-foreground">{event.appointmentDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-primary" size={18}/>
                <Badge variant="secondary" className="px-2 py-1 bg-primary text-primary-foreground border-0 rounded-md">
                  {event.startTime} - {event.endTime}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block rounded bg-primary/10 text-primary px-2 font-medium">{event.serviceName}</span>
              </div>
            </div>
          </div>
          
          <div className="px-8 mb-4 flex justify-end">
            <DialogClose className="mt-3 rounded-2xl px-6 py-2 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition">
              Close
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventModal;
