
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Video, Phone, MapPin, Download, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BookingDetails {
  date: Date;
  time: string;
  meetingType: string;
  price: number;
  sessionTitle: string;
  hostName: string;
}

interface ConfirmationSuccessProps {
  bookingDetails: BookingDetails;
}

const ConfirmationSuccess: React.FC<ConfirmationSuccessProps> = ({ bookingDetails }) => {
  const getMeetingIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'audio': return <Phone className="w-5 h-5" />;
      case 'inperson': return <MapPin className="w-5 h-5" />;
      default: return <Video className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-3xl font-bold text-gray-900 mb-4"
        >
          Booking Confirmed!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600"
        >
          Your session has been successfully booked. Check your email for confirmation details.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900">Session Details</h3>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Date & Time</span>
                </div>
                <span className="font-semibold">
                  {bookingDetails.date.toLocaleDateString()} at {bookingDetails.time}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Session</span>
                </div>
                <span className="font-semibold">{bookingDetails.sessionTitle}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getMeetingIcon(bookingDetails.meetingType)}
                  <span className="font-medium">Meeting Type</span>
                </div>
                <span className="font-semibold capitalize">{bookingDetails.meetingType}</span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="font-bold text-lg">Total Paid</span>
                <span className="font-bold text-xl text-green-600">${bookingDetails.price}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 justify-center mt-8"
      >
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Receipt
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Confirmation
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationSuccess;
