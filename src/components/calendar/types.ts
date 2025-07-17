
// Define service and event types
export interface Service {
  id: string;
  name: string;
  color: string;
}

export interface Event {
  id: string;
  title: string;
  serviceId: string;
  start: string;
  end: string;
  clientName: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
}

export type CalendarView = "day" | "week" | "month";
