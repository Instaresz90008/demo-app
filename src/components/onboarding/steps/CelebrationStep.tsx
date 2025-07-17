
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { previousStep, completeOnboarding, createServiceFromOnboarding } from '@/store/slices/onboardingSlice';
import serviceApi from '@/services/api/serviceApi';
import slotApi from '@/services/api/slotApi';
import { useToast } from '@/hooks/use-toast';
import { mapOnboardingToServiceData } from '@/store/slices/onboarding/utils';

const CelebrationStep: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data, loading } = useAppSelector(state => state.onboarding);
  const [countdown, setCountdown] = useState(5);
  const [serviceCreated, setServiceCreated] = useState(false);

  useEffect(() => {
    const createServiceAndSlots = async () => {
      try {
        // Create the service
        const serviceData = mapOnboardingToServiceData(data);
        const createdService = await serviceApi.createService(serviceData);
        
        // Create slots if any were defined
        if (data.serviceDetails.slots && data.serviceDetails.slots.length > 0) {
          const slotsData = {
            service_id: createdService.id,
            slots: data.serviceDetails.slots.map(slot => ({
              service_id: createdService.id,
              slot_date: slot.date,
              start_time: slot.startTime,
              end_time: slot.endTime,
              is_available: true
            }))
          };
          
          await slotApi.createSlots(slotsData);
        }
        
        // Complete onboarding
        await dispatch(completeOnboarding(data));
        
        setServiceCreated(true);
        
        toast({
          title: "🎉 Service Created Successfully!",
          description: `${data.serviceDetails.name} is now active and ready for bookings.`,
        });
        
      } catch (error) {
        console.error('Error creating service:', error);
        toast({
          title: "Error",
          description: "Failed to create service. Please try again.",
          variant: "destructive",
        });
      }
    };

    createServiceAndSlots();
  }, [dispatch, data, toast]);

  useEffect(() => {
    if (serviceCreated && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (serviceCreated && countdown === 0) {
      navigate('/dashboard');
    }
  }, [countdown, serviceCreated, navigate]);

  const handleFinish = () => {
    navigate('/dashboard');
  };

  const handleGoToServices = () => {
    navigate('/manage-services');
  };

  const handleGoToSlots = () => {
    navigate('/slot-broadcast');
  };

  const handleGoToBookingLinks = () => {
    navigate('/booking-links');
  };

  return (
    <div className="text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-green-400/30 rounded-full"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-6"
      >
        <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-yellow-500" />
          Congratulations!
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Your service "{data.serviceDetails.name}" has been created successfully!
        </p>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-primary font-medium">Setting up your service...</span>
            </div>
          </motion.div>
        )}

        {serviceCreated && (
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  🎯 Your service is now live and integrated across:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white dark:bg-card border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🔧</div>
                      <div className="font-medium">Manage Services</div>
                      <div className="text-sm text-muted-foreground">Active & Ready</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-card border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">📅</div>
                      <div className="font-medium">Time Slots</div>
                      <div className="text-sm text-muted-foreground">
                        {data.serviceDetails.slots?.length || 0} slots created
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-white dark:bg-card border-green-200 dark:border-green-800">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">🔗</div>
                      <div className="font-medium">Booking Links</div>
                      <div className="text-sm text-muted-foreground">Ready to Share</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-4"
            >
              <p className="text-primary font-medium">
                🚀 Redirecting to dashboard in {countdown} seconds...
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <Button onClick={handleFinish} className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
              
              <Button variant="outline" onClick={handleGoToServices}>
                Manage Services
              </Button>
              
              <Button variant="outline" onClick={handleGoToSlots}>
                View Slots
              </Button>
              
              <Button variant="outline" onClick={handleGoToBookingLinks}>
                Booking Links
              </Button>
            </motion.div>
          </>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="pt-6"
        >
          <Button
            variant="ghost"
            onClick={() => dispatch(previousStep())}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Preview
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CelebrationStep;
