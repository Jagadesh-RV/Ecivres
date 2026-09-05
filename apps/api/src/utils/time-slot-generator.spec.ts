import { generateTimeSlots } from './time-slot-generator';

describe('TimeSlotGenerator', () => {
  it('should generate hourly slots between 9 AM and 5 PM', () => {
    const slots = generateTimeSlots(9, 17, 60);
    expect(slots.length).toBe(8);
    expect(slots[0]).toEqual({
      startTime: '09:00',
      endTime: '10:00',
      available: true,
    });
    expect(slots[7]).toEqual({
      startTime: '16:00',
      endTime: '17:00',
      available: true,
    });
  });

  it('should mark booked slots as unavailable', () => {
    const slots = generateTimeSlots(9, 12, 60, ['10:00']);
    expect(slots.length).toBe(3);
    expect(slots[0].available).toBe(true);
    expect(slots[1].available).toBe(false); // 10:00 is booked
    expect(slots[2].available).toBe(true);
  });
});
