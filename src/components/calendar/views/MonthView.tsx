
import { isToday, format } from "date-fns";
import { Event, Service } from "../types";
import { getEventsForDate } from "../utils/event-utils";

interface MonthViewProps {
  daysToDisplay: Date[];
  events: Event[];
  services: Service[];
  handleEventClick: (event: Event) => void;
  currentDate: Date;
}

const MonthView = ({ 
  daysToDisplay, 
  events, 
  services, 
  handleEventClick, 
  currentDate 
}: MonthViewProps) => {
  return (
    <div className="grid grid-cols-7 gap-px bg-purple-500/20">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="bg-purple-600/10 py-2 text-center text-sm font-medium text-purple-300"
        >
          {day}
        </div>
      ))}
      
      {daysToDisplay.map((day, index) => {
        const dayEvents = getEventsForDate(events, day);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        
        return (
          <div
            key={index}
            className={`
              min-h-[100px] p-1 relative 
              ${isCurrentMonth ? "bg-gradient-to-br from-purple-600/15 to-purple-800/10" : "bg-purple-600/5 text-purple-500"}
              ${isToday(day) ? "bg-purple-600/25" : ""}
            `}
          >
            <div className="flex justify-between mb-1">
              <span
                className={`text-sm font-medium h-6 w-6 flex items-center justify-center
                  ${isToday(day) ? "bg-purple-500 text-white rounded-full" : isCurrentMonth ? "text-purple-200" : "text-purple-500"}
                `}
              >
                {format(day, "d")}
              </span>
            </div>
            
            {/* Events for the day */}
            <div className="space-y-1">
              {dayEvents.map(event => {
                const service = services.find(s => s.id === event.serviceId);
                
                return (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`
                      text-xs p-1 rounded cursor-pointer truncate
                      hover:bg-purple-600/20 text-purple-100
                    `}
                    style={{
                      borderLeftColor: service?.color,
                      backgroundColor: `${service?.color}15`,
                      borderLeftWidth: '2px',
                      borderLeftStyle: 'solid'
                    }}
                  >
                    <div className="font-medium">{event.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthView;
