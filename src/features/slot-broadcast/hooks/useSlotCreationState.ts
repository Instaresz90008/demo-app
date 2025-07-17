
import { useState } from 'react';

export const useSlotCreationState = () => {
  const [service, setService] = useState('');
  const [serviceId, setServiceId] = useState<string | undefined>(undefined);
  const [duration, setDuration] = useState('30 min');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [serviceCost, setServiceCost] = useState('');

  const setServiceWithId = (serviceName: string, id?: string) => {
    setService(serviceName);
    setServiceId(id);
  };

  const selectService = (serviceObj: any) => {
    setService(serviceObj.name || '');
    setServiceId(serviceObj.id);
    // Set other service-related data if available
    if (serviceObj.cost) {
      setServiceCost(serviceObj.cost.toString());
    }
  };

  const saveSlot = () => {
    // Save slot logic
    console.log('Saving slot with:', {
      service,
      serviceId,
      duration,
      startTime,
      endTime,
      selectedDays,
      serviceCost
    });
  };

  const clearAllSelections = () => {
    setService('');
    setServiceId(undefined);
    setDuration('30 min');
    setStartTime('09:00');
    setEndTime('17:00');
    setSelectedDays([]);
    setServiceCost('');
  };

  return {
    service,
    setService,
    serviceId,
    setServiceId,
    setServiceWithId,
    selectService,
    duration,
    setDuration,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedDays,
    setSelectedDays,
    serviceCost,
    setServiceCost,
    saveSlot,
    clearAllSelections
  };
};
