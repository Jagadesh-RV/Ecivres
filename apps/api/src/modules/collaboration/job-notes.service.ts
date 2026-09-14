import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SiteInspectionNote {
  id: string;
  bookingId: string;
  authorId: string;
  content: string;
  photoUrls: string[];
  createdAt: Date;
}

@Injectable()
export class JobNotesService {
  private notesStore: Map<string, SiteInspectionNote[]> = new Map();

  constructor(private readonly prisma: PrismaService) {}

  async addSiteNote(
    bookingId: string,
    authorId: string,
    content: string,
    photoUrls: string[] = [],
  ): Promise<SiteInspectionNote> {
    const list = this.notesStore.get(bookingId) || [];
    const note: SiteInspectionNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingId,
      authorId,
      content,
      photoUrls,
      createdAt: new Date(),
    };
    list.push(note);
    this.notesStore.set(bookingId, list);
    return note;
  }

  async getNotes(bookingId: string): Promise<SiteInspectionNote[]> {
    return this.notesStore.get(bookingId) || [];
  }
}
