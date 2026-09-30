import { z } from "zod";

export const createBookingSchema = z.object({
  user_id: z.number().int().positive(),
  desk_id: z.number().int().positive(),
  booking_date: z.iso.date(),
  active: z.boolean().optional().default(true),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
