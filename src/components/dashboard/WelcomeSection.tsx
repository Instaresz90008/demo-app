
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import OrganizationBadge from './OrganizationBadge';
import MagneticButton from './MagneticButton';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
  organizationName: string;
  bookingVisitors: number;
  onCreateBooking: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  organizationName,
  bookingVisitors,
  onCreateBooking
}) => {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-blue-500/10 p-6 backdrop-blur-sm border border-purple-200/20 shadow-sm"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-medium flex items-center text-foreground">
              {greeting}, {userName} <span className="ml-2 animate-wave">👋</span>
            </h1>
            <OrganizationBadge organizationName={organizationName} size="large" />
          </div>
          <p className="text-muted-foreground">Here's what's happening with your bookings today.</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col items-end space-y-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 px-3 py-1 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <Users className="w-3.5 h-3.5 mr-1" /> 
              {bookingVisitors} visitors browsing
            </Badge>
            <MagneticButton 
              className="bg-purple-600 hover:bg-purple-700 shadow-md text-white"
              onClick={onCreateBooking}
            >
              <Sparkles className="w-4 h-4 mr-2" /> Create Booking
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
