import { prisma } from "../utils/db";
import { Booking, Prisma } from "../generated/prisma/client";

export class BookingRepository {
  findAll(): Promise<Booking[]> {
    return prisma.booking.findMany();
  }

  findById(id: number): Promise<Booking | null> {
    return prisma.booking.findUnique({ where: { id } });
  }

  findPaginated(skip: number, limit: number): Promise<Booking[]> {
    return prisma.booking.findMany({ skip, take: limit });
  }

  count(): Promise<number> {
    return prisma.booking.count();
  }

  create(data: Prisma.BookingUncheckedCreateInput): Promise<Booking> {
    return prisma.booking.create({ data });
  }

  update(id: number, data: Prisma.BookingUncheckedUpdateInput): Promise<Booking> {
    return prisma.booking.update({ where: { id }, data });
  }

  async delete(id: number): Promise<boolean> {
    await prisma.booking.delete({ where: { id } });
    return true;
  }
}
