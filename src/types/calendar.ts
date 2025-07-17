
export type EventType = 'booking' | 'slot' | 'meeting' | 'block' | 'reminder';

export type Recurrence =
  | { type: 'none' }
  | { type: 'daily'; interval: number }
  | { type: 'weekly'; interval: number; daysOfWeek: number[] }
  | { type: 'monthly'; interval: number; day: number }
  | { type: 'custom'; rule: string };

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  ownerId: string;
  teamId?: string;
  start: string;
  end: string;
  recurrence?: Recurrence;
  createdBy: string;
  visibility: 'private' | 'team' | 'org';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  isSlot: boolean;
}

export type CalendarPermission =
  | 'view_events'
  | 'create_events'
  | 'edit_events'
  | 'delete_events'
  | 'view_slots'
  | 'create_slots'
  | 'edit_slots'
  | 'delete_slots'
  | 'manage_recurring'
  | 'edit_others_events'
  | 'delete_others_events';

export interface RoleCalendarPermissions {
  [role: string]: CalendarPermission[];
}
