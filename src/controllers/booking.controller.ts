import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { NotFoundError } from "../errors";
import { HttpStatus } from "../constants/httpStatus";

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
    res.status(HttpStatus.OK).json(result);
  };

  getById = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const booking = this.service.findById(id);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      res.status(HttpStatus.OK).json(booking);
    } catch (err) {
      next(err);
    }
  };

  create = (req: Request<object, unknown, unknown>, res: Response, next: NextFunction): void => {
    try {
      const booking = this.service.create(req.body);
      res.status(HttpStatus.CREATED).json(booking);
    } catch (err) {
      next(err);
    }
  };

  update = (req: Request<{ id: string }, unknown, unknown>, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    try {
      const updated = this.service.update(id, req.body);
      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      next(err);
    }
  };

  patch = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    try {
      const booking = this.service.findById(id);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      const updated = this.service.update(id, { ...booking, active: !booking.active });
      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    try {
      this.service.delete(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  };
}
