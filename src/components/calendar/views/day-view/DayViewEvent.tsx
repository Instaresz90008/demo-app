
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Event } from "../../types";
import { calculateEventPosition, getStatusColor } from "../../utils/event-utils";
import { useDraggable } from "@dnd-kit/core";

interface DayViewEventProps {
  event: Event;
  serviceColor: string;
  onEventClick: (event: Event) => void;
  onDragStart?: () => void;
  onDragEnd?: (event: any) => void;
}

const DayViewEvent = ({ 
  event, 
  serviceColor, 
  onEventClick,
  onDragStart,
  onDragEnd 
}: DayViewEventProps) => {
  const position = calculateEventPosition(event, 100, 0);
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${event.id}`,
    data: { event }
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50
  } : undefined;
  
  return (
    <div
      ref={setNodeRef}
      className="absolute left-0 right-0 rounded px-2 overflow-hidden cursor-move shadow-sm border-l-4 z-20 mx-1"
      style={{
        top: position.top,
        height: position.height,
        borderLeftColor: serviceColor,
        backgroundColor: `${serviceColor}15`,
        width: 'calc(100% - 8px)',
        ...style
      }}
      onClick={(e) => {
        e.stopPropagation();
        onEventClick(event);
      }}
      {...listeners}
      {...attributes}
    >
      <div className="text-sm font-semibold truncate">{event.title}</div>
      <div className="text-xs truncate">
        {format(parseISO(event.start), 'h:mm a')} - {format(parseISO(event.end), 'h:mm a')}
      </div>
      <div className="flex justify-between text-xs">
        <span className="truncate">{event.clientName}</span>
        <Badge className={`${getStatusColor(event.status)} text-[10px] h-4`}>
          {event.status}
        </Badge>
      </div>
    </div>
  );
};

export default DayViewEvent;
