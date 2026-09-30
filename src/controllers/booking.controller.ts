import { NextFunction, Request, Response } from "express";
import { BookingService } from "../services/booking.service";
import { BadRequestError, NotFoundError } from "../errors";
import { HttpStatus } from "../constants/httpStatus";

export class BookingController {
  private readonly service = new BookingService();

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id < 1) {
      throw new BadRequestError("Booking id must be a positive integer");
    }
    return id;
  }

  // Arrow properties keep `this` bound when passed directly as Express route handlers.
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      var page = parseInt(req.query.page as string, 10) || 1;
      var limit = parseInt(req.query.limit as string, 10) || 10;
      // Ensure page and limit are positive integers
      if (page < 1) page = 1;
      if (limit < 1) limit = 10;
      // Cap page size so clients can't force the whole dataset into one response
      const MAX_LIMIT = 50;
      if (limit > MAX_LIMIT) limit = MAX_LIMIT;

      const result = await this.service.getPaginatedShifts(page, limit);
      res.status(HttpStatus.OK).json(result);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = this.parseId(req.params.id);
      const booking = await this.service.findById(id);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      res.status(HttpStatus.OK).json(booking);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request<object, unknown, unknown>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const booking = await this.service.create(req.body);
      res.status(HttpStatus.CREATED).json(booking);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request<{ id: string }, unknown, unknown>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = this.parseId(req.params.id);
      const updated = await this.service.update(id, req.body);
      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      next(err);
    }
  };

  patch = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = this.parseId(req.params.id);
      const booking = await this.service.findById(id);

      if (!booking) {
        throw new NotFoundError("Booking not found");
      }

      const updated = await this.service.update(id, {
        user_id: booking.user_id,
        desk_id: booking.desk_id,
        booking_date: booking.booking_date.toISOString().slice(0, 10),
        active: !booking.active,
      });
      res.status(HttpStatus.OK).json(updated);
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = this.parseId(req.params.id);
      await this.service.delete(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  };
}
