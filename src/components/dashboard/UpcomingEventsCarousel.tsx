
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ChevronLeft, ChevronRight, Check, X, RotateCcw, Calendar, Phone, MessageSquare, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id?: string;
  title: string;
  time: string;
  duration: string;
  client: string;
  avatar: string;
  confirmed: boolean;
  status?: 'pending' | 'confirmed' | 'rejected';
}

interface UpcomingEventsCarouselProps {
  events: Event[];
}

const UpcomingEventsCarousel = ({ events }: UpcomingEventsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [eventStatuses, setEventStatuses] = useState<{[key: string]: string}>({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const { toast } = useToast();

  const visibleEvents = 3;
  const totalSlides = Math.ceil(events.length / visibleEvents);
  const currentEvents = events.slice(currentIndex * visibleEvents, (currentIndex + 1) * visibleEvents);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const handleEventAction = (eventIndex: number, action: 'approve' | 'reject' | 'propose') => {
    const globalIndex = currentIndex * visibleEvents + eventIndex;
    const event = events[globalIndex];
    const eventKey = `${globalIndex}`;
    
    if (action === 'reject') {
      setSelectedEventIndex(globalIndex);
      setShowRejectModal(true);
      return;
    }
    
    if (action === 'propose') {
      setSelectedEventIndex(globalIndex);
      setShowProposeModal(true);
      return;
    }
    
    setEventStatuses(prev => ({
      ...prev,
      [eventKey]: action
    }));

    toast({
      title: "Event Approved",
      description: `Appointment with ${event.client} has been confirmed.`,
    });
  };

  const handleRejectConfirm = () => {
    if (selectedEventIndex === null) return;
    
    const event = events[selectedEventIndex];
    const eventKey = `${selectedEventIndex}`;
    
    setEventStatuses(prev => ({
      ...prev,
      [eventKey]: 'reject'
    }));

    toast({
      title: "Event Rejected",
      description: `Appointment with ${event.client} has been rejected. ${rejectReason ? 'Reason: ' + rejectReason : 'Client will be notified.'}`,
    });
    
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedEventIndex(null);
  };

  const handleProposeConfirm = () => {
    if (selectedEventIndex === null) return;
    
    const event = events[selectedEventIndex];
    const eventKey = `${selectedEventIndex}`;
    
    setEventStatuses(prev => ({
      ...prev,
      [eventKey]: 'propose'
    }));

    toast({
      title: "New Time Proposed",
      description: `New time proposal sent to ${event.client} for ${proposedDate} at ${proposedTime}.`,
    });
    
    setShowProposeModal(false);
    setProposedDate('');
    setProposedTime('');
    setProposalMessage('');
    setSelectedEventIndex(null);
  };

  const getEventStatus = (eventIndex: number) => {
    const globalIndex = currentIndex * visibleEvents + eventIndex;
    return eventStatuses[`${globalIndex}`];
  };

  const getStatusDisplay = (event: Event, eventIndex: number) => {
    const status = getEventStatus(eventIndex);
    
    if (status === 'approve') {
      return <Badge className="bg-green-100 text-green-800 border-0 text-xs">Approved</Badge>;
    }
    if (status === 'reject') {
      return <Badge className="bg-red-100 text-red-800 border-0 text-xs">Rejected</Badge>;
    }
    if (status === 'propose') {
      return <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">New Time Proposed</Badge>;
    }
    
    if (event.confirmed) {
      return <Badge className="bg-green-100 text-green-800 border-0 text-xs">Confirmed</Badge>;
    }
    
    return <Badge variant="outline" className="text-amber-600 border-amber-300 text-xs">Pending</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Navigation Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex >= totalSlides - 1}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {currentEvents.map((event, i) => (
            <Card key={`${currentIndex}-${i}`} className="bg-card border border-border hover:border-purple-200 hover:bg-purple-50/30 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    event.confirmed ? 'bg-purple-500' : 'bg-gray-400'
                  }`}>
                    {event.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-1 text-foreground">{event.title}</p>
                    <div className="flex items-center justify-center text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <time>{event.time}</time>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{event.duration}</p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mb-3">
                    {getStatusDisplay(event, i)}
                  </div>
                  
                  {/* Action Buttons */}
                  {!event.confirmed && !getEventStatus(i) && (
                    <div className="flex space-x-1 w-full">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleEventAction(i, 'approve')}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleEventAction(i, 'reject')}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleEventAction(i, 'propose')}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Propose
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-md bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Reject Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectReason">Reason for rejection (optional)</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Let the client know why you're rejecting this appointment..."
                className="bg-background border-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRejectConfirm}>
                <X className="h-4 w-4 mr-1" />
                Reject Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Propose New Time Modal */}
      <Dialog open={showProposeModal} onOpenChange={setShowProposeModal}>
        <DialogContent className="sm:max-w-md bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Propose New Time
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposedDate">New Date</Label>
                <Input
                  id="proposedDate"
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="proposedTime">New Time</Label>
                <Select value={proposedTime} onValueChange={setProposedTime}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="proposalMessage">Message (optional)</Label>
              <Textarea
                id="proposalMessage"
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Add a message to explain the new time proposal..."
                className="bg-background border-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProposeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleProposeConfirm} disabled={!proposedDate || !proposedTime}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Propose New Time
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpcomingEventsCarousel;
