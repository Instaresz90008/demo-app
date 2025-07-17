
import React from 'react';
import { motion } from 'framer-motion';
import WeeklyBookingChart from './WeeklyBookingChart';
import PaymentRevenueChart from './PaymentRevenueChart';

interface ChartsSectionProps {
  weeklyData: Array<{ date: string; bookings: number; inquiries: number }>;
  paymentData: Array<{ name: string; revenue: number }>;
  showAchievement: boolean;
  onNavigate: (path: string) => void;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({
  weeklyData,
  paymentData,
  showAchievement,
  onNavigate
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <WeeklyBookingChart data={weeklyData} onNavigate={onNavigate} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        <PaymentRevenueChart data={paymentData} showAchievement={showAchievement} />
      </motion.div>
    </div>
  );
};

export default ChartsSection;
