
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2, Eye, EyeOff, RefreshCw, AlertTriangle, RotateCcw, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, parseISO, addDays, addHours, differenceInHours, isBefore, startOfDay, addMinutes } from 'date-fns';
import { useCalendarRbac } from "@/hooks/useCalendarRbac";
import { CalendarEvent, EventType } from "@/types/calendar";
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { motion, AnimatePresence } from 'framer-motion';
import SlotStatusFilter from './SlotStatusFilter';
import SlotDeleteDialog from './SlotDeleteDialog';
import GoogleCalendarSync from './GoogleCalendarSync';
import AddSlotDialog from './AddSlotDialog';
import SlotGrid from './SlotGrid';
import SlotDetailsModal from './SlotDetailsModal';
import ServiceFilter from './ServiceFilter';
import EmergencyDeleteDialog from './EmergencyDeleteDialog';
import DuplicateManagementDialog from './DuplicateManagementDialog';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

// Helper function to get ISO date string - moved before usage
const getIsoDate = (iso: string) => iso.slice(0, 10);

// Enhanced slot data structure that matches both SlotGrid and SlotDetailsModal expectations
interface SlotData {
  id: string;
  title: string;
  start: string;
  end: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  attendeeName?: string;
  attendeeEmail?: string;
  serviceName?: string;
  type: 'booking' | 'slot';
  description?: string;
  slotDuration: number;
}

// Service colors for better visual identification
const SERVICE_COLORS = {
  'Business Consultation': '#10b981', // emerald-500
  'Technical Support': '#3b82f6', // blue-500
  'Legal Advice': '#8b5cf6', // violet-500
  'Financial Planning': '#f59e0b', // amber-500
  'Career Coaching': '#ec4899', // pink-500
  'Available Slot': '#6b7280' // gray-500
};

// Generate comprehensive mock data with 1000+ slots
const generateMockSlots = (): SlotData[] => {
  const slots: SlotData[] = [];
  const services = [
    { name: 'Business Consultation', type: 'booking' as const },
    { name: 'Technical Support', type: 'booking' as const },
    { name: 'Legal Advice', type: 'booking' as const },
    { name: 'Financial Planning', type: 'booking' as const },
    { name: 'Career Coaching', type: 'booking' as const },
    { name: 'Available Slot', type: 'slot' as const }
  ];
  
  const statuses = ['scheduled', 'cancelled', 'no-show', 'completed'] as const;
  const names = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emily Davis', 'Chris Taylor', 'Lisa Anderson'];
  
  let idCounter = 1;
  
  // Generate slots for the next 60 days
  for (let dayOffset = -30; dayOffset < 30; dayOffset++) {
    const currentDate = addDays(new Date(), dayOffset);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    // Generate 15-25 slots per day
    const slotsPerDay = Math.floor(Math.random() * 11) + 15;
    
    for (let slotIndex = 0; slotIndex < slotsPerDay; slotIndex++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const startHour = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
      const startMinute = Math.random() < 0.5 ? 0 : 30;
      const duration = [30, 60, 90][Math.floor(Math.random() * 3)];
      
      const startTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
      const endTime = format(addHours(new Date(`${dateStr}T${startTime}`), duration / 60), 'HH:mm:ss');
      
      const isOpenSlot = service.type === 'slot' || Math.random() > 0.7;
      const attendeeName = isOpenSlot ? undefined : names[Math.floor(Math.random() * names.length)];
      
      slots.push({
        id: `slot-${idCounter++}`,
        title: isOpenSlot ? 'Available Slot' : `${service.name}`,
        type: service.type,
        start: `${dateStr}T${startTime}`,
        end: `${dateStr}T${endTime}`,
        status: isOpenSlot ? 'scheduled' : status,
        attendeeName: attendeeName,
        attendeeEmail: attendeeName ? `${attendeeName.toLowerCase().replace(' ', '.')}@example.com` : undefined,
        serviceName: service.name,
        slotDuration: duration
      });
    }
  }

  // Intentionally create some duplicates for testing
  const duplicateSlots = [
    {
      id: `slot-duplicate-1`,
      title: 'Business Consultation',
      type: 'booking' as const,
      start: `${format(new Date(), 'yyyy-MM-dd')}T10:00:00`,
      end: `${format(new Date(), 'yyyy-MM-dd')}T11:00:00`,
      status: 'scheduled' as const,
      attendeeName: 'John Duplicate',
      attendeeEmail: 'john.duplicate@example.com',
      serviceName: 'Business Consultation',
      slotDuration: 60
    },
    {
      id: `slot-duplicate-2`,
      title: 'Technical Support',
      type: 'booking' as const,
      start: `${format(new Date(), 'yyyy-MM-dd')}T10:00:00`,
      end: `${format(new Date(), 'yyyy-MM-dd')}T11:00:00`,
      status: 'scheduled' as const,
      attendeeName: 'Jane Duplicate',
      attendeeEmail: 'jane.duplicate@example.com',
      serviceName: 'Technical Support',
      slotDuration: 60
    }
  ];

  slots.push(...duplicateSlots);
  
  console.log(`Generated ${slots.length} slots`);
  return slots;
};

