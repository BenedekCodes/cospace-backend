import { Router, Request, Response } from "express";

export interface Booking {
  id: string;
  desk: string;
  floor: number;
  date: string;
  active: boolean;
}

const bookings: Booking[] = [
  { id: "1", desk: "A1", floor: 1, date: "2026-09-22", active: true },
  { id: "2", desk: "B3", floor: 2, date: "2026-09-23", active: false },
  { id: "3", desk: "C2", floor: 3, date: "2026-09-24", active: true },
];

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

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json(bookings);
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  res.status(200).json(booking);
});

router.post("/", (req: Request, res: Response) => {
  if (!isValidBooking(req.body)) {
    return res.status(400).json({
      message: "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required",
    });
  }

  if (bookings.some((b) => b.id === req.body.id)) {
    return res.status(409).json({ message: "Booking with this id already exists" });
  }

  bookings.push(req.body);
  res.status(201).json(req.body);
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  if (!isValidBooking(req.body)) {
    return res.status(400).json({
      message: "Invalid booking payload: id (string), desk (string), floor (number), date (string), and active (boolean) are required",
    });
  }

  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  bookings[index] = req.body;
  res.status(200).json(req.body);
});

router.patch("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const current = bookings[index] as Booking;
  const updated: Booking = { ...current, active: !current.active };
  bookings[index] = updated;
  res.status(200).json(updated);
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = bookings.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  bookings.splice(index, 1);
  res.status(204).send();
});

export default router;
