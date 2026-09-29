import { z } from "zod";

export const createBookingSchema = z.object({
  desk: z.string().trim().min(3).max(100),
  floor: z.number().int(),
  date: z.iso.date(),
  active: z.boolean().optional().default(true),
});

export const bookingSchema = createBookingSchema.extend({
  id: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;
