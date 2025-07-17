
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Building, 
  CheckCircle, 
  AlertCircle,
  FileCheck,
  Globe,
  Stethoscope,
  GraduationCap,
  Users,
  Dumbbell,
  Scale
} from 'lucide-react';

interface ComplianceTrackerProps {
  industry: string;
  status: 'pending' | 'approved' | 'failed';
  submissionDate: string;
  currentStep: string;
}

const industryConfig = {
  healthcare: {
    icon: Stethoscope,
    stepLabel: 'Medical License Match',
    description: 'Verifying medical credentials and licensing'
  },
  education: {
    icon: GraduationCap,
    stepLabel: 'Accreditation Verification',
    description: 'Confirming educational institution accreditation'
  },
  coach: {
    icon: Users,
    stepLabel: 'Website / Profile Authenticity',
    description: 'Validating coaching credentials and online presence'
  },
  fitness: {
    icon: Dumbbell,
    stepLabel: 'GSTIN / Studio Registry Match',
    description: 'Verifying fitness facility registration'
  },
  legal: {
    icon: Scale,
    stepLabel: 'Bar Registration ID Check',
    description: 'Confirming legal practice authorization'
  },
  consultant: {
    icon: Building,
    stepLabel: 'Business Verification',
    description: 'Validating consulting business registration'
  }
};

export const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({
  industry,
  status,
  submissionDate,
  currentStep
}) => {
  const config = industryConfig[industry as keyof typeof industryConfig] || industryConfig.consultant;
  const IconComponent = config.icon;

  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconComponent className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            🕵️‍♂️ Your business compliance verification is in progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">📋 Status:</span>
              <Badge className={`ml-2 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="ml-1 capitalize">{status === 'pending' ? 'Under Review' : status}</span>
              </Badge>
            </div>
            
            <div>
              <span className="text-gray-600">🏢 Submitted:</span>
              <span className="ml-2 font-medium">{submissionDate}</span>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-600">⏱ Est. Time:</span>
              <span className="ml-2 font-medium">1–2 business days</span>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-600">🔄 Current Step:</span>
              <div className="mt-1">
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  <FileCheck className="w-3 h-3 mr-1" />
                  {config.stepLabel}
                </Badge>
                <p className="text-xs text-gray-600 mt-1">{config.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">✅ You can continue using the platform in setup mode.</p>
                <p className="text-xs mt-1">🔔 You'll be notified when verification is complete.</p>
              </div>
            </div>
          </div>

          {status === 'failed' && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Verification failed. Please check your submitted documents.</p>
                  <button className="text-red-600 underline text-xs mt-1">
                    Resubmit verification documents
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
