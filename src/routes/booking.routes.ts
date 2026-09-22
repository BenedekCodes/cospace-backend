import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const router = Router();
const controller = new BookingController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.patch("/:id", (req, res) => controller.patch(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

export default router;
