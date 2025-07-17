
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar"; // <- CORRECTED

interface Props {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onDelete?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
  canEdit: boolean;
  canDelete: boolean;
}

// EventType values: 'booking' | 'slot' | 'meeting' | 'block' | 'reminder'
const colorClass = (type: CalendarEvent["type"]) =>
  type === "booking"
    ? "bg-green-200 text-green-900 border-green-500"
    : type === "slot"
    ? "bg-blue-200 text-blue-900 border-blue-500"
    : type === "block"
    ? "bg-red-200 text-red-900 border-red-500"
    : type === "meeting"
    ? "bg-purple-200 text-purple-900 border-purple-500"
    : type === "reminder"
    ? "bg-pink-200 text-pink-900 border-pink-400"
    : "bg-gray-200 text-gray-800 border-gray-400";

function getDurationMins(start: string, end: string) {
  const startD = new Date(start);
  const endD = new Date(end);
  return Math.round((endD.getTime() - startD.getTime()) / 60000);
}

const EventInfoDialog = ({ event, open, onOpenChange, onDelete, onEdit, canEdit, canDelete }: Props) => {
  if (!event) return null;
  const dateStr = event.start?.slice(0,10);
  const startTime = event.start?.slice(11,16) || "—";
  const endTime = event.end?.slice(11,16) || "—";
  const duration = event.start && event.end ? getDurationMins(event.start, event.end) : "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="calendar-event-modal">
        <DialogHeader className="bg-background">
          <DialogTitle className="text-foreground">
            <span className="flex items-center gap-2">
              <Badge className={colorClass(event.type)}>{event.type}</Badge>
              <span>{event.title}</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-2 bg-background">
          <div className="text-sm font-medium text-foreground">Status: <span className="capitalize">{event.status}</span></div>
          <div className="text-sm text-foreground">
            Date: {dateStr} &nbsp;Time: {startTime} – {endTime}
          </div>
          <div className="text-sm text-foreground">Duration: {duration} mins</div>
          {event.description && (
            <div className="text-sm text-muted-foreground mt-2">Description: {event.description}</div>
          )}
        </div>
        <DialogFooter className="gap-2 justify-end bg-background">
          {canEdit && <Button size="sm" variant="outline" onClick={() => onEdit?.(event)}>Edit</Button>}
          {canDelete && <Button size="sm" variant="destructive" onClick={() => { onDelete?.(event); onOpenChange(false); }}>Delete</Button>}
          <Button size="sm" variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventInfoDialog;
