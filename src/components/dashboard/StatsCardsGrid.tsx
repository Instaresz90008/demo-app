
import React from 'react';
import MicroInteractiveCard from './MicroInteractiveCard';
import { Calendar, Clock, Users, Bell, DollarSign } from 'lucide-react';

interface StatsCardsGridProps {
  kpiData: {
    totalBookings: number;
    availableHours: number;
    uniqueClients: number;
    pendingRequests: number;
    slotsBooked: number;
  } | null;
  onNavigate: (path: string) => void;
}

const StatsCardsGrid: React.FC<StatsCardsGridProps> = ({ kpiData, onNavigate }) => {
  // Provide default values when kpiData is null
  const defaultKpiData = {
    totalBookings: 0,
    availableHours: 0,
    uniqueClients: 0,
    pendingRequests: 0,
    slotsBooked: 0
  };

  const data = kpiData || defaultKpiData;

  const statsConfig = [
    { 
      title: "Total Bookings", 
      value: data.totalBookings.toString(), 
      icon: <Calendar className="h-5 w-5" />, 
      trend: "+8% from last week", 
      trendUp: true, 
      onClick: () => onNavigate('/calendar') 
    },
    { 
      title: "Available Hours", 
      value: `${data.availableHours}h`, 
      icon: <Clock className="h-5 w-5" />, 
      trend: "12h remaining today", 
      trendUp: true, 
      onClick: () => onNavigate('/slot-broadcast') 
    },
    { 
      title: "Unique Clients", 
      value: data.uniqueClients.toString(), 
      icon: <Users className="h-5 w-5" />, 
      trend: "+3 new this month", 
      trendUp: true, 
      onClick: () => onNavigate('/unique-clients-report') 
    },
    { 
      title: "Pending Requests", 
      value: data.pendingRequests.toString(), 
      icon: <Bell className="h-5 w-5" />, 
      trend: "2 urgent need action", 
      trendUp: false, 
      onClick: () => onNavigate('/pending-requests') 
    },
    { 
      title: "Slots Booked", 
      value: `${data.slotsBooked}%`, 
      icon: <DollarSign className="h-5 w-5" />, 
      trend: "+12% from last week", 
      trendUp: true, 
      onClick: () => onNavigate('/reports') 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsConfig.map((stat, index) => (
        <MicroInteractiveCard 
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendUp={stat.trendUp}
          index={index}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
};

export default StatsCardsGrid;
