import { CalendarEvent, Reminder } from '@prisma/client';

export interface SecretaryRepository {
  createEvent(data: any): Promise<CalendarEvent>;
  getEventsByUserId(userId: string): Promise<CalendarEvent[]>;
  createReminder(data: any): Promise<Reminder>;
  getRemindersByUserId(userId: string): Promise<Reminder[]>;
  completeReminder(id: string, userId: string): Promise<void>;
}
