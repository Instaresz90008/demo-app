
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarView } from "./types";

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: CalendarView;
  goToToday: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  setCurrentView: (view: CalendarView) => void;
}

const CalendarHeader = ({
  currentDate,
  currentView,
  goToToday,
  goToPrevious,
  goToNext,
  setCurrentView
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 enhanced-card">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToToday}
          className="border-purple-500/40 text-purple-300 hover:bg-purple-600/20"
        >
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={goToPrevious} className="text-purple-300 hover:bg-purple-600/20">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNext} className="text-purple-300 hover:bg-purple-600/20">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold gradient-text">
          {format(currentDate, currentView === "day" ? "MMMM d, yyyy" : 
                  currentView === "week" ? "'Week of' MMMM d, yyyy" : "MMMM yyyy")}
        </h2>
      </div>
      
      <div className="border rounded-md overflow-hidden flex border-purple-500/30">
        <Button 
          variant={currentView === "day" ? "default" : "ghost"}
          className={`rounded-none ${currentView === "day" ? "btn-rich" : "text-purple-300 hover:bg-purple-600/20"}`}
          size="sm"
          onClick={() => setCurrentView("day")}
        >
          Day
        </Button>
        <Button 
          variant={currentView === "week" ? "default" : "ghost"}
          className={`rounded-none ${currentView === "week" ? "btn-rich" : "text-purple-300 hover:bg-purple-600/20"}`}
          size="sm"
          onClick={() => setCurrentView("week")}
        >
          Week
        </Button>
        <Button 
          variant={currentView === "month" ? "default" : "ghost"}
          className={`rounded-none ${currentView === "month" ? "btn-rich" : "text-purple-300 hover:bg-purple-600/20"}`}
          size="sm"
          onClick={() => setCurrentView("month")}
        >
          Month
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
