
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";

interface DayProps {
  date: Date;
  day: string;
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
}

const AvailabilityCard = () => {
  // Generate all 7 days of the current week
  const today = new Date();
  const weekStart = startOfWeek(today);
  
  const days: DayProps[] = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(weekStart, index);
    return {
      date,
      day: format(date, "EEEE"),
      totalSlots: 3,
      bookedSlots: index === 3 || index === 5 ? 1 : 0,
      availableSlots: index === 3 || index === 5 ? 2 : 3,
    };
  });

  return (
    <div className="relative overflow-hidden p-5 group transition-all duration-300 bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl rounded-3xl animate-reveal">
      {/* Subtle accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
      
      {/* Decorative sparkles */}
      <div className="absolute top-3 right-3 animate-particle-float">
        <Sparkles className="h-4 w-4 text-purple-400/60" />
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-white">
            Your Availability Overview
          </h3>
          <div className="flex space-x-1">
            <button className="p-1 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="h-5 w-5 text-white/80 hover:text-white" />
            </button>
            <button className="p-1 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <ArrowRight className="h-5 w-5 text-white/80 hover:text-white" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 w-full">
          {days.map((day) => (
            <div key={day.day} className="border border-white/10 hover:border-purple-400/30 rounded-2xl p-3 transition-all hover:shadow-md hover:bg-white/5 hover:scale-[1.02]">
              <p className="text-xs text-white/60">{format(day.date, "MMM dd")}</p>
              <p className="font-medium text-sm text-white">{day.day.substring(0, 3)}</p>
              
              <div className="mt-3 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-white/90">{day.totalSlots} Slots</span>
                </div>
                
                {/* Availability visualizer */}
                <div className="w-full bg-white/20 h-2 rounded-full mt-1.5 mb-2.5 overflow-hidden border border-white/10">
                  <div 
                    className="bg-purple-500 h-full rounded-full transition-all duration-300" 
                    style={{ width: `${(day.bookedSlots / day.totalSlots) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2">
                  <div className="text-center">
                    <p className="text-purple-400 font-medium text-xs">{day.bookedSlots}</p>
                    <p className="text-xs text-white/60">Booked</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-medium text-xs">{day.availableSlots}</p>
                    <p className="text-xs text-white/60">Free</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-center">
          <button className="text-purple-400 hover:text-purple-300 transition-all duration-300 hover:scale-105 font-medium">
            Add more availability slots →
          </button>
        </div>
      </div>
      
      {/* Interactive glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

export default AvailabilityCard;
