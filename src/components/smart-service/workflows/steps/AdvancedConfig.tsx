
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { BookingType, PricingModel } from '@/types/smartService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateStepData } from '@/store/slices/workflowSlice';
import BookingManagement from './advanced-config/BookingManagement';
import PaymentSettings from './advanced-config/PaymentSettings';
import CommunicationSettings from './advanced-config/CommunicationSettings';
import MeetingPreferences from './advanced-config/MeetingPreferences';
import LoyaltyProgram from './advanced-config/LoyaltyProgram';

interface AdvancedConfigProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  onNext: () => void;
  onBack: () => void;
}

const AdvancedConfig: React.FC<AdvancedConfigProps> = ({
  bookingType,
  pricingModel,
  onNext,
  onBack
}) => {
  const dispatch = useAppDispatch();
  const { stepData } = useAppSelector((state) => state.workflow);
  
  const currentConfig = stepData['advanced-config'] || {
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minNoticeTime: 2,
    autoConfirm: true,
    allowRescheduling: true,
    requireDeposit: false,
    depositAmount: 25,
    cancellationPolicy: '24-hour',
    reminderSettings: {
      email: true,
      sms: false,
      timing: [24, 2]
    },
    meetingPreferences: {
      video: true,
      phone: true,
      inPerson: false,
      location: ''
    },
    loyaltyProgram: {
      enabled: false,
      pointsPerBooking: 10,
      discountThreshold: 100
    }
  };

  const updateConfig = (field: string, value: any) => {
    const updated = { ...currentConfig, [field]: value };
    dispatch(updateStepData({ 
      stepId: 'advanced-config', 
      data: updated 
    }));
  };

  const updateNestedConfig = (parent: string, field: string, value: any) => {
    const updated = {
      ...currentConfig,
      [parent]: {
        ...currentConfig[parent],
        [field]: value
      }
    };
    dispatch(updateStepData({ 
      stepId: 'advanced-config', 
      data: updated 
    }));
  };

  useEffect(() => {
    // Initialize config if not set
    if (!stepData['advanced-config']) {
      dispatch(updateStepData({ 
        stepId: 'advanced-config', 
        data: currentConfig 
      }));
    }
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold mb-2">Advanced Configuration</h2>
        <p className="text-muted-foreground">
          Fine-tune your {bookingType.name} service with {pricingModel.name} pricing
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BookingManagement
          config={currentConfig}
          onUpdate={updateConfig}
        />
        
        <PaymentSettings
          config={currentConfig}
          onUpdate={updateConfig}
        />
        
        <CommunicationSettings
          config={currentConfig}
          onUpdate={updateNestedConfig}
        />
        
        <MeetingPreferences
          config={currentConfig}
          onUpdate={updateNestedConfig}
        />
        
        <div className="lg:col-span-2">
          <LoyaltyProgram
            config={currentConfig}
            onUpdate={updateNestedConfig}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-between items-center pt-6"
      >
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Availability
        </Button>
        
        <Button onClick={onNext} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Continue to Summary
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default AdvancedConfig;