const ENHANCED_SLOT_DATA: SlotData[] = generateMockSlots();

const EnhancedCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<SlotData[]>(ENHANCED_SLOT_DATA);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [addSlotDialogOpen, setAddSlotDialogOpen] = useState(false);
  const [slotDetailsModal, setSlotDetailsModal] = useState<{
    open: boolean;
    slot: SlotData | null;
    mode: 'view' | 'edit';
  }>({ open: false, slot: null, mode: 'view' });
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [pendingDeleteSlots, setPendingDeleteSlots] = useState<string[]>([]);
  const [emergencyDeleteOpen, setEmergencyDeleteOpen] = useState(false);
  const [duplicateManagementOpen, setDuplicateManagementOpen] = useState(false);
  const [emergencyDeleteMode, setEmergencyDeleteMode] = useState(false);

  const { can } = useCalendarRbac();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get unique services with their colors
  const availableServices = [...new Set(slots.map(slot => slot.serviceName).filter(Boolean))] as string[];
  const servicesWithColors = availableServices.map(service => ({
    name: service,
    color: SERVICE_COLORS[service as keyof typeof SERVICE_COLORS] || SERVICE_COLORS['Available Slot']
  }));

  // Duplicate detection logic
  const getDuplicateSlots = (slots: SlotData[]) => {
    const duplicateIds = new Set<string>();
    const timeSlotMap = new Map<string, SlotData[]>();
    
    slots.forEach(slot => {
      const timeKey = `${getIsoDate(slot.start)}-${format(parseISO(slot.start), 'HH:mm')}`;
      if (!timeSlotMap.has(timeKey)) {
        timeSlotMap.set(timeKey, []);
      }
      timeSlotMap.get(timeKey)!.push(slot);
    });
    
    timeSlotMap.forEach(slotsAtTime => {
      if (slotsAtTime.length > 1) {
        slotsAtTime.forEach(slot => duplicateIds.add(slot.id));
      }
    });
    
    return duplicateIds;
  };

  const getDuplicateGroups = (slots: SlotData[]) => {
    const timeSlotMap = new Map<string, SlotData[]>();
    
    slots.forEach(slot => {
      const timeKey = `${format(parseISO(slot.start), 'MMM dd, HH:mm')} - ${format(parseISO(slot.end), 'HH:mm')}`;
      if (!timeSlotMap.has(timeKey)) {
        timeSlotMap.set(timeKey, []);
      }
      timeSlotMap.get(timeKey)!.push(slot);
    });
    
    const duplicateGroups: Array<{ timeSlot: string; slots: SlotData[] }> = [];
    timeSlotMap.forEach((slotsAtTime, timeKey) => {
      if (slotsAtTime.length > 1) {
        duplicateGroups.push({ timeSlot: timeKey, slots: slotsAtTime });
      }
    });
    
    return duplicateGroups;
  };

  const duplicateSlots = getDuplicateSlots(slots);
  const duplicateGroups = getDuplicateGroups(slots);

  // Filtering logic
  const filteredSlots = slots.filter(slot => {
    const statusMatch = selectedStatuses.length === 0 || 
      selectedStatuses.includes(slot.status === 'scheduled' ? 'booked' : slot.status);
    const serviceMatch = selectedServices.length === 0 || 
      selectedServices.includes(slot.serviceName || '');
    return statusMatch && serviceMatch;
  });

  const getSlotsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredSlots.filter(slot => getIsoDate(slot.start) === dateStr);
  };

  const getSlotsForMultipleDates = (dates: Date[]) => {
    const dateStrs = dates.map(date => format(date, 'yyyy-MM-dd'));
    return filteredSlots.filter(slot => dateStrs.includes(getIsoDate(slot.start)));
  };

  const handleSlotSelection = (slotId: string) => {
    setSelectedSlots(prev => 
      prev.includes(slotId) 
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSlotView = (slot: SlotData) => {
    setSlotDetailsModal({ open: true, slot, mode: 'view' });
  };

  const handleSlotEdit = (slot: SlotData) => {
    setSlotDetailsModal({ open: true, slot, mode: 'edit' });
  };

  const handleSlotSave = (updatedSlot: SlotData) => {
    setSlots(prev => prev.map(slot => 
      slot.id === updatedSlot.id ? updatedSlot : slot
    ));
    toast({
      title: "Slot Updated",
      description: "Slot information has been successfully updated.",
    });
  };

  const handleSlotConvert = (slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId 
        ? { ...slot, status: 'scheduled', type: 'slot', attendeeName: undefined, attendeeEmail: undefined }
        : slot
    ));
  };

  const handleSlotDelete = (slotIds: string[]) => {
    const slotsToCheck = slots.filter(slot => slotIds.includes(slot.id));
    const urgentSlots = slotsToCheck.filter(slot => {
      if (slot.status === 'scheduled' && slot.attendeeName) {
        const hoursUntilAppointment = differenceInHours(parseISO(slot.start), new Date());
        return hoursUntilAppointment < 4;
      }
      return false;
    });

    if (urgentSlots.length > 0) {
      setPendingDeleteSlots(slotIds);
      setWarningDialogOpen(true);
    } else {
      setDeleteDialogOpen(true);
      setSelectedSlots(slotIds);
    }
  };

  const handleDeleteSlots = (reason: string) => {
    const slotsToDelete = slots.filter(slot => selectedSlots.includes(slot.id));
    
    // Mock email notification
    slotsToDelete.forEach(slot => {
      if (slot.attendeeEmail) {
        console.log(`Sending cancellation email to ${slot.attendeeEmail} for slot ${slot.title}`);
        console.log(`Reason: ${reason}`);
      }
    });

    setSlots(prev => prev.filter(slot => !selectedSlots.includes(slot.id)));
    setSelectedSlots([]);
    setDeleteDialogOpen(false);

    toast({
      title: "Slots Deleted",
      description: `${slotsToDelete.length} slot(s) deleted successfully. Notifications sent to affected users.`,
    });
  };

  const handleAddSlot = (slotData: any) => {
    const newSlot: SlotData = {
      id: `slot-${Date.now()}`,
      title: slotData.title || 'New Slot',
      type: 'slot',
      start: `${slotData.date}T${slotData.startTime}:00`,
      end: `${slotData.date}T${slotData.endTime}:00`,
      status: 'scheduled',
      serviceName: slotData.serviceName,
      slotDuration: slotData.duration || 60
    };

    setSlots(prev => [...prev, newSlot]);
    setAddSlotDialogOpen(false);

    toast({
      title: "Slot Added",
      description: `New slot "${newSlot.title}" has been created successfully.`,
    });
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleCalendarDayClick = (date: Date) => {
    // Prevent selection of past dates
    if (isBefore(date, startOfDay(new Date()))) {
      return;
    }

    if (emergencyDeleteMode) {
      // Multi-date selection for emergency delete
      setSelectedDates(prev => {
        const isSelected = prev.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
        if (isSelected) {
          return prev.filter(d => format(d, 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd'));
        } else {
          return [...prev, date];
        }
      });
    } else {
      // Single date selection for normal mode
      setSelectedDate(date);
    }
  };

  const handleEmergencyDelete = () => {
    if (emergencyDeleteMode) {
      // Get slots from all selected dates
      const slotsFromSelectedDates = getSlotsForMultipleDates(selectedDates);
      const slotIds = slotsFromSelectedDates.map(slot => slot.id);
      setSelectedSlots(slotIds);
      setEmergencyDeleteOpen(true);
    } else {
      // Enable emergency delete mode
      setEmergencyDeleteMode(true);
      setSelectedDates([]);
      toast({
        title: "Emergency Delete Mode",
        description: "Select multiple dates to delete slots across different days.",
      });
    }
  };

  const handleClearAll = () => {
    setSelectedStatuses([]);
    setSelectedServices([]);
    setSelectedSlots([]);
    setSelectedDate(new Date());
    setSelectedDates([]);
    setEmergencyDeleteMode(false);
    toast({
      title: "Filters Cleared",
      description: "All filters and selections have been cleared.",
    });
  };

  const handleDuplicateManagement = (action: 'delete-extras' | 'reschedule-smart' | 'merge-slots') => {
    const duplicateGroups = getDuplicateGroups(slots);
    
    switch (action) {
      case 'delete-extras':
        // Keep first slot in each duplicate group, delete the rest
        const slotsToKeep = new Set<string>();
        const slotsToDelete = new Set<string>();
        
        duplicateGroups.forEach(group => {
          const sortedSlots = [...group.slots].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
          slotsToKeep.add(sortedSlots[0].id);
          sortedSlots.slice(1).forEach(slot => slotsToDelete.add(slot.id));
        });
        
        setSlots(prev => prev.filter(slot => !slotsToDelete.has(slot.id)));
        toast({
          title: "Duplicates Resolved",
          description: `Deleted ${slotsToDelete.size} duplicate slots, kept the earliest ones.`,
        });
        break;

      case 'reschedule-smart':
        // Reschedule duplicates to next available slots
        const updatedSlots = [...slots];
        
        duplicateGroups.forEach(group => {
          const sortedSlots = [...group.slots].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
          
          // Keep first slot, reschedule others
          for (let i = 1; i < sortedSlots.length; i++) {
            const slotToReschedule = sortedSlots[i];
            const originalStart = parseISO(slotToReschedule.start);
            
            // Find next available time (add 15 minutes for each duplicate)
            const newStart = addMinutes(originalStart, i * 15);
            const newEnd = addMinutes(newStart, slotToReschedule.slotDuration);
            
            const slotIndex = updatedSlots.findIndex(s => s.id === slotToReschedule.id);
            if (slotIndex !== -1) {
              updatedSlots[slotIndex] = {
                ...slotToReschedule,
                start: format(newStart, "yyyy-MM-dd'T'HH:mm:ss"),
                end: format(newEnd, "yyyy-MM-dd'T'HH:mm:ss")
              };
            }
          }
        });
        
        setSlots(updatedSlots);
        toast({
          title: "Smart Reschedule Complete",
          description: `Rescheduled ${duplicateGroups.reduce((sum, group) => sum + group.slots.length - 1, 0)} duplicate slots.`,
        });
        break;

      case 'merge-slots':
        // Merge only open/available slots, keep booked ones separate
        const mergedSlots = [...slots];
        
        duplicateGroups.forEach(group => {
          const openSlots = group.slots.filter(slot => !slot.attendeeName && slot.type === 'slot');
          const bookedSlots = group.slots.filter(slot => slot.attendeeName || slot.type === 'booking');
          
          if (openSlots.length > 1) {
            // Keep first open slot, remove others
            const slotToKeep = openSlots[0];
            const slotsToRemove = openSlots.slice(1);
            
            slotsToRemove.forEach(slot => {
              const index = mergedSlots.findIndex(s => s.id === slot.id);
              if (index !== -1) {
                mergedSlots.splice(index, 1);
              }
            });
          }
        });
        
        setSlots(mergedSlots);
        toast({
          title: "Slots Merged",
          description: "Merged compatible open slots while preserving all bookings.",
        });
        break;
    }
    
    setDuplicateManagementOpen(false);
  };

  const selectedDisplaySlots = emergencyDeleteMode 
    ? getSlotsForMultipleDates(selectedDates)
    : selectedDate 
      ? getSlotsForDate(selectedDate) 
      : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Slot & Booking Management</h1>
          <p className="text-muted-foreground">
            Manage your bookings and available slots ({slots.length} total slots)
            {duplicateGroups.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {duplicateGroups.length} duplicate conflicts
              </Badge>
            )}
            {emergencyDeleteMode && (
              <Badge variant="outline" className="ml-2 border-red-500 text-red-600">
                Emergency Delete Mode - Select dates
              </Badge>
            )}
          </p>
        </div>
        
        <div className="flex gap-3 flex-wrap items-center">
          {/* Filters and Controls */}
          <div className="flex gap-2 items-center">
            <SlotStatusFilter
              selectedStatuses={selectedStatuses}
              onStatusChange={setSelectedStatuses}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2"
            >
              {showCalendar ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showCalendar ? 'Hide' : 'Show'} Calendar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSyncDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Sync
            </Button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            {can("create_events") && (
              <Button 
                className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => navigate('/slot-broadcast')}
              >
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            )}
          </div>
          
          {/* Management Actions */}
          <div className="flex gap-2 items-center">
            {duplicateGroups.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDuplicateManagementOpen(true)}
                className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <AlertTriangle className="h-4 w-4" />
                Manage Duplicates ({duplicateGroups.length})
              </Button>
            )}
            
            <Button
              variant={emergencyDeleteMode ? "destructive" : "outline"}
              size="sm"
              onClick={handleEmergencyDelete}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {emergencyDeleteMode ? `Delete Selected (${selectedDates.length})` : 'Emergency Delete'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      {/* Service Filter */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium">Filter by Service:</span>
        {servicesWithColors.map((service) => {
          const isSelected = selectedServices.includes(service.name);
          
          return (
            <Button
              key={service.name}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleServiceToggle(service.name)}
              className="flex items-center gap-2 transition-all hover:scale-105"
            >
              <div 
                className="w-3 h-3 rounded-full border border-white shadow-sm"
                style={{ backgroundColor: service.color }}
              />
              {service.name}
              {isSelected && <Badge variant="secondary" className="ml-1 text-xs">✓</Badge>}
            </Button>
          );
        })}
        {selectedServices.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedServices([])}
            className="text-muted-foreground hover:text-foreground ml-2"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear Services
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Calendar View
                    {emergencyDeleteMode && (
                      <Badge variant="destructive" className="text-xs">
                        Multi-Select
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {emergencyDeleteMode ? (
                    <EnhancedCalendar
                      mode="multiple"
                      selected={selectedDates}
                      onDayClick={handleCalendarDayClick}
                      disabled={(date) => isBefore(date, startOfDay(new Date()))}
                      className="rounded-md border"
                      modifiers={{
                        hasSlots: (date) => !isBefore(date, startOfDay(new Date())) && getSlotsForDate(date).length > 0,
                        past: (date) => isBefore(date, startOfDay(new Date()))
                      }}
                      modifiersClassNames={{
                        hasSlots: 'relative bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 font-bold hover:from-emerald-100 hover:via-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gradient-to-r from-emerald-200 to-purple-200',
                        past: 'text-gray-300 bg-gray-50 cursor-not-allowed opacity-50',
                        selected: 'bg-red-100 border-red-500 text-red-700'
                      }}
                    />
                  ) : (
                    <EnhancedCalendar
                      mode="single"
                      selected={selectedDate}
                      onDayClick={handleCalendarDayClick}
                      disabled={(date) => isBefore(date, startOfDay(new Date()))}
                      className="rounded-md border"
                      modifiers={{
                        hasSlots: (date) => !isBefore(date, startOfDay(new Date())) && getSlotsForDate(date).length > 0,
                        past: (date) => isBefore(date, startOfDay(new Date()))
                      }}
                      modifiersClassNames={{
                        hasSlots: 'relative bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 font-bold hover:from-emerald-100 hover:via-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-gradient-to-r from-emerald-200 to-purple-200',
                        past: 'text-gray-300 bg-gray-50 cursor-not-allowed opacity-50',
                        selected: 'bg-primary text-primary-foreground'
                      }}
                    />
                  )}
                  
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"></div>
                      <span className="text-muted-foreground">Has slots</span>
                    </div>
                    {emergencyDeleteMode && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
                        <span className="text-muted-foreground">Selected for deletion</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className={showCalendar ? "lg:col-span-3" : "lg:col-span-4"}
          layout
          transition={{ duration: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {emergencyDeleteMode 
                    ? `Selected Dates (${selectedDates.length})`
                    : selectedDate 
                      ? format(selectedDate, 'EEEE, MMMM d, yyyy') 
                      : 'All Slots'
                  }
                  {selectedDisplaySlots.length > 0 && (
                    <Badge variant="secondary">
                      {selectedDisplaySlots.length} slot{selectedDisplaySlots.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {selectedSlots.length > 0 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSlotDelete(selectedSlots)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete ({selectedSlots.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedDisplaySlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {emergencyDeleteMode 
                    ? "Select dates from the calendar to view slots for deletion"
                    : "No slots available for this date"
                  }
                </div>
              ) : (
                <SlotGrid
                  slots={selectedDisplaySlots}
                  selectedSlots={selectedSlots}
                  onSlotSelection={handleSlotSelection}
                  onSlotView={handleSlotView}
                  onSlotEdit={handleSlotEdit}
                  onSlotDelete={handleSlotDelete}
                  onSlotConvert={handleSlotConvert}
                  duplicateSlots={duplicateSlots}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <AddSlotDialog
        open={addSlotDialogOpen}
        onOpenChange={setAddSlotDialogOpen}
        onAdd={handleAddSlot}
        selectedDate={selectedDate}
      />

      <SlotDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedSlots={selectedSlots.map(id => slots.find(slot => slot.id === id)!).filter(Boolean)}
        onConfirm={handleDeleteSlots}
      />

      <GoogleCalendarSync
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        onSync={() => {
          toast({
            title: "Google Calendar Sync",
            description: "Syncing with Google Calendar... (Demo mode)",
          });
        }}
      />

      <SlotDetailsModal
        open={slotDetailsModal.open}
        onOpenChange={(open) => setSlotDetailsModal(prev => ({ ...prev, open }))}
        slot={slotDetailsModal.slot}
        mode={slotDetailsModal.mode}
        onSave={handleSlotSave}
      />

      <Dialog open={warningDialogOpen} onOpenChange={setWarningDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Appointment Warning
            </DialogTitle>
            <DialogDescription>
              One or more selected appointments are scheduled within the next 4 hours. 
              Clients should be contacted directly before canceling these appointments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWarningDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => {
              setWarningDialogOpen(false);
              setSelectedSlots(pendingDeleteSlots);
              setDeleteDialogOpen(true);
              setPendingDeleteSlots([]);
            }}>
              Continue Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmergencyDeleteDialog
        open={emergencyDeleteOpen}
        onOpenChange={(open) => {
          setEmergencyDeleteOpen(open);
          if (!open) {
            setEmergencyDeleteMode(false);
            setSelectedDates([]);
          }
        }}
        selectedSlots={selectedSlots.map(id => slots.find(slot => slot.id === id)!).filter(Boolean)}
        onConfirm={(reason) => {
          const slotsToDelete = slots.filter(slot => selectedSlots.includes(slot.id));
          
          slotsToDelete.forEach(slot => {
            if (slot.attendeeEmail) {
              console.log(`EMERGENCY: Sending immediate cancellation email to ${slot.attendeeEmail} for slot ${slot.title}`);
              console.log(`Reason: ${reason}`);
            }
          });

          setSlots(prev => prev.filter(slot => !selectedSlots.includes(slot.id)));
          setSelectedSlots([]);
          setEmergencyDeleteOpen(false);
          setEmergencyDeleteMode(false);
          setSelectedDates([]);

          toast({
            title: "Emergency Delete Completed",
            description: `${slotsToDelete.length} slot(s) deleted immediately. Emergency notifications sent.`,
            variant: "destructive"
          });
        }}
      />

      <DuplicateManagementDialog
        open={duplicateManagementOpen}
        onOpenChange={setDuplicateManagementOpen}
        duplicateGroups={duplicateGroups}
        onResolve={handleDuplicateManagement}
      />
    </div>
  );
};

export default EnhancedCalendarView;
