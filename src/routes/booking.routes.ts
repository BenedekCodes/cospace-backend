import { NextFunction, Request, Response, Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();
const controller = new BookingController();
const requiredBookingFields = ["id", "desk", "floor", "date", "active"];

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res, next) => controller.getById(req, res, next));
router.post("/", auth, validate(requiredBookingFields), (req, res, next) => controller.create(req, res, next));
router.put("/:id", auth, validate(requiredBookingFields), (req: Request<{ id: string }>, res: Response, next: NextFunction) =>
  controller.update(req, res, next)
);
router.patch("/:id", auth, (req: Request<{ id: string }>, res: Response, next: NextFunction) => controller.patch(req, res, next));
router.delete("/:id", auth, (req: Request<{ id: string }>, res: Response, next: NextFunction) => controller.delete(req, res, next));

export default router;

