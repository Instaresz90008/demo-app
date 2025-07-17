
import { Event, Service } from "../types";
import DayViewHeader from "./day-view/DayViewHeader";
import DayViewTimeGrid from "./day-view/DayViewTimeGrid";
import { useCalendarEvents } from "../hooks/useCalendarEvents";

interface DayViewProps {
  currentDate: Date;
  daysToDisplay: Date[];
  events: Event[];
  services: Service[];
  handleEventClick: (event: Event) => void;
  selectedServices?: string[];
  onEventUpdate?: (updatedEvent: Event) => void;
}

const DayView = ({ 
  currentDate, 
  daysToDisplay, 
  events, 
  services, 
  handleEventClick,
  selectedServices = [],
  onEventUpdate
}: DayViewProps) => {
  // Use our custom hook to manage events
  const { filteredEvents, getServiceColor } = useCalendarEvents(events, services, selectedServices);

  return (
    <div className="relative overflow-y-auto h-[700px] border-t">
      <DayViewHeader currentDate={currentDate} />
      
      <DayViewTimeGrid
        currentDate={currentDate}
        daysToDisplay={daysToDisplay}
        events={filteredEvents}
        services={services}
        handleEventClick={handleEventClick}
        getServiceColor={getServiceColor}
        onEventUpdate={onEventUpdate}
      />
    </div>
  );
};

export default DayView;
