
import React from 'react';
import { BookingType, PricingModel } from '@/types/smartService';
import WorkflowContainer from './WorkflowContainer';

interface WorkflowRendererProps {
  bookingType: BookingType;
  pricingModel: PricingModel;
  onComplete: (data: any) => void;
  onBack: () => void;
}

const WorkflowRenderer: React.FC<WorkflowRendererProps> = (props) => {
  return <WorkflowContainer {...props} />;
};

export default WorkflowRenderer;
