import { Request, Response } from "express";
import { BookingService, ConflictError, NotFoundError } from "../services/booking.service";

export class BookingController {
  private readonly service = new BookingService();

  // Arrow properties keep `this` bound when passed directly as Express route handlers.
  getAll = (req: Request, res: Response): void => {
    var page = parseInt(req.query.page as string, 10) || 1;
    var limit = parseInt(req.query.limit as string, 10) || 10;
    // Ensure page and limit are positive integers
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    // Cap page size so clients can't force the whole dataset into one response
    const MAX_LIMIT = 50;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const result = this.service.getPaginatedShifts(page, limit);
    res.status(200).json(result);
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
      res.status(200).json(updated);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  patch = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;

    try {
      const booking = this.service.findById(id);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      const updated = this.service.update(id, { ...booking, active: !booking.active });
      res.status(200).json(updated);
    } catch (err) {
      this.handleError(err, res);
    }
  };

  delete = (req: Request<{ id: string }>, res: Response): void => {
    const { id } = req.params;

    try {
      this.service.delete(id);
      res.status(204).send();
    } catch (err) {
      this.handleError(err, res);
    }
  };

  private handleError(err: unknown, res: Response): void {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }

    if (err instanceof ConflictError) {
      res.status(409).json({ error: err.message });
      return;
    }

    res.status(400).json({ error: err instanceof Error ? err.message : "Invalid request" });
  }
}
