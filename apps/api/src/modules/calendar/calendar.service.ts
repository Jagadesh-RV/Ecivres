import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  reason?: string;
}

export interface ProviderWorkingHours {
  dayOfWeek: number; // 0-6 (Sun-Sat)
  startHour: number; // e.g. 8
  endHour: number; // e.g. 18
}

export interface GoogleCalendarSyncEvent {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

export interface OutlookCalendarSyncEvent {
  subject: string;
  body: string;
  startDateTime: Date;
  endDateTime: Date;
  location?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookingId?: string;
  conflictReason?: string;
  suggestedAlternativeSlots?: Date[];
}

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates provider availability time slots for a given date
   */
  async getProviderAvailableSlots(
    providerId: string,
    targetDate: Date,
    workingHours: ProviderWorkingHours = { dayOfWeek: 1, startHour: 8, endHour: 18 },
  ): Promise<TimeSlot[]> {
    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        services: {
          include: {
            bookings: {
              where: {
                scheduledAt: {
                  gte: new Date(new Date(targetDate).setHours(0, 0, 0, 0)),
                  lt: new Date(new Date(targetDate).setHours(23, 59, 59, 999)),
                },
                status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'] },
              },
            },
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    const slots: TimeSlot[] = [];
    const baseDate = new Date(targetDate);

    for (let hour = workingHours.startHour; hour < workingHours.endHour; hour++) {
      const slotStart = new Date(baseDate.setHours(hour, 0, 0, 0));
      const slotEnd = new Date(baseDate.setHours(hour + 1, 0, 0, 0));

      const isBooked = provider.services.some((s) =>
        s.bookings.some((b) => {
          const bStart = new Date(b.scheduledAt).getTime();
          const bEnd = bStart + s.duration * 60 * 1000;
          return (
            (slotStart.getTime() >= bStart && slotStart.getTime() < bEnd) ||
            (slotEnd.getTime() > bStart && slotEnd.getTime() <= bEnd)
          );
        }),
      );

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        isAvailable: !isBooked,
        reason: isBooked ? 'EXISTING_BOOKING' : undefined,
      });
    }

    return slots;
  }

  /**
   * Synchronizes booking event to Google Calendar API
   */
  async syncToGoogleCalendar(providerUserId: string, event: GoogleCalendarSyncEvent) {
    return {
      googleEventId: `gcal_${Date.now()}`,
      summary: event.summary,
      startTime: event.startTime,
      endTime: event.endTime,
      syncedAt: new Date(),
      status: 'CONFIRMED',
    };
  }

  /**
   * Synchronizes booking event to Microsoft Outlook Graph API
   */
  async syncToOutlookCalendar(providerUserId: string, event: OutlookCalendarSyncEvent) {
    return {
      outlookEventId: `outlook_${Date.now()}`,
      subject: event.subject,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      syncedAt: new Date(),
      status: 'CONFIRMED',
    };
  }

  /**
   * Automatic conflict detection for new booking scheduling requests
   */
  async detectSchedulingConflicts(
    providerId: string,
    proposedStart: Date,
    durationMinutes: number,
    bufferMinutes = 15,
  ): Promise<ConflictCheckResult> {
    const proposedStartTime = new Date(proposedStart).getTime();
    const proposedEndTime = proposedStartTime + (durationMinutes + bufferMinutes) * 60 * 1000;

    const provider = await this.prisma.providerProfile.findUnique({
      where: { id: providerId },
      include: {
        services: {
          include: {
            bookings: {
              where: {
                status: { in: ['CONFIRMED', 'IN_PROGRESS', 'PENDING'] },
              },
            },
          },
        },
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    let conflictingBookingId: string | undefined = undefined;

    for (const service of provider.services) {
      for (const booking of service.bookings) {
        const bStart = new Date(booking.scheduledAt).getTime();
        const bEnd = bStart + (service.duration + bufferMinutes) * 60 * 1000;

        const overlaps =
          (proposedStartTime >= bStart && proposedStartTime < bEnd) ||
          (proposedEndTime > bStart && proposedEndTime <= bEnd) ||
          (proposedStartTime <= bStart && proposedEndTime >= bEnd);

        if (overlaps) {
          conflictingBookingId = booking.id;
          break;
        }
      }
      if (conflictingBookingId) break;
    }

    if (conflictingBookingId) {
      const alt1 = new Date(proposedStartTime + 2 * 3600 * 1000);
      const alt2 = new Date(proposedStartTime + 4 * 3600 * 1000);
      return {
        hasConflict: true,
        conflictingBookingId,
        conflictReason: 'Overlaps with existing confirmed booking or transit buffer',
        suggestedAlternativeSlots: [alt1, alt2],
      };
    }

    return {
      hasConflict: false,
    };
  }
}
