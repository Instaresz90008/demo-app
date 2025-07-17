
import { isToday, parseISO } from "date-fns";
import { Event, Service } from "../../types";
import { formatTimeLabel } from "../../utils/event-utils";
import { getTimeSlots } from "../../utils/date-utils";
import { getEventsForTimeSlot } from "../../utils/event-utils";
import DayViewEvent from "./DayViewEvent";
import { useDroppable } from "@dnd-kit/core";
import { useDraggableEvents } from "../../hooks/useDraggableEvents";

interface DayViewTimeGridProps {
  currentDate: Date;
  daysToDisplay: Date[];
  events: Event[];
  services: Service[];
  handleEventClick: (event: Event) => void;
  getServiceColor: (serviceId: string) => string;
  onEventUpdate?: (updatedEvent: Event) => void;
}

const DayViewTimeGrid = ({
  currentDate,
  daysToDisplay,
  events,
  handleEventClick,
  getServiceColor,
  onEventUpdate
}: DayViewTimeGridProps) => {
  const timeSlots = getTimeSlots();
  const currentHour = new Date().getHours();
  const { isDragging, setIsDragging, handleEventDrop } = useDraggableEvents(events, onEventUpdate);

  return (
    <div className="flex w-full">
      {/* Time labels column */}
      <div className="w-16 flex-none border-r border-purple-500/30 bg-purple-600/10">
        {/* Time labels */}
        {timeSlots.map((hour) => (
          <div 
            key={hour} 
            className={`h-14 relative border-b border-purple-500/20 text-xs flex items-start justify-end pr-2 pt-1 
            ${hour === currentHour ? 'bg-purple-600/20' : ''}`}
          >
            <span className="text-purple-400">{formatTimeLabel(hour)}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid with events */}
      <div className="flex-grow">
        {daysToDisplay.map((day, dayIndex) => (
          <div key={dayIndex} className="relative w-full">
            {/* Time slots for this day */}
            <div className="relative w-full">
              {/* Time grid lines */}
              {timeSlots.map((hour) => {
                // Create a droppable area for each hour slot
                const { setNodeRef: setDroppableRef } = useDroppable({
                  id: `droppable-${dayIndex}-${hour}`,
                  data: { day, hour }
                });
                
                return (
                  <div 
                    ref={setDroppableRef}
                    key={hour} 
                    className={`h-14 border-b border-purple-500/20 relative
                      ${hour === currentHour && isToday(day) ? 'bg-purple-600/20' : ''}
                      ${isDragging ? 'bg-purple-600/10' : ''}`}
                  >
                    {/* Current time indicator */}
                    {hour === currentHour && isToday(day) && (
                      <div className="absolute left-0 right-0 border-t-2 border-purple-400 z-10"></div>
                    )}
                    
                    {/* Events in this time slot */}
                    {getEventsForTimeSlot(events, day, hour).map((event) => {
                      // Only render the event if it starts at this hour
                      if (parseISO(event.start).getHours() === hour) {
                        const serviceColor = getServiceColor(event.serviceId);
                        
                        return (
                          <DayViewEvent
                            key={event.id}
                            event={event}
                            serviceColor={serviceColor}
                            onEventClick={handleEventClick}
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={(dragEvent) => {
                              setIsDragging(false);
                              const { over } = dragEvent;
                              if (over) {
                                const { day, hour } = over.data.current as { day: Date, hour: number };
                                handleEventDrop(event, hour, day);
                              }
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayViewTimeGrid;
