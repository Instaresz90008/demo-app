
import { useState, useMemo } from "react";
import { Event, Service } from "../types";

export function useCalendarEvents(
  events: Event[],
  services: Service[],
  selectedServices: string[]
) {
  // Filter events based on selected services
  const filteredEvents = useMemo(() => {
    if (selectedServices.length === 0) {
      return events;
    }
    return events.filter(event => selectedServices.includes(event.serviceId));
  }, [events, selectedServices]);

  // Get service color for an event
  const getServiceColor = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.color || "#333";
  };

  return {
    filteredEvents,
    getServiceColor
  };
}
