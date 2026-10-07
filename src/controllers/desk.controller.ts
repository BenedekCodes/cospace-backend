import { NextFunction, Request, Response } from "express";
import { DeskService } from "../services/desk.service";
import { HttpStatus } from "../constants/httpStatus";

export class DeskController {
  private readonly service = new DeskService();

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.service.findAll();
      res.status(HttpStatus.OK).json({ data });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // validateSchema has already parsed and trimmed req.body.
      const desk = await this.service.create(req.body);
      res.status(HttpStatus.CREATED).json(desk);
    } catch (err) {
      next(err);
    }
  };
}
