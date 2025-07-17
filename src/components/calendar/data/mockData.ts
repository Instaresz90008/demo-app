
import { Event, Service } from "../types";

// Mock services data
export const services: Service[] = [
  { id: "1", name: "Legal Advice", color: "#4f46e5" },
  { id: "2", name: "Financial Planning", color: "#10b981" },
  { id: "3", name: "Technical Support", color: "#f59e0b" },
  { id: "4", name: "Career Counseling", color: "#ec4899" }
];

// Mock events data
export const allEvents: Event[] = [
  {
    id: "ev1",
    title: "Legal Consultation",
    serviceId: "1",
    start: "2025-05-10T10:00:00",
    end: "2025-05-10T11:00:00",
    clientName: "Alice Johnson",
    status: "scheduled"
  },
  {
    id: "ev2",
    title: "Investment Review",
    serviceId: "2",
    start: "2025-05-12T13:30:00",
    end: "2025-05-12T14:30:00",
    clientName: "Bob Smith",
    status: "scheduled"
  },
  {
    id: "ev3",
    title: "Software Troubleshooting",
    serviceId: "3",
    start: "2025-05-14T15:00:00",
    end: "2025-05-14T16:00:00",
    clientName: "Charlie Davis",
    status: "cancelled"
  },
  {
    id: "ev4",
    title: "Resume Review",
    serviceId: "4",
    start: "2025-05-16T11:00:00",
    end: "2025-05-16T12:00:00",
    clientName: "Diana Williams",
    status: "completed"
  },
  {
    id: "ev5",
    title: "Legal Document Review",
    serviceId: "1",
    start: "2025-05-18T09:00:00",
    end: "2025-05-18T10:00:00",
    clientName: "Edward Martin",
    status: "no-show"
  }
];
