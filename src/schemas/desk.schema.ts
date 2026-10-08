import { z } from "zod";

export const createDeskSchema = z.object({
  name: z.string().trim().min(1).max(100),
  floor: z.number().int().min(0).max(99),
});

export type CreateDeskInput = z.infer<typeof createDeskSchema>;
