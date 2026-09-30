import { BookingRepository } from "../repositories/booking.repository";
import { Booking } from "../schemas/booking.schema";
import { BadRequestError, ConflictError, NotFoundError } from "../errors";

export { ConflictError, NotFoundError };

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

  getPaginatedShifts(page: number, limit: number): { data: Booking[]; meta: { page: number; limit: number; total: number; totalPages: number } } {
    const total = this.repository.count();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.repository.findPaginated(skip, limit);

    return { data, meta: { page, limit, total, totalPages } };
  }

  create(payload: unknown): Booking {
    if (!isValidBooking(payload)) {
      throw new BadRequestError(
        "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required"
      );
    }

    if (payload.desk.length < 3) {
      throw new BadRequestError("Desk name must be at least 3 characters long");
    }

    if (this.repository.findById(payload.id)) {
      throw new ConflictError("Booking with this id already exists");
    }

    return this.repository.create(payload);
  }

  update(id: string, payload: unknown): Booking {
    if (!this.repository.findById(id)) {
      throw new NotFoundError("Booking not found");
    }

    if (!isValidBooking(payload)) {
      throw new BadRequestError(
        "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required"
      );
    }

    if (payload.desk.length < 3) {
      throw new BadRequestError("Desk name must be at least 3 characters long");
    }

    // id is sourced from the URL, not the body, so a booking can never be renamed via PUT
    return this.repository.update(id, { ...payload, id }) as Booking;
  }

  delete(id: string): void {
    if (!this.repository.findById(id)) {
      throw new NotFoundError("Booking not found");
    }

    this.repository.delete(id);
  }
}
