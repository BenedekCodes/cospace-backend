export interface Booking {
  id: string;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
}

export class BookingRepository {
  private bookings: Booking[] = [
    { id: "1", desk: "A1", floor: 1, date: "2026-09-22", active: true },
    { id: "2", desk: "B3", floor: 2, date: "2026-09-23", active: false },
    { id: "3", desk: "C2", floor: 3, date: "2026-09-24", active: true },
  ];

  findAll(): Booking[] {
    return [...this.bookings];
  }

  findById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  create(booking: Booking): Booking {
    this.bookings.push(booking);
    return booking;
  }

  update(id: string, data: Booking): Booking | undefined {
    const index = this.bookings.findIndex((b) => b.id === id);

    if (index === -1) return undefined;

    this.bookings[index] = data;
    return data;
  }

  delete(id: string): boolean {
    const index = this.bookings.findIndex((b) => b.id === id);

    if (index === -1) return false;

    this.bookings.splice(index, 1);
    return true;
  }
}
