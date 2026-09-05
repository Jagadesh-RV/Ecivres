export interface TimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  available: boolean;
}

export function generateTimeSlots(
  startHour: number = 9,
  endHour: number = 17,
  slotDurationMinutes: number = 60,
  bookedSlots: string[] = [],
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  let currentMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  while (currentMinutes + slotDurationMinutes <= endMinutes) {
    const startH = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
    const startM = (currentMinutes % 60).toString().padStart(2, '0');
    
    const endMinutesCalc = currentMinutes + slotDurationMinutes;
    const endH = Math.floor(endMinutesCalc / 60).toString().padStart(2, '0');
    const endM = (endMinutesCalc % 60).toString().padStart(2, '0');

    const startTime = `${startH}:${startM}`;
    const endTime = `${endH}:${endM}`;
    const slotString = `${startTime}-${endTime}`;

    const available = !bookedSlots.includes(startTime) && !bookedSlots.includes(slotString);

    slots.push({
      startTime,
      endTime,
      available,
    });

    currentMinutes += slotDurationMinutes;
  }

  return slots;
}
