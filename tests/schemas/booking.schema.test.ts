import { createBookingSchema } from "../../src/schemas/booking.schema";

describe("createBookingSchema", () => {
  it("accepts a valid booking and defaults active to true", () => {
    const result = createBookingSchema.safeParse({
      user_id: 1,
      desk_id: 1,
      booking_date: "2026-10-20",
    });

    expect(result.success).toBe(true);
    expect(result.data?.active).toBe(true);
  });

  it("rejects a booking without a desk_id", () => {
    const result = createBookingSchema.safeParse({
      user_id: 1,
      booking_date: "2026-10-20",
    });

    expect(result.success).toBe(false);
  });
});
