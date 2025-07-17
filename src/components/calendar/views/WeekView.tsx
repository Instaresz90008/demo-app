
import { isToday, parseISO, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Event, Service } from "../types";
import { formatTimeLabel, getEventsForTimeSlot, getStatusColor, calculateEventPosition } from "../utils/event-utils";
import { getTimeSlots } from "../utils/date-utils";

interface WeekViewProps {
  daysToDisplay: Date[];
  events: Event[];
  services: Service[];
  handleEventClick: (event: Event) => void;
}

const WeekView = ({ daysToDisplay, events, services, handleEventClick }: WeekViewProps) => {
  const timeSlots = getTimeSlots();
  const currentHour = new Date().getHours();

  return (
    <div className="relative overflow-y-scroll h-[700px] border-t border-purple-500/30">
      {/* Time slots column (left side) */}
      <div className="flex w-full">
        {/* Time labels column */}
        <div className="w-16 flex-none border-r border-purple-500/30 bg-purple-600/10">
          {/* Empty header cell */}
          <div className="h-14 border-b border-purple-500/30"></div>
          
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
        <div className="flex-grow grid grid-cols-1 md:grid-cols-7">
          {/* Header row with day names for week view or single day for day view */}
          {daysToDisplay.map((day, dayIndex) => (
            <div key={dayIndex} className="border-r border-purple-500/30 w-full">
              <div 
                className={`h-14 sticky top-0 z-10 bg-gradient-to-br from-purple-600/15 to-purple-800/10 p-1 text-center border-b border-purple-500/30 flex flex-col justify-center
                  ${isToday(day) ? 'bg-purple-600/25' : ''}`}
              >
                <div className="text-sm font-medium text-purple-300">{format(day, 'EEE')}</div>
                <div 
                  className={`text-xl mx-auto w-8 h-8 flex items-center justify-center
                    ${isToday(day) ? 'bg-purple-500 text-white rounded-full' : 'text-purple-200'}`}
                >
                  {format(day, 'd')}
                </div>
              </div>
              
              {/* Time slots for this day */}
              <div className="relative">
                {/* Time grid lines */}
                {timeSlots.map((hour) => (
                  <div 
                    key={hour} 
                    className={`h-14 border-b border-purple-500/20 relative
                      ${hour === currentHour && isToday(day) ? 'bg-purple-600/20' : ''}`}
                  >
                    {/* Current time indicator */}
                    {hour === currentHour && isToday(day) && (
                      <div className="absolute left-0 right-0 border-t-2 border-purple-400 z-10"></div>
                    )}
                    
                    {/* Events in this time slot */}
                    {getEventsForTimeSlot(events, day, hour).map((event) => {
                      const service = services.find(s => s.id === event.serviceId);
                      // Only render the event if it starts at this hour
                      if (parseISO(event.start).getHours() === hour) {
                        const position = calculateEventPosition(event, 98, 0);
                        
                        return (
                          <div
                            key={event.id}
                            className="absolute left-0 right-0 rounded px-2 overflow-hidden cursor-pointer shadow-sm border-l-4 z-20 mx-1"
                            style={{
                              top: position.top,
                              height: position.height,
                              borderLeftColor: service?.color || '#333',
                              backgroundColor: `${service?.color}15`,
                            }}
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="text-xs font-semibold truncate text-purple-100">{event.title}</div>
                            <div className="text-xs truncate text-purple-200">{format(parseISO(event.start), 'h:mm a')} - {format(parseISO(event.end), 'h:mm a')}</div>
                            <div className="flex justify-between text-xs">
                              <span className="truncate text-purple-200">{event.clientName}</span>
                              <Badge className={`${getStatusColor(event.status)} text-[10px] h-4`}>
                                {event.status}
                              </Badge>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
