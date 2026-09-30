import { Booking, Prisma } from "../generated/prisma/client";
import { BookingRepository } from "../repositories/booking.repository";
import { createBookingSchema } from "../schemas/booking.schema";
import { ConflictError, NotFoundError } from "../errors";

export { ConflictError, NotFoundError };

export class BookingService {
  constructor(private readonly repository: BookingRepository = new BookingRepository()) {}

  findAll(): Promise<Booking[]> {
    return this.repository.findAll();
  }

  findById(id: number): Promise<Booking | null> {
    return this.repository.findById(id);
  }

  async getPaginatedShifts(
    page: number,
    limit: number
  ): Promise<{ data: Booking[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const total = await this.repository.count();
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = await this.repository.findPaginated(skip, limit);

    return { data, meta: { page, limit, total, totalPages } };
  }

  async create(payload: unknown): Promise<Booking> {
    const input = createBookingSchema.parse(payload);

    try {
      return await this.repository.create({
        user_id: input.user_id,
        desk_id: input.desk_id,
        booking_date: new Date(input.booking_date),
        active: input.active,
      });
    } catch (err) {
      throw this.mapPrismaError(err);
    }
  }

  async update(id: number, payload: unknown): Promise<Booking> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Booking not found");
    }

    const input = createBookingSchema.parse(payload);

    try {
      // id is sourced from the URL, not the body, so a booking can never be renamed via PUT
      return await this.repository.update(id, {
        user_id: input.user_id,
        desk_id: input.desk_id,
        booking_date: new Date(input.booking_date),
        active: input.active,
      });
    } catch (err) {
      throw this.mapPrismaError(err);
    }
  }

  async delete(id: number): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError("Booking not found");
    }

    await this.repository.delete(id);
  }

  // Prisma's unique-constraint violation (desk already booked for that date) surfaces as our ConflictError shape
  private mapPrismaError(err: unknown): unknown {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return new ConflictError("A booking already exists for this desk and date");
    }
    return err;
  }
}
