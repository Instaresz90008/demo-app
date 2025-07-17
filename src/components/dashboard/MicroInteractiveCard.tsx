
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MicroInteractiveCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
  index?: number;
  onClick?: () => void;
}

const MicroInteractiveCard: React.FC<MicroInteractiveCardProps> = ({
  title, 
  value, 
  icon, 
  trend, 
  trendUp,
  index = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 border border-gray-700/50 hover:border-purple-500/30 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Subtle accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        <CardContent className="relative p-6 z-10">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-200">
                {title}
              </p>
              <motion.h3 
                className="text-3xl font-bold text-white group-hover:text-purple-200 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {value}
              </motion.h3>
              <div className={`flex items-center text-xs font-semibold transition-colors duration-200 ${
                trendUp ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-red-400 group-hover:text-red-300'
              }`}>
                {trendUp ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {trend}
              </div>
            </div>
            
            <motion.div 
              className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-white/20 hover:from-purple-500 hover:to-white/30 border border-purple-400/30 group-hover:border-purple-300/50 transition-all duration-300 shadow-sm"
              whileHover={{ 
                rotate: [0, -5, 5, 0],
                scale: 1.15
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-white group-hover:text-purple-100 transition-colors duration-200">
                {icon}
              </div>
            </motion.div>
          </div>
        </CardContent>
        
        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      </Card>
    </motion.div>
  );
};

export default MicroInteractiveCard;
