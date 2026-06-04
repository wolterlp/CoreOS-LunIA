import { prisma } from '../../../shared/infrastructure/prisma.client';
import { SecretaryRepository } from '../domain/secretary.repository';
import { CalendarEvent, Reminder } from '@prisma/client';

export class PrismaSecretaryRepository implements SecretaryRepository {
  async createEvent(data: any): Promise<CalendarEvent> {
    return await prisma.calendarEvent.create({ data });
  }

  async getEventsByUserId(userId: string): Promise<CalendarEvent[]> {
    return await prisma.calendarEvent.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });
  }

  async createReminder(data: any): Promise<Reminder> {
    return await prisma.reminder.create({ data });
  }

  async getRemindersByUserId(userId: string): Promise<Reminder[]> {
    return await prisma.reminder.findMany({
      where: { userId, isCompleted: false },
      orderBy: { dueDate: 'asc' }
    });
  }

  async completeReminder(id: string, userId: string): Promise<void> {
    await prisma.reminder.updateMany({
      where: { id, userId },
      data: { isCompleted: true }
    });
  }
}
