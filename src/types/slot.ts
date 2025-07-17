
export interface Slot {
  id: string;
  title: string;
  date: string | Date;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'past' | 'cancelled';
  location?: string;
  attendee?: string;
  serviceId?: string;
}

export interface SlotsByDate {
  [date: string]: Slot[];
}

export interface SlotsById {
  [id: string]: Slot;
}
