
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, QrCode } from 'lucide-react';
import UpcomingEventsCarousel from './UpcomingEventsCarousel';
import MagneticButton from './MagneticButton';

interface UpcomingEvent {
  title: string;
  time: string;
  duration: string;
  client: string;
  avatar: string;
  confirmed: boolean;
}

interface UpcomingEventsSectionProps {
  events: UpcomingEvent[];
  onNavigate: (path: string) => void;
  onQuickBooking: () => void;
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events,
  onNavigate,
  onQuickBooking
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center text-foreground">
              <Clock className="h-5 w-5 text-blue-500 mr-2" />
              Upcoming Events
            </CardTitle>
            <Badge variant="outline" className="font-normal text-foreground border-border">Next 48h</Badge>
          </div>
          <CardDescription className="text-muted-foreground">Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingEventsCarousel events={events} />
          
          <div className="mt-6 flex justify-between items-center">
            <MagneticButton 
              variant="outline" 
              className="flex-1 mr-4"
              onClick={() => onNavigate('/calendar')}
            >
              View all appointments <ArrowRight className="ml-2 h-4 w-4" />
            </MagneticButton>
            
            <div className="flex-1 p-3 bg-gray-50 dark:bg-white/10 rounded-lg border border-border">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm flex items-center text-foreground">
                  <QrCode className="h-4 w-4 mr-1 text-blue-400" />
                  Quick Booking Links
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-2 text-xs border-border"
                  onClick={onQuickBooking}
                >
                  View All
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Multiple active booking links with QR codes</p>
              <div className="text-xs bg-card p-2 rounded border border-border truncate text-blue-600 dark:text-blue-300">
                4 active links • Share QR codes instantly
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingEventsSection;
