import { Request, Response, Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { auth } from "../middleware/auth";
import { validate } from "../middleware/validate";

const router = Router();
const controller = new BookingController();
const requiredBookingFields = ["id", "desk", "floor", "date", "active"];

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", auth, validate(requiredBookingFields), (req, res) => controller.create(req, res));
router.put("/:id", auth, validate(requiredBookingFields), (req: Request<{ id: string }>, res: Response) =>
  controller.update(req, res)
);
router.patch("/:id", auth, (req: Request<{ id: string }>, res: Response) => controller.patch(req, res));
router.delete("/:id", auth, (req: Request<{ id: string }>, res: Response) => controller.delete(req, res));

export default router;

