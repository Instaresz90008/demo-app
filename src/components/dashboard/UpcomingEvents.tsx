
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays, isToday, isTomorrow, isSameDay, addMinutes, isPast } from "date-fns";
import { Check, X, CalendarCheck, User, MessageSquare, Clock, Link, Info, ChevronLeft, ChevronRight, Share, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

// Generate more comprehensive mock data for upcoming events
const generateUpcomingEvents = () => {
  const events = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const eventDate = addDays(today, Math.floor(i / 2));
    events.push({
      id: i + 1,
      title: [
        "Strategy Meeting", "Product Demo", "Team Standup", "Client Review", 
        "Consultation Session", "Planning Call", "Design Review", "Technical Discussion",
        "Project Kickoff", "Performance Review", "Training Session", "Brainstorming Session"
      ][i % 12],
      date: addMinutes(eventDate, Math.random() * 480 + 480), // Random time between 8 AM and 4 PM
      duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
      client: [
        "Acme Corp", "Globex Inc", "Wayne Enterprises", "Stark Industries", 
        "Umbrella Corp", "Oscorp", "LexCorp", "Daily Planet", "Internal"
      ][Math.floor(Math.random() * 9)],
      contactPerson: [
        "John Smith", "Sarah Johnson", "Michael Brown", "Emma Davis", 
        "David Wilson", "Lisa Anderson", "James Taylor", "Maria Garcia"
      ][Math.floor(Math.random() * 8)],
      contactRole: ["CEO", "Product Manager", "CTO", "Designer", "Developer", "Director"][Math.floor(Math.random() * 6)],
      status: Math.random() > 0.7 ? "pending" : "confirmed",
      questions: Math.random() > 0.5 ? ["What are your key objectives?", "What challenges are you facing?"] : [],
      meetingLink: `meet.google.com/${Math.random().toString(36).substr(2, 12)}`,
      notes: [
        "Prepare quarterly business review slides", "Demo the new analytics dashboard", 
        "Weekly progress update", "Review project requirements", "Discuss next steps"
      ][Math.floor(Math.random() * 5)]
    });
  }
  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

const UpcomingEvents = () => {
  const navigate = useNavigate();
  const [allEvents] = useState(generateUpcomingEvents());
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 7;
  
  // Generate next 7 days for the date bar
  const today = new Date();
  const nextDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(today, index);
    return {
      date,
      day: format(date, "EEE"),
      label: isToday(date) ? "Today" : isTomorrow(date) ? "Tomorrow" : format(date, "MMM d"),
    };
  });

  // Add state for selected day
  const [selectedDay, setSelectedDay] = useState(today);

  // Filter events based on selected day
  const dayFilteredEvents = allEvents.filter(event => 
    isSameDay(event.date, selectedDay)
  );

  // Paginate events - show 7 at a time
  const totalPages = Math.ceil(dayFilteredEvents.length / eventsPerPage);
  const startIndex = currentPage * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const paginatedEvents = dayFilteredEvents.slice(startIndex, endIndex);

  // Handle day selection
  const handleDayClick = (date: Date) => {
    setSelectedDay(date);
    setCurrentPage(0); // Reset to first page when changing day
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Event action handlers
  const handleAccept = (eventId: number) => {
    toast({
      title: "Event Accepted",
      description: "The event has been confirmed in your calendar.",
    });
  };

  const handleReject = (eventId: number) => {
    toast({
      title: "Event Rejected", 
      description: "The event has been declined and removed from your calendar.",
    });
  };

  const handleProposeNewTime = (eventId: number) => {
    toast({
      title: "Propose New Time",
      description: "Opening time selection dialog...",
    });
  };

  // Share functionality
  const handleShare = () => {
    const shareData = {
      title: 'My Upcoming Events',
      text: `I have ${dayFilteredEvents.length} events scheduled for ${format(selectedDay, 'EEEE, MMMM d')}`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`);
      toast({
        title: "Shared!",
        description: "Event details copied to clipboard.",
      });
    }
  };

  // View all appointments with filter
  const handleViewAllAppointments = () => {
    // Navigate to calendar with upcoming filter
    navigate('/calendar?filter=upcoming');
  };

  return (
    <div className="relative overflow-hidden group transition-all duration-300 bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl rounded-3xl">
      {/* Subtle accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              Upcoming Events
              {totalPages > 1 && (
                <span className="text-sm text-white/60">
                  ({startIndex + 1}-{Math.min(endIndex, dayFilteredEvents.length)} of {dayFilteredEvents.length})
                </span>  
              )}
            </CardTitle>
            <CardDescription className="text-white/70">Your schedule for the next few days</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage >= totalPages - 1}
                  className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <CalendarCheck className="h-5 w-5 text-purple-400" />
          </div>
        </div>
      </CardHeader>
      
      {/* Date Bar */}
      <div className="px-6 pb-3 relative z-10">
        <div className="flex justify-between">
          {nextDays.map((day) => (
            <div 
              key={day.label} 
              className={`text-center cursor-pointer px-3 py-2 rounded-lg transition-colors duration-200 ${
                isSameDay(day.date, selectedDay) ? "bg-purple-500 text-white" : "hover:bg-white/10 text-white/80 hover:text-white"
              }`}
              onClick={() => handleDayClick(day.date)}
            >
              <p className="text-xs font-medium">{day.label}</p>
              <p className="text-lg font-semibold mt-1">{day.day}</p>
            </div>
          ))}
        </div>
      </div>
      
      <CardContent className="space-y-3 pt-3 relative z-10">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => {
            const eventIsPast = isPast(event.date);
            
            return (
              <div 
                key={event.id}
                className="rounded-lg p-4 hover:bg-white/5 transition-colors duration-200"
              >
                <div className="grid grid-cols-12 gap-3">
                  {/* Event Title and Time - Takes 3/12 of the width */}
                  <div className="col-span-3">
                    <h4 className="font-medium text-base text-white">{event.title}</h4>
                    <div className="flex items-center text-sm text-white/60 mt-1">
                      <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>{format(event.date, "h:mm a")} • {event.duration}m</span>
                    </div>
                  </div>
                  
                  {/* Date - Takes 2/12 of the width */}
                  <div className="col-span-2 flex items-center">
                    <div className="text-sm text-white/60">
                      {format(event.date, "EEE, MMM d")}
                    </div>
                  </div>
                  
                  {/* Client/Contact - Takes 3/12 of the width */}
                  <div className="col-span-3 flex items-center">
                    <User className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-white/60" />
                    <div className="text-sm">
                      <span className="font-medium text-white">{event.contactPerson}</span>
                      {event.contactRole && 
                        <span className="text-white/60"> • {event.contactRole}</span>
                      }
                      {event.client !== "Internal" && 
                        <div className="text-white/60 text-xs">{event.client}</div>
                      }
                    </div>
                  </div>
                  
                  {/* Meeting Details - Takes 3/12 of the width */}
                  <div className="col-span-3">
                    <div className="flex space-x-2 flex-wrap">
                      {/* Meeting Link */}
                      {event.meetingLink && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-blue-400 px-2 py-1 bg-blue-500/20 rounded-md cursor-pointer">
                                <Link className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate max-w-[80px]">Join</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">{event.meetingLink}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {/* Questions Badge */}
                      {event.questions && event.questions.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="flex items-center text-xs text-amber-400 px-2 py-1 bg-amber-500/20 rounded-md cursor-help">
                              <MessageSquare className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span>{event.questions.length}</span>
                            </div>
                          </PopoverTrigger>
                          <PopoverContent className="w-72 p-2 bg-gray-900 border-none">
                            <h5 className="font-medium mb-1 text-white">Questions:</h5>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-white/80">
                              {event.questions.map((q, i) => (
                                <li key={i}>{q}</li>
                              ))}
                            </ul>
                          </PopoverContent>
                        </Popover>
                      )}
                      
                      {/* Notes Badge */}
                      {event.notes && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-xs text-green-400 px-2 py-1 bg-green-500/20 rounded-md cursor-help">
                                <Info className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span>Notes</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">{event.notes}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions - Takes 1/12 of the width and moved to the end */}
                  <div className="col-span-1 flex items-center justify-end">
                    {eventIsPast ? (
                      <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full">
                        Past
                      </span>
                    ) : (
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleReject(event.id)}
                                className="h-6 w-6 p-0 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">Reject</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="sm"
                                variant="ghost"
                                onClick={() => handleProposeNewTime(event.id)}
                                className="h-6 w-6 p-0 rounded-full text-amber-400 hover:text-amber-300 hover:bg-amber-500/20"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">Propose New Time</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {event.status === "pending" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleAccept(event.id)}
                                  className="h-6 w-6 p-0 rounded-full text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                <p className="text-xs">Accept</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* End of grid */}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 rounded-lg">
            <p className="text-white/60">No events scheduled for {format(selectedDay, 'EEEE, MMMM d')}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="relative z-10 flex gap-2">
        <Button 
          variant="ghost" 
          onClick={handleViewAllAppointments}
          className="flex-1 text-purple-400 hover:bg-white/10 hover:text-purple-300 transition-colors duration-200" 
          size="sm"
        >
          <Calendar className="h-4 w-4 mr-1" />
          View All Appointments
        </Button>
        <Button 
          variant="ghost" 
          onClick={handleShare}
          className="text-purple-400 hover:bg-white/10 hover:text-purple-300 transition-colors duration-200" 
          size="sm"
        >
          <Share className="h-4 w-4" />
        </Button>
      </CardFooter>
      
      {/* Interactive glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default UpcomingEvents;
