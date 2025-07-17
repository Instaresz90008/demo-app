
// Define event data type
export interface Event {
  id: string;
  serviceName: string;
  clientName: string;
  contactNumber: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  meetingType: string;
  clientTimeZone: string;
  status: "Scheduled" | "Cancelled" | "Completed" | "No-Show";
}

// Mock event data
export const EVENTS: Event[] = [
  {
    id: "EV-10000",
    serviceName: "Legal Advice",
    clientName: "Client 1",
    contactNumber: "(838) 863-8835",
    appointmentDate: "30-04-2025",
    startTime: "19:00 PM",
    endTime: "19:30 PM",
    meetingType: "Review",
    clientTimeZone: "UTC-8 (PST)",
    status: "No-Show",
  },
  {
    id: "EV-10001",
    serviceName: "Legal Advice",
    clientName: "Client 2",
    contactNumber: "(400) 436-4116",
    appointmentDate: "08-05-2025",
    startTime: "19:30 PM",
    endTime: "18:00 PM",
    meetingType: "Follow-up",
    clientTimeZone: "UTC+0 (GMT)",
    status: "Scheduled",
  },
  {
    id: "EV-10002",
    serviceName: "Legal Advice",
    clientName: "Client 3",
    contactNumber: "(733) 298-5796",
    appointmentDate: "11-05-2025",
    startTime: "18:00 PM",
    endTime: "18:30 PM",
    meetingType: "Follow-up",
    clientTimeZone: "UTC-8 (PST)",
    status: "Cancelled",
  },
  {
    id: "EV-10003",
    serviceName: "Financial Planning",
    clientName: "Client 4",
    contactNumber: "(662) 619-1021",
    appointmentDate: "02-05-2025",
    startTime: "18:30 PM",
    endTime: "17:00 PM",
    meetingType: "Initial Assessment",
    clientTimeZone: "UTC+8 (CST)",
    status: "Cancelled",
  },
  {
    id: "EV-10004",
    serviceName: "Technical Support",
    clientName: "Client 5",
    contactNumber: "(105) 735-7109",
    appointmentDate: "11-05-2025",
    startTime: "17:00 PM",
    endTime: "17:30 PM",
    meetingType: "Initial Assessment",
    clientTimeZone: "UTC+0 (GMT)",
    status: "Cancelled",
  },
  {
    id: "EV-10005",
    serviceName: "Career Counseling",
    clientName: "Client 6",
    contactNumber: "(392) 555-1212",
    appointmentDate: "15-05-2025",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    meetingType: "Initial Assessment",
    clientTimeZone: "UTC-5 (EST)",
    status: "Scheduled",
  },
  {
    id: "EV-10006",
    serviceName: "Technical Support",
    clientName: "Client 7",
    contactNumber: "(456) 789-0123",
    appointmentDate: "16-05-2025",
    startTime: "14:00 PM",
    endTime: "15:00 PM",
    meetingType: "Follow-up",
    clientTimeZone: "UTC+1 (CET)",
    status: "Completed",
  },
];
