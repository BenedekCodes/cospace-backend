import { Request, Response } from "express";
import { BookingService, ConflictError } from "../services/booking.service";

export class BookingController {
  private readonly service = new BookingService();

  // Arrow properties keep `this` bound when passed directly as Express route handlers.
  getAll = (req: Request, res: Response): void => {
    res.status(200).json(this.service.findAll());
  };

  getById = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    const booking = this.service.findById(id);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.status(200).json(booking);
  };

  create = (req: Request<object, unknown, unknown>, res: Response): void => {
    try {
      const booking = this.service.create(req.body);
      res.status(201).json(booking);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  update = (req: Request<{ id: string }, unknown, unknown>, res: Response): void => {
    const { id } = req.params;

    try {
      const updated = this.service.update(id, req.body);

      if (!updated) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      res.status(200).json(updated);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  patch = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    const booking = this.service.findById(id);

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    try {
      const updated = this.service.update(id, { ...booking, active: !booking.active });
      res.status(200).json(updated);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  delete = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;
    const deleted = this.service.delete(id);

    if (!deleted) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.status(204).send();
  };

  private handleError(err: unknown, res: Response): void {
    if (err instanceof ConflictError) {
      res.status(409).json({ error: err.message });
      return;
    }

    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
}
