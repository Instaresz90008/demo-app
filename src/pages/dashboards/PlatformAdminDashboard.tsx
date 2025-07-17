
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardData, setKpiData } from '@/store/slices/dashboardSlice';
import { setShowOnboarding, setCurrentStep } from '@/store/slices/onboardingSlice';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { BackgroundAnimation } from "@/components/dashboard/BackgroundAnimation";
import { ConfettiOverlay, useConfettiAnimation } from "@/components/ui/confetti";
import CreateBookingModal from "@/components/dashboard/CreateBookingModal";
import QuickBookingModal from "@/components/dashboard/QuickBookingModal";
import OnboardingContainer from "@/components/onboarding/OnboardingContainer";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import StatsCardsGrid from "@/components/dashboard/StatsCardsGrid";
import ChartsSection from "@/components/dashboard/ChartsSection";
import AvailabilityOverview from "@/components/dashboard/AvailabilityOverview";
import UpcomingEventsSection from "@/components/dashboard/UpcomingEventsSection";
import AINotification from "@/components/dashboard/AINotification";

import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const PlatformAdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { kpiData, pendingRequests } = useAppSelector(state => state.dashboard);
  const { data: onboardingData, showOnboarding } = useAppSelector(state => state.onboarding);
  
  const [userName] = useState("Anilkumar");
  const [organizationName] = useState("TechCorp Solutions");
  const [bookingVisitors, setBookingVisitors] = useState(3);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [showBestTimeNotification, setShowBestTimeNotification] = useState(true);
  const [createBookingOpen, setCreateBookingOpen] = useState(false);
  const [quickBookingOpen, setQuickBookingOpen] = useState(false);

  const showConfetti = useConfettiAnimation(showAchievement, 500, 3000);

  useEffect(() => {
    // Initialize KPI data if it's null
    if (!kpiData) {
      dispatch(setKpiData({
        totalBookings: 12,
        availableHours: 24,
        uniqueClients: 8,
        pendingRequests: 3,
        slotsBooked: 75
      }));
    }

    const interval = setInterval(() => {
      setBookingVisitors(Math.floor(Math.random() * 5) + 1);
    }, 30000);

    const timer = setTimeout(() => {
      setShowAchievement(true);
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [dispatch, kpiData]);

  const handleSmartBooking = () => {
    // Reset onboarding to start from step 1 (User Intent)
    dispatch(setCurrentStep(1));
    dispatch(setShowOnboarding(true));
    navigate('/onboarding');
  };

  const weeklyData = generateWeeklyData();
  
  const PAYMENT_DATA = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 1800 },
    { name: 'Fri', revenue: 2400 },
    { name: 'Sat', revenue: 1300 },
    { name: 'Sun', revenue: 800 },
  ];

  const today = new Date();
  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(currentWeekStart, index);
    return {
      date,
      day: format(date, "EEEE"),
      totalSlots: 3,
      bookedSlots: index === 3 || index === 5 ? 1 : 0,
      availableSlots: index === 3 || index === 5 ? 2 : 3,
    };
  });

  const upcomingEvents = [
    { 
      title: "Strategic Call with Marina", 
      time: "Today, 2:00 PM", 
      duration: "30 min", 
      client: "Marina Howard",
      avatar: "M",
      confirmed: true 
    },
    { 
      title: "Product Demo", 
      time: "Tomorrow, 11:00 AM", 
      duration: "45 min", 
      client: "David Lee",
      avatar: "D",
      confirmed: true 
    },
    { 
      title: "Consultation Session", 
      time: format(addDays(new Date(), 2), "EEE, MMM d") + ", 3:30 PM", 
      duration: "60 min", 
      client: "Sarah Johnson",
      avatar: "S",
      confirmed: false
    },
    { 
      title: "Team Meeting", 
      time: format(addDays(new Date(), 3), "EEE, MMM d") + ", 10:00 AM", 
      duration: "60 min", 
      client: "Tech Team",
      avatar: "T",
      confirmed: true 
    },
    { 
      title: "Client Review", 
      time: format(addDays(new Date(), 4), "EEE, MMM d") + ", 1:00 PM", 
      duration: "45 min", 
      client: "Alex Chen",
      avatar: "A",
      confirmed: true 
    },
    { 
      title: "Strategy Planning", 
      time: format(addDays(new Date(), 5), "EEE, MMM d") + ", 3:00 PM", 
      duration: "90 min", 
      client: "Business Unit",
      avatar: "B",
      confirmed: false
    },
    { 
      title: "Weekly Sync", 
      time: format(addDays(new Date(), 6), "EEE, MMM d") + ", 11:30 AM", 
      duration: "30 min", 
      client: "Project Team",
      avatar: "P",
      confirmed: true 
    }
  ];

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const formatWeekRange = () => {
    const weekEnd = addDays(currentWeekStart, 6);
    return `${format(currentWeekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
  };

  const isToday = (date: Date) => {
    return format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
  };

  return (
    <>
      <OnboardingContainer />
      
      <div className="space-y-6">
        <ConfettiOverlay active={showConfetti} />
        <BackgroundAnimation />

        <div className="space-y-6 py-6">
          {/* Enhanced Welcome Section with SmartBooking */}
          <div className="flex items-center justify-between">
            <WelcomeSection
              userName={userName}
              organizationName={organizationName}
              bookingVisitors={bookingVisitors}
              onCreateBooking={() => setCreateBookingOpen(true)}
            />
            <Button
              onClick={handleSmartBooking}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Zap className="h-5 w-5 mr-2" />
              SmartBooking
            </Button>
          </div>
          
          <StatsCardsGrid kpiData={kpiData} onNavigate={navigate} />

          <ChartsSection
            weeklyData={weeklyData}
            paymentData={PAYMENT_DATA}
            showAchievement={showAchievement}
            onNavigate={navigate}
          />

          <AvailabilityOverview
            days={days}
            weekRange={formatWeekRange()}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            onNavigate={navigate}
            isToday={isToday}
          />

          <UpcomingEventsSection
            events={upcomingEvents}
            onNavigate={navigate}
            onQuickBooking={() => setQuickBookingOpen(true)}
          />
        </div>
        
        <AINotification
          show={showBestTimeNotification}
          onHide={() => setShowBestTimeNotification(false)}
        />

        <CreateBookingModal 
          open={createBookingOpen} 
          onOpenChange={setCreateBookingOpen} 
        />
        <QuickBookingModal 
          open={quickBookingOpen} 
          onOpenChange={setQuickBookingOpen} 
        />
      </div>
    </>
  );
};

// Helper function to generate weekly data
function generateWeeklyData() {
  return [
    { date: 'Mon', bookings: 12, inquiries: 8 },
    { date: 'Tue', bookings: 19, inquiries: 15 },
    { date: 'Wed', bookings: 8, inquiries: 12 },
    { date: 'Thu', bookings: 15, inquiries: 10 },
    { date: 'Fri', bookings: 22, inquiries: 18 },
    { date: 'Sat', bookings: 17, inquiries: 14 },
    { date: 'Sun', bookings: 9, inquiries: 6 },
  ];
}

export default PlatformAdminDashboard;
