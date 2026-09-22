import { BookingRepository, Booking } from "../repositories/booking.repository";

export class ConflictError extends Error {}

function isValidBooking(body: unknown): body is Booking {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  return (
    typeof b.id === "string" &&
    typeof b.desk === "string" &&
    typeof b.floor === "number" &&
    typeof b.date === "string" &&
    typeof b.active === "boolean"
  );
}

export class BookingService {
  constructor(private readonly repository: BookingRepository = new BookingRepository()) {}

  findAll(): Booking[] {
    return this.repository.findAll();
  }

  findById(id: string): Booking | undefined {
    return this.repository.findById(id);
  }

  create(payload: unknown): Booking {
    if (!isValidBooking(payload)) {
      throw new Error(
        "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required"
      );
    }

    if (payload.desk.length < 3) {
      throw new Error("Desk name must be at least 3 characters long");
    }

    if (this.repository.findById(payload.id)) {
      throw new ConflictError("Booking with this id already exists");
    }

    return this.repository.create(payload);
  }

  update(id: string, payload: unknown): Booking | undefined {
    if (!isValidBooking(payload)) {
      throw new Error(
        "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required"
      );
    }

    if (payload.desk.length < 3) {
      throw new Error("Desk name must be at least 3 characters long");
    }

    // id is sourced from the URL, not the body, so a booking can never be renamed via PUT
    return this.repository.update(id, { ...payload, id });
  }

  delete(id: string): boolean {
    return this.repository.delete(id);
  }
}
