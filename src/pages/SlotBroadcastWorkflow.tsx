
import React from 'react';
import SlotBroadcastWorkflow from '@/components/slot-broadcast/SlotBroadcastWorkflow';
import Layout from '@/components/layout/Layout';
import { useNavigate } from 'react-router-dom';

const SlotBroadcastWorkflowPage = () => {
  const navigate = useNavigate();

  const handleWorkflowComplete = (data: any) => {
    console.log('Slot broadcast completed:', data);
    navigate('/slot-broadcast');
  };

  const handleWorkflowCancel = () => {
    navigate('/slot-broadcast');
  };

  return (
    <Layout>
      <SlotBroadcastWorkflow 
        onComplete={handleWorkflowComplete}
        onCancel={handleWorkflowCancel}
      />
    </Layout>
  );
};

export default SlotBroadcastWorkflowPage;
