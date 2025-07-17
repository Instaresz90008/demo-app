
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Trash2, User, Clock, RefreshCw } from 'lucide-react';
import { format, parseISO, differenceInHours, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
}

interface SlotGridProps {
  slots: SlotData[];
  selectedSlots: string[];
  onSlotSelection: (slotId: string) => void;
  onSlotView: (slot: SlotData) => void;
  onSlotEdit: (slot: SlotData) => void;
  onSlotDelete: (slotIds: string[]) => void;
  onSlotConvert?: (slotId: string) => void;
  duplicateSlots?: Set<string>;
}

// Improved color scheme with better contrast
const SLOT_STATUS_COLORS = {
  booked: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800',
  open: 'bg-sky-100 hover:bg-sky-200 border-sky-300 text-sky-800',
  cancelled: 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800',
  'no-show': 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800',
  completed: 'bg-green-100 hover:bg-green-200 border-green-300 text-green-800'
};

const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlots,
  onSlotSelection,
  onSlotView,
  onSlotEdit,
  onSlotDelete,
  onSlotConvert,
  duplicateSlots = new Set()
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const slotsPerPage = 45; // 5 x 9 grid
  const { toast } = useToast();
  
  // Sort slots chronologically by start time
  const sortedSlots = [...slots].sort((a, b) => 
    new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  
  const totalPages = Math.ceil(sortedSlots.length / slotsPerPage);
  
  const currentSlots = sortedSlots.slice(
    currentPage * slotsPerPage,
    (currentPage + 1) * slotsPerPage
  );

  const getSlotStatus = (slot: SlotData) => {
    if (slot.type === 'slot' && slot.status === 'scheduled') return 'open';
    return slot.status === 'scheduled' ? 'booked' : slot.status;
  };

  const getSlotColor = (slot: SlotData, isSelected: boolean) => {
    if (isSelected) return 'bg-red-500 hover:bg-red-600 border-red-600 text-white';
    const status = getSlotStatus(slot);
    return SLOT_STATUS_COLORS[status as keyof typeof SLOT_STATUS_COLORS] || SLOT_STATUS_COLORS.open;
  };

  const canDeleteSlot = (slot: SlotData) => {
    // Cannot delete completed or no-show slots
    if (slot.status === 'completed' || slot.status === 'no-show') {
      return false;
    }
    
    // Cannot delete cancelled slots in the past
    if (slot.status === 'cancelled' && isBefore(parseISO(slot.start), new Date())) {
      return false;
    }
    
    return true;
  };

  const canConvertSlot = (slot: SlotData) => {
    // Can convert cancelled slots in the future to open slots
    return slot.status === 'cancelled' && !isBefore(parseISO(slot.start), new Date());
  };

  const handleSlotClick = (slot: SlotData, event: React.MouseEvent) => {
    event.stopPropagation();
    onSlotSelection(slot.id);
  };

  const handleSlotAction = (action: string, slot: SlotData) => {
    switch (action) {
      case 'view':
        onSlotView(slot);
        break;
      case 'edit':
        onSlotEdit(slot);
        break;
      case 'delete':
        if (!canDeleteSlot(slot)) {
          toast({
            title: "Cannot Delete Slot",
            description: "Completed, no-show, or past cancelled slots cannot be deleted.",
            variant: "destructive"
          });
          return;
        }
        
        // Check if appointment is within 4 hours
        const hoursUntilAppointment = differenceInHours(parseISO(slot.start), new Date());
        if (slot.status === 'scheduled' && hoursUntilAppointment < 4) {
          toast({
            title: "Warning",
            description: "This appointment is less than 4 hours away. Please contact the client directly before canceling.",
          });
        }
        onSlotDelete([slot.id]);
        break;
      case 'convert':
        if (onSlotConvert) {
          onSlotConvert(slot.id);
          toast({
            title: "Slot Converted",
            description: "Cancelled slot has been converted to an open slot.",
          });
        }
        break;
    }
  };

  return (
    <div className="space-y-4">
      {/* Slot Grid */}
      <div className="grid grid-cols-5 gap-3 min-h-[400px]">
        {currentSlots.map((slot, index) => {
          const isSelected = selectedSlots.includes(slot.id);
          const status = getSlotStatus(slot);
          const deletable = canDeleteSlot(slot);
          const convertible = canConvertSlot(slot);
          const isDuplicate = duplicateSlots.has(slot.id);
          
          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="relative group"
            >
              {/* Duplicate Flag */}
              {isDuplicate && (
                <div className="absolute -top-1 -right-1 z-10 bg-red-500 text-white text-xs px-1 rounded-full border border-white shadow-sm">
                  DUP
                </div>
              )}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'w-full h-20 p-2 border-2 transition-all duration-200 cursor-pointer flex-1',
                    getSlotColor(slot, isSelected),
                    'hover:scale-105 active:scale-95 hover:shadow-md'
                  )}
                  onClick={(e) => handleSlotClick(slot, e)}
                >
                  <div className="text-center space-y-1 w-full">
                    <div className="text-xs font-semibold truncate">
                      {format(parseISO(slot.start), 'HH:mm')}
                    </div>
                    <div className="text-xs opacity-90 truncate">
                      {slot.serviceName || 'Available'}
                    </div>
                    {slot.attendeeName && (
                      <div className="text-xs opacity-80 truncate flex items-center justify-center gap-1">
                        <User className="h-2 w-2" />
                        {slot.attendeeName.split(' ')[0]}
                      </div>
                    )}
                    <Badge 
                      variant="secondary" 
                      className="text-[8px] px-1 py-0 bg-white/50 text-current border-0"
                    >
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                </Button>

                {/* Enhanced Three-dot menu with better visibility */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-6 p-0 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-32 bg-white border border-gray-200 shadow-xl z-[100] backdrop-blur-sm"
                    sideOffset={5}
                  >
                    <DropdownMenuItem 
                      onClick={() => handleSlotAction('view', slot)}
                      className="text-xs hover:bg-gray-50 cursor-pointer"
                    >
                      <Eye className="h-3 w-3 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleSlotAction('edit', slot)}
                      className="text-xs hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {convertible && (
                      <DropdownMenuItem 
                        onClick={() => handleSlotAction('convert', slot)}
                        className="text-xs text-blue-600 hover:bg-blue-50 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Convert to Open
                      </DropdownMenuItem>
                    )}
                    {deletable && (
                      <DropdownMenuItem 
                        onClick={() => handleSlotAction('delete', slot)}
                        className="text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                    {!deletable && (
                      <DropdownMenuItem 
                        disabled
                        className="text-xs text-gray-400 cursor-not-allowed"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Cannot Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          );
        })}
        
        {/* Fill empty slots to maintain grid structure */}
        {Array.from({ length: slotsPerPage - currentSlots.length }).map((_, index) => (
          <div key={`empty-${index}`} className="h-20" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {currentSlots.length} of {sortedSlots.length} slots 
        {selectedSlots.length > 0 && ` (${selectedSlots.length} selected)`}
      </div>
    </div>
  );
};

export default SlotGrid;
