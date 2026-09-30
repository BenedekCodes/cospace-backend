import { NextFunction, Request, Response, Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { auth } from "../middleware/auth";
import { validateSchema } from "../middleware/validate";
import { createBookingSchema } from "../schemas/booking.schema";

const router = Router();
const controller = new BookingController();

router.get("/", (req, res, next) => controller.getAll(req, res, next));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.post("/", auth, validateSchema(createBookingSchema), (req, res, next) => controller.create(req, res, next));
router.put("/:id", auth, validateSchema(createBookingSchema), (req: Request<{ id: string }>, res: Response, next: NextFunction) =>
  controller.update(req, res, next)
);
router.patch("/:id", auth, (req: Request<{ id: string }>, res: Response, next: NextFunction) => controller.patch(req, res, next));
router.delete("/:id", auth, (req: Request<{ id: string }>, res: Response, next: NextFunction) => controller.delete(req, res, next));

export default router;

