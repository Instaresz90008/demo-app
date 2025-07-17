
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createAndPublishService, resetServiceCreation } from '@/store/slices/serviceCreationSlice';
import { addCreatedService } from '@/store/slices/smartServiceSlice';
import { CheckCircle, Link, Code, Share2, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ServiceCompletionProps {
  onCreateAnother: () => void;
  onManageServices: () => void;
}

const ServiceCompletion: React.FC<ServiceCompletionProps> = ({
  onCreateAnother,
  onManageServices
}) => {
  const dispatch = useAppDispatch();
  const { 
    currentService, 
    availabilityData, 
    isPublishing, 
    publishedService, 
    bookingLink, 
    embedCode,
    error 
  } = useAppSelector((state) => state.serviceCreation);

  useEffect(() => {
    if (currentService && availabilityData && !publishedService && !isPublishing) {
      // Auto-publish when we reach this step
      dispatch(createAndPublishService({
        serviceData: currentService,
        availabilityData
      }));
    }
  }, [currentService, availabilityData, publishedService, isPublishing, dispatch]);

  useEffect(() => {
    if (publishedService && bookingLink) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Add to smart service created services list
      dispatch(addCreatedService({
        id: publishedService.id,
        title: publishedService.name || 'New Service',
        description: publishedService.description || '',
        bookingType: publishedService.serviceType || '',
        createdAt: new Date().toISOString()
      }));

      toast.success('🎉 Service published successfully!');
    }
  }, [publishedService, bookingLink, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(`Publishing failed: ${error}`);
    }
  }, [error]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCreateAnother = () => {
    dispatch(resetServiceCreation());
    onCreateAnother();
  };

  if (isPublishing) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-4"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold">Publishing Your Service...</h2>
          <p className="text-muted-foreground">
            Creating booking links, setting up availability, and making your service live
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-red-600">Publishing Failed</h2>
        <p className="text-muted-foreground">{error}</p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
            Try Again
          </Button>
          <Button onClick={handleCreateAnother} className="flex-1">
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  if (!publishedService || !bookingLink) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-muted-foreground">Failed to publish service. Please try again.</p>
        <Button onClick={handleCreateAnother}>Start Over</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Success Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-green-600">
          Service Published Successfully! 🎉
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Your service "{publishedService.name}" is now live and ready for bookings
        </p>
      </div>

      {/* Service Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{publishedService.name}</span>
            <Badge variant="default">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{publishedService.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Duration:</span>
              <p className="text-muted-foreground">{publishedService.duration_mins} minutes</p>
            </div>
            <div>
              <span className="font-medium">Price:</span>
              <p className="text-muted-foreground">${publishedService.cost_factor}</p>
            </div>
            <div>
              <span className="font-medium">Type:</span>
              <p className="text-muted-foreground">{publishedService.serviceType}</p>
            </div>
            <div>
              <span className="font-medium">Meeting:</span>
              <p className="text-muted-foreground">{publishedService.meetingType}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Booking Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="flex-1 text-sm break-all">{bookingLink}</code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(bookingLink, 'Booking link')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(bookingLink, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(bookingLink, 'Booking link')}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      {embedCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Embed Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm break-all font-mono">{embedCode}</code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(embedCode, 'Embed code')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Copy this code to embed the booking form on your website
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={handleCreateAnother} variant="outline" className="flex-1">
          Create Another Service
        </Button>
        <Button onClick={onManageServices} className="flex-1">
          Manage All Services
        </Button>
      </div>
    </motion.div>
  );
};

export default ServiceCompletion;
