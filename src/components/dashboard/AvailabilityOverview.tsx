
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays } from "date-fns";
import MagneticButton from './MagneticButton';

interface AvailabilityOverviewProps {
  days: Array<{
    date: Date;
    day: string;
    totalSlots: number;
    bookedSlots: number;
    availableSlots: number;
  }>;
  weekRange: string;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onNavigate: (path: string) => void;
  isToday: (date: Date) => boolean;
}

const AvailabilityOverview: React.FC<AvailabilityOverviewProps> = ({
  days,
  weekRange,
  onPreviousWeek,
  onNextWeek,
  onNavigate,
  isToday
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center text-foreground">
              <Calendar className="h-5 w-5 text-purple-500 mr-2" />
              Availability Overview
            </CardTitle>
            <CardDescription>Week of {weekRange}</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-3">
            {days.map((day, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + i * 0.07 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className={`border rounded-xl p-3 transition-all hover:shadow-md cursor-pointer ${
                  isToday(day.date)
                    ? "border-purple-300 bg-purple-500/80 text-white" 
                    : "border-border hover:border-purple-200 hover:bg-purple-50/30 bg-card text-card-foreground"
                }`}
              >
                <p className="text-sm font-semibold mb-1">{format(day.date, "MMM dd")}</p>
                <p className="font-bold text-lg mb-3">{day.day.substring(0, 3)}</p>
                
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium">{day.totalSlots} Slots</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 h-4">
                      {day.bookedSlots > 0 ? `${day.bookedSlots} Booked` : "Open"}
                    </Badge>
                  </div>
                  
                  <div className={`w-full h-2 rounded-full mt-1 mb-3 ${isToday(day.date) ? "bg-white/30" : "bg-muted"}`}>
                    <div className={`h-full rounded-full ${isToday(day.date) ? "bg-white/70" : "bg-purple-400"}`} style={{ width: `${(day.bookedSlots / day.totalSlots) * 100}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between mt-2 text-center">
                    <div>
                      <p className={`font-semibold text-xs ${isToday(day.date) ? "text-white" : "text-purple-600"}`}>{day.bookedSlots}</p>
                      <p className="text-xs">Booked</p>
                    </div>
                    <div>
                      <p className={`font-semibold text-xs ${isToday(day.date) ? "text-white" : "text-green-600"}`}>{day.availableSlots}</p>
                      <p className="text-xs">Free</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <MagneticButton 
            variant="ghost" 
            className="w-full mt-4 hover:bg-purple-50 hover:text-purple-700"
            onClick={() => onNavigate('/slot-broadcast')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add more availability slots
          </MagneticButton>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AvailabilityOverview;
