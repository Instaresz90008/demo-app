
// Define history data type
export interface HistoryLog {
  id: string;
  date: string;
  time: string;
  action: string;
  details: string;
  user: string;
}

// Mock history data
export const HISTORY_DATA: HistoryLog[] = [
  {
    id: "LOG-1001",
    date: "29-04-2025",
    time: "14:30:22",
    action: "Slot Created",
    details: "Created a new slot for Tuesday at 10:00 AM",
    user: "Anilkumar",
  },
  {
    id: "LOG-1002",
    date: "29-04-2025",
    time: "14:32:15",
    action: "Availability Updated",
    details: "Updated availability for May 1st-7th",
    user: "Anilkumar",
  },
  {
    id: "LOG-1003",
    date: "29-04-2025",
    time: "15:45:08",
    action: "Booking Confirmed",
    details: "Client booking confirmed for May 2nd at 2:00 PM",
    user: "System",
  },
  {
    id: "LOG-1004",
    date: "28-04-2025",
    time: "09:12:33",
    action: "Meeting Canceled",
    details: "Client canceled meeting scheduled for April 30th",
    user: "System",
  },
  {
    id: "LOG-1005",
    date: "28-04-2025",
    time: "10:05:17",
    action: "Email Notification",
    details: "Reminder email sent to clients for upcoming meetings",
    user: "System",
  },
];
